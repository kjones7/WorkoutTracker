import { drizzle } from "drizzle-orm/better-sqlite3";
import * as Database from "better-sqlite3";
import { workouts } from "./schema";

// Singleton database connection
let db: ReturnType<typeof drizzle>;
let sqlite: Database.Database;

// Initialize database with schema
export async function initializeDatabase() {
  try {
    if (db) {
      console.log("[Database] Already initialized, reusing existing connection");
      return db;
    }

    console.log("[Database] Initializing SQLite database...");

    // Initialize SQLite connection with detailed logging
    sqlite = new Database.default("sqlite.db", {
      verbose: (message) => console.log(`[SQLite Debug] ${message}`),
    });

    // Enable WAL mode for better concurrent access
    sqlite.pragma('journal_mode = WAL');

    // Create tables if they don't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        exercises TEXT NOT NULL,
        completedAt TEXT NOT NULL
      );
    `;

    console.log("[Database] Creating tables with query:", createTableQuery);

    // Use transaction for table creation
    sqlite.transaction(() => {
      sqlite.exec(createTableQuery);
    })();

    console.log("[Database] Schema created successfully");

    // Test database connection with proper type assertion
    const testQuery = sqlite.prepare("SELECT 1 as test").get() as { test: number } | undefined;
    if (testQuery?.test === 1) {
      console.log("[Database] Connection test successful");
    } else {
      throw new Error("Database connection test failed");
    }

    // Initialize Drizzle with prepared statements cache
    db = drizzle(sqlite, {
      logger: true
    });

    return db;
  } catch (error) {
    console.error("[Database] Error during initialization:", error);
    if (error instanceof Error) {
      console.error("[Database] Error details:", error.message);
      console.error("[Database] Stack trace:", error.stack);
    }
    throw error;
  }
}

// Getter for database instance with connection check
export function getDb() {
  if (!db) {
    throw new Error("[Database] Not initialized. Call initializeDatabase first.");
  }

  try {
    // Quick connection test
    const test = sqlite.prepare("SELECT 1").get();
    if (!test) {
      throw new Error("[Database] Connection lost");
    }
    return db;
  } catch (error) {
    console.error("[Database] Error accessing database:", error);
    throw new Error("[Database] Connection error, try reinitializing");
  }
}

// Cleanup function for graceful shutdown
export function closeDatabase() {
  if (sqlite) {
    console.log("[Database] Closing connection...");
    try {
      sqlite.pragma('wal_checkpoint(TRUNCATE)');
      sqlite.close();
      console.log("[Database] Connection closed successfully");
    } catch (error) {
      console.error("[Database] Error during closure:", error);
      throw error;
    }
  }
}

export { workouts };