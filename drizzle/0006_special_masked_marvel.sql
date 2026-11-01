CREATE TABLE `chat_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`label` text NOT NULL,
	`encrypted_key` text NOT NULL,
	`models` text DEFAULT '[]' NOT NULL,
	`model` text DEFAULT '' NOT NULL,
	`voice_model` text DEFAULT '' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `voice_limits` (
	`user_id` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `chat_profiles` ADD `active_connection` text;--> statement-breakpoint
ALTER TABLE `chat_profiles` ADD `auto_fallback` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `chat_profiles` ADD `voice_name` text DEFAULT 'Kore' NOT NULL;