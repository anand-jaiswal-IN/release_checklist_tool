#!/bin/sh
set -e

echo "🔄 Running database migrations..."
bun src/database/migrate.ts

echo "🚀 Starting server..."
exec bun src/server.ts
