CREATE TABLE IF NOT EXISTS assistant_survey_drafts (
 user_id TEXT NOT NULL,
 thread_id TEXT NOT NULL,
 data TEXT NOT NULL,
 source_text TEXT NOT NULL,
 generation TEXT NOT NULL DEFAULT '{}',
 proposal_id TEXT,
 state TEXT NOT NULL DEFAULT 'collecting',
 updated_at TEXT NOT NULL,
 PRIMARY KEY(user_id,thread_id)
);
