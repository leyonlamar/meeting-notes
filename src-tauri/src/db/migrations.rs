use rusqlite::Connection;

/// Run all migrations in order. Each migration is idempotent.
pub fn run_migrations(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute_batch("PRAGMA journal_mode=WAL;")?;
    conn.execute_batch("PRAGMA foreign_keys=ON;")?;

    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS schema_version (
            version INTEGER PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        );"
    )?;

    let current_version: i32 = conn
        .query_row(
            "SELECT COALESCE(MAX(version), 0) FROM schema_version",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let migrations: Vec<(i32, &str)> = vec![
        (1, MIGRATION_001),
    ];

    for (version, sql) in migrations {
        if version > current_version {
            log::info!("Applying migration v{}", version);
            conn.execute_batch(sql)?;
            conn.execute(
                "INSERT INTO schema_version (version) VALUES (?1)",
                [version],
            )?;
        }
    }

    Ok(())
}

const MIGRATION_001: &str = "
-- Core meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    meeting_date TEXT,
    location TEXT,
    project TEXT,
    tags TEXT DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_project ON meetings(project);

-- Participants
CREATE TABLE IF NOT EXISTS meeting_participants (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    email TEXT
);

CREATE INDEX IF NOT EXISTS idx_participants_meeting ON meeting_participants(meeting_id);

-- Raw notes (source of truth, never modified by AI)
CREATE TABLE IF NOT EXISTS raw_notes (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'manual',
    source_filename TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_notes_meeting ON raw_notes(meeting_id);

-- Processed minutes (AI-generated or manually structured)
CREATE TABLE IF NOT EXISTS processed_minutes (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    executive_summary TEXT,
    key_discussion_points TEXT DEFAULT '[]',
    agenda TEXT,
    content_markdown TEXT,
    is_accepted INTEGER NOT NULL DEFAULT 0,
    ai_provider TEXT,
    ai_run_id TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_minutes_meeting ON processed_minutes(meeting_id);

-- Action items
CREATE TABLE IF NOT EXISTS action_items (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    owner TEXT,
    due_date TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'open',
    category TEXT,
    tags TEXT DEFAULT '[]',
    notes TEXT,
    is_tentative INTEGER NOT NULL DEFAULT 0,
    confidence_score REAL,
    source_snippet TEXT,
    source_offsets TEXT,
    ai_provider TEXT,
    ai_run_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_action_items_meeting ON action_items(meeting_id);
CREATE INDEX IF NOT EXISTS idx_action_items_owner ON action_items(owner);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_due_date ON action_items(due_date);
CREATE INDEX IF NOT EXISTS idx_action_items_priority ON action_items(priority);

-- Decisions
CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    rationale TEXT,
    decided_by TEXT,
    is_tentative INTEGER NOT NULL DEFAULT 0,
    confidence_score REAL,
    source_snippet TEXT,
    ai_run_id TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_decisions_meeting ON decisions(meeting_id);

-- Deliverables
CREATE TABLE IF NOT EXISTS deliverables (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    owner TEXT,
    due_date TEXT,
    is_tentative INTEGER NOT NULL DEFAULT 0,
    confidence_score REAL,
    source_snippet TEXT,
    ai_run_id TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_deliverables_meeting ON deliverables(meeting_id);

-- Risks and blockers
CREATE TABLE IF NOT EXISTS risks_blockers (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    risk_type TEXT NOT NULL DEFAULT 'risk',
    severity TEXT DEFAULT 'medium',
    owner TEXT,
    is_tentative INTEGER NOT NULL DEFAULT 0,
    confidence_score REAL,
    source_snippet TEXT,
    ai_run_id TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risks_blockers_meeting ON risks_blockers(meeting_id);

-- Open questions
CREATE TABLE IF NOT EXISTS open_questions (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    assigned_to TEXT,
    is_tentative INTEGER NOT NULL DEFAULT 0,
    confidence_score REAL,
    source_snippet TEXT,
    ai_run_id TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_open_questions_meeting ON open_questions(meeting_id);

-- AI processing audit trail
CREATE TABLE IF NOT EXISTS ai_processing_runs (
    id TEXT PRIMARY KEY NOT NULL,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    operation TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    model_name TEXT,
    input_hash TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    error_message TEXT,
    duration_ms INTEGER,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_runs_meeting ON ai_processing_runs(meeting_id);

-- FTS5 full-text search index
CREATE VIRTUAL TABLE IF NOT EXISTS meetings_fts USING fts5(
    meeting_id,
    title,
    raw_content,
    minutes_content,
    content='',
    tokenize='porter unicode61'
);
";
