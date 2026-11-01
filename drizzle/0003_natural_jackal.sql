CREATE TABLE `survey_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`survey_id` text NOT NULL,
	`version` integer NOT NULL,
	`token_hash` text NOT NULL,
	`started_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`status` text DEFAULT 'started' NOT NULL
);
--> statement-breakpoint
ALTER TABLE `answers` ADD `timing` text DEFAULT '{}' NOT NULL;