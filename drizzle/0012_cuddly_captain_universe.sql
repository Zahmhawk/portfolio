CREATE TABLE `login_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`started_at` integer NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `login_credentials` (
	`user_id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text,
	`force_change` integer DEFAULT 0 NOT NULL,
	`verified` integer DEFAULT 0 NOT NULL,
	`google_sub` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `login_credentials_username_unique` ON `login_credentials` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `login_credentials_email_unique` ON `login_credentials` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `login_credentials_google_sub_unique` ON `login_credentials` (`google_sub`);--> statement-breakpoint
CREATE TABLE `login_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `login_tokens` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`expires_at` text NOT NULL
);
