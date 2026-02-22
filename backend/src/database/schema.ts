import { pgTable, serial, varchar, date, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const releases = pgTable('releases', {
  id: serial('id').primaryKey(),
  releaseName: varchar('release_name', { length: 255 }).notNull(),
  version: varchar('version', { length: 50 }).notNull(),
  releaseDate: date('release_date').notNull(),
  remarks: text('remarks'),
  checklist: jsonb('checklist').notNull().$type<{
    prsMerged: boolean;
    changelogUpdated: boolean;
    testsPassing: boolean;
    githubReleaseCreated: boolean;
    deployedDemo: boolean;
    testedDemo: boolean;
    deployedProduction: boolean;
  }>().default({
    prsMerged: false,
    changelogUpdated: false,
    testsPassing: false,
    githubReleaseCreated: false,
    deployedDemo: false,
    testedDemo: false,
    deployedProduction: false,
  }),
  checklistProgress: jsonb('checklist_progress').notNull().$type<{
    total: number;
    completed: number;
    percentage: number;
  }>().default({
    total: 7,
    completed: 0,
    percentage: 0,
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Release = typeof releases.$inferSelect;
export type NewRelease = typeof releases.$inferInsert;
