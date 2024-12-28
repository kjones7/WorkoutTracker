import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { workouts } from "./schema";

// Initialize SQLite database
const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);

// Initialize database with schema
export async function initializeDatabase() {
  // Create tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      exercises TEXT NOT NULL,
      completedAt TEXT NOT NULL
    );
  `);
}

export { workouts };
