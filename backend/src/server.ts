import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import releasesRouter from './routes/releases';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  "*",
  cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true,
  }),
);

// Routes
app.route('/api/releases', releasesRouter);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

const port = parseInt(process.env.PORT || '5000');
const host = process.env.HOST || '0.0.0.0';

console.log(`🚀 Server running on http://${host}:${port}`);
console.log(`📍 Health check: http://${host}:${port}/health`);

export default {
  port,
  hostname: host,
  fetch: app.fetch,
};
