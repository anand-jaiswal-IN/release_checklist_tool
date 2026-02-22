# Release Checklist Backend

Backend API for the Release Checklist Tool built with TypeScript, Hono, Drizzle ORM, PostgreSQL, and Bun.

## Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL database running
- Node.js 18+ (optional, for compatibility)

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   bun install
   ```

2. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/release_checklist_tool
   NODE_ENV=development
   ```

3. **Create the database**
   ```bash
   createdb release_checklist_tool
   ```
   
   Or using psql:
   ```sql
   CREATE DATABASE release_checklist_tool;
   ```

4. **Generate and run migrations**
   ```bash
   # Generate migration files from schema
   bun run db:generate
   
   # Run migrations
   bun run db:migrate
   ```
   
   Alternatively, push schema directly to database (development):
   ```bash
   bun run db:push
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```
   
   The server will start on `http://localhost:5000`

## Available Scripts

- `bun run dev` - Start development server with auto-reload
- `bun run start` - Start production server
- `bun run db:generate` - Generate migration files from schema
- `bun run db:migrate` - Run database migrations
- `bun run db:push` - Push schema changes directly to database
- `bun run db:studio` - Open Drizzle Studio (database GUI)

## API Endpoints

### Releases

- `GET /api/releases` - Get all releases
- `GET /api/releases/:id` - Get release by ID
- `POST /api/releases` - Create new release
- `PUT /api/releases/:id` - Update release
- `DELETE /api/releases/:id` - Delete release

### Health Check

- `GET /health` - Check server status

## Database Schema

The `releases` table includes:
- Basic info: name, version, release date, remarks
- Checklist (JSONB): 7 checklist items
- Progress tracking (JSONB): total, completed, percentage
- Timestamps: created_at, updated_at

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **ORM**: Drizzle
- **Database**: PostgreSQL
- **Language**: TypeScript
