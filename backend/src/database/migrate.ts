import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrationClient } from './db';

async function runMigrations() {
  console.log('🔄 Running migrations...');
  
  const db = drizzle(migrationClient);
  
  await migrate(db, { migrationsFolder: './drizzle' });
  
  console.log('✅ Migrations completed!');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
