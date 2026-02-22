-- Create releases table
CREATE TABLE IF NOT EXISTS releases (
    id SERIAL PRIMARY KEY,
    release_name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    release_date DATE NOT NULL,
    remarks TEXT,
    checklist JSONB NOT NULL DEFAULT '{}',
    checklist_progress JSONB NOT NULL DEFAULT '{"total": 7, "completed": 0, "percentage": 0}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on release_date for faster queries
CREATE INDEX IF NOT EXISTS idx_releases_date ON releases(release_date DESC);

-- Create index on version
CREATE INDEX IF NOT EXISTS idx_releases_version ON releases(version);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_releases_updated_at 
    BEFORE UPDATE ON releases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional)
INSERT INTO releases (release_name, version, release_date, remarks, checklist, checklist_progress) 
VALUES 
    ('Version 1.0.0', '1.0.0', '2026-01-15', 'Initial release with core features', 
     '{"prsMerged": true, "changelogUpdated": true, "testsPassing": true, "githubReleaseCreated": true, "deployedDemo": true, "testedDemo": true, "deployedProduction": true}',
     '{"total": 7, "completed": 7, "percentage": 100}'),
    ('Version 1.0.1', '1.0.1', '2026-02-22', 'Bug fixes and improvements', 
     '{"prsMerged": true, "changelogUpdated": true, "testsPassing": true, "githubReleaseCreated": false, "deployedDemo": false, "testedDemo": false, "deployedProduction": false}',
     '{"total": 7, "completed": 3, "percentage": 43}')
ON CONFLICT DO NOTHING;
