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
      console.log("Database already initialized, reusing existing connection");
      return db;
    }

    console.log("Initializing SQLite database...");

    // Initialize SQLite connection
    sqlite = new Database.default("sqlite.db", {
      verbose: console.log
    });

    // Create tables if they don't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        exercises TEXT NOT NULL,
        completedAt TEXT NOT NULL
      );
    `;

    console.log("Creating tables with query:", createTableQuery);
    sqlite.exec(createTableQuery);
    console.log("Database schema created successfully");

    // Test database connection with proper type assertion
    const testQuery = sqlite.prepare("SELECT 1 as test").get() as { test: number } | undefined;
    if (testQuery?.test === 1) {
      console.log("Database connection test successful");
    } else {
      throw new Error("Database connection test failed");
    }

    // Initialize Drizzle
    db = drizzle(sqlite);
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    throw error;
  }
}

// Getter for database instance
export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDatabase first.");
  }
  return db;
}

// Cleanup function for graceful shutdown
export function closeDatabase() {
  if (sqlite) {
    console.log("Closing database connection...");
    sqlite.close();
  }
}

export { workouts };