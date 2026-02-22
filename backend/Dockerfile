# Use Bun base image
FROM oven/bun:1.3.9-alpine AS base

WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Copy application code
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Make entrypoint script executable
RUN chmod +x docker-entrypoint.sh

# Expose the port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e 'fetch("http://localhost:5000/health").then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))'

# Use entrypoint script to run migrations and start server
ENTRYPOINT ["./docker-entrypoint.sh"]
