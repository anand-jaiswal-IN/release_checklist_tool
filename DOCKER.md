# Docker Setup Guide

This guide explains how to run the Release Checklist Tool using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

## Services

The application consists of three services:

### 1. Database (PostgreSQL)
- **Image:** postgres:16-alpine
- **Port:** 5432
- **Credentials:**
  - User: `postgres`
  - Password: `password`
  - Database: `release_checklist_tool`

### 2. Backend API
- **Technology:** Bun + Hono
- **Port:** 5000
- **Features:**
  - Automatic database migrations on startup
  - Health check endpoint at `/health`
  - API endpoints at `/api/releases`

### 3. Frontend
- **Technology:** React + Vite + Nginx
- **Port:** 80
- **Features:**
  - Production-optimized build
  - Nginx reverse proxy for API calls
  - React Router support

## Commands

### Start services in detached mode
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild services
```bash
# Rebuild all
docker-compose up --build

# Rebuild specific service
docker-compose up --build backend
```

### Stop and remove containers
```bash
docker-compose down
```

### Stop and remove containers with volumes (database data)
```bash
docker-compose down -v
```

### Access container shell
```bash
# Backend
docker-compose exec backend sh

# Database
docker-compose exec db psql -U postgres -d release_checklist_tool
```

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (production/development)

### Frontend
- `VITE_API_URL`: Backend API URL (configured during build)

## Development vs Production

### Development
For local development without Docker, use:
```bash
# Backend
cd backend
bun install
bun dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production (Docker)
The Docker setup is optimized for production:
- Multi-stage builds for smaller images
- Health checks for all services
- Automatic database migrations
- Nginx for static file serving
- Proper service dependencies

## Troubleshooting

### Database connection issues
```bash
# Check database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Backend not starting
```bash
# Check backend logs
docker-compose logs backend

# Verify database migration
docker-compose exec backend bun src/database/migrate.ts
```

### Frontend not loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Port conflicts
If ports 80, 5000, or 5432 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Frontend (change 8080 to your preferred port)
  - "5001:5000"  # Backend (change 5001 to your preferred port)
  - "5433:5432"  # Database (change 5433 to your preferred port)
```

## Data Persistence

Database data is persisted in a Docker volume named `postgres_data`. This ensures your data survives container restarts.

To reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

## Network

All services communicate through a custom bridge network called `app-network`. This allows:
- Service name resolution (e.g., `backend` resolves to the backend container)
- Isolated network communication
- Secure inter-service communication

## Health Checks

### Backend
- Endpoint: `http://localhost:5000/health`
- Interval: 30 seconds
- Response: `{"status":"OK","timestamp":"..."}`

### Database
- Command: `pg_isready -U postgres`
- Interval: 10 seconds

## Building Individual Images

### Backend
```bash
cd backend
docker build -t release-checklist-backend .
```

### Frontend
```bash
cd frontend
docker build -t release-checklist-frontend .
```

## Security Notes

⚠️ **Important:** The default database credentials are for development only. For production:
1. Change the PostgreSQL password
2. Use environment variables or secrets
3. Enable SSL for database connections
4. Configure proper CORS settings
5. Use a reverse proxy with SSL/TLS

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Bun Documentation](https://bun.sh/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
