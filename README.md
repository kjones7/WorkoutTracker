
# Workout Tracker

A React-based workout tracking application built with TypeScript, Express, and Tailwind CSS. Track your workouts, exercises, and progress all in one place.

Built using Replit and Replit AI.

## Features

- Track active workouts with sets, reps, and weights
- Rest timer between sets
- Plate calculator for barbell exercises
- Exercise library with filtering by body part and category
- Workout history with completed sessions
- Mobile-friendly interface

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Express.js
- Database: SQLite with Drizzle ORM
- UI Components: Radix UI, Lucide Icons
- State Management: React Query
- Routing: Wouter

## Development

1. Fork this Repl in Replit
2. The development server will start automatically
3. Access the app at the provided URL in the Replit webview

## Project Structure

```
client/
  ├── src/
  │   ├── components/   # UI and feature components
  │   ├── data/         # Static data and templates
  │   ├── hooks/        # Custom React hooks
  │   ├── lib/          # Utilities and types
  │   └── pages/        # Application pages
server/
  ├── index.ts          # Express server setup
  └── routes.ts         # API routes
db/
  ├── index.ts          # Database initialization
  └── schema.ts         # Database schema
```

## Data Persistence

The application uses SQLite for data storage, with the following features:
- WAL (Write-Ahead Logging) mode for better concurrent access
- Drizzle ORM for type-safe database operations
- Automatic schema creation and migration

## Running the Project

The project runs automatically in Replit. The development server starts on port 5000 and includes hot module reloading for development.

## License

MIT License
