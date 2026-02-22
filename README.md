# Release Checklist Tool

A full-stack release management application built with React, TypeScript, Hono, Drizzle ORM, and PostgreSQL.

## Project Structure

```
release-checklist-tool/
├── backend/          # Backend API (TypeScript, Bun, Hono, Drizzle)
└── frontend/         # Frontend UI (React, TypeScript, Vite, MUI)
```

## Features

- ✅ Create and manage software releases
- ✅ Track release checklist items (PRs, tests, deployments, etc.)
- ✅ Visual progress tracking
- ✅ Full CRUD operations
- ✅ Responsive Material-UI design
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Type-safe API with TypeScript

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [PostgreSQL](https://www.postgresql.org/) (14+)
- Node.js 18+ (optional, for compatibility)

## Quick Start

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb release_checklist_tool
```

Or using psql:
```sql
CREATE DATABASE release_checklist_tool;
```

### 2. Backend Setup

```bash
cd backend
bun install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Generate and run migrations
bun run db:generate
bun run db:migrate

# Or push schema directly (development)
bun run db:push

# Start backend server
bun run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
bun install

# Start frontend development server
bun run dev
```

Frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/release_checklist_tool
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Releases
- `GET /api/releases` - Get all releases
- `GET /api/releases/:id` - Get release by ID
- `POST /api/releases` - Create new release
- `PUT /api/releases/:id` - Update release
- `DELETE /api/releases/:id` - Delete release

### Health Check
- `GET /health` - Server health check

## Tech Stack

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Bun
- **Framework**: Hono
- **Language**: TypeScript
- **ORM**: Drizzle
- **Database**: PostgreSQL
- **Database Client**: postgres.js

## Database Schema

### releases table
- `id` - Serial primary key
- `release_name` - Release name (varchar 255)
- `version` - Version number (varchar 50)
- `release_date` - Release date
- `remarks` - Additional notes (text)
- `checklist` - Checklist items (JSONB)
  - prsMerged
  - changelogUpdated
  - testsPassing
  - githubReleaseCreated
  - deployedDemo
  - testedDemo
  - deployedProduction
- `checklist_progress` - Progress tracking (JSONB)
  - total
  - completed
  - percentage
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Development Scripts

### Backend
```bash
bun run dev          # Start dev server with auto-reload
bun run start        # Start production server
bun run db:generate  # Generate migration files
bun run db:migrate   # Run migrations
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio
```

### Frontend
```bash
bun run dev      # Start dev server
bun run build    # Build for production
bun run preview  # Preview production build
bun run lint     # Run ESLint
```

## Project Features

### Release Management
- Create releases with name, version, and date
- Add remarks and notes
- Track 7 predefined checklist items
- Automatic progress calculation

### UI Features
- Responsive design with Material-UI
- Breadcrumb navigation
- Loading states
- Error handling
- Confirmation dialogs
- Color-coded progress indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
