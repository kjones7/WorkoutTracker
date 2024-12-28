import { drizzle } from "drizzle-orm/better-sqlite3";
import * as Database from "better-sqlite3";
import { workouts } from "./schema";

// Initialize SQLite database
const sqlite = new Database.default("sqlite.db");
export const db = drizzle(sqlite);

// Initialize database with schema
export async function initializeDatabase() {
  try {
    console.log("Initializing SQLite database...");
    // Create tables if they don't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        exercises TEXT NOT NULL,
        completedAt TEXT NOT NULL
      );
    `);
    console.log("Database schema created successfully");

    // Test database connection
    const testQuery = sqlite.prepare("SELECT 1").get();
    if (testQuery) {
      console.log("Database connection test successful");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    throw error;
  }
}

export { workouts };