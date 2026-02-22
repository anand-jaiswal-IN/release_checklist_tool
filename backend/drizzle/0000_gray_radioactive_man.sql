CREATE TABLE IF NOT EXISTS "releases" (
	"id" serial PRIMARY KEY NOT NULL,
	"release_name" varchar(255) NOT NULL,
	"version" varchar(50) NOT NULL,
	"release_date" date NOT NULL,
	"remarks" text,
	"checklist" jsonb DEFAULT '{"prsMerged":false,"changelogUpdated":false,"testsPassing":false,"githubReleaseCreated":false,"deployedDemo":false,"testedDemo":false,"deployedProduction":false}'::jsonb NOT NULL,
	"checklist_progress" jsonb DEFAULT '{"total":7,"completed":0,"percentage":0}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
