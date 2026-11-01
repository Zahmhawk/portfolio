CREATE TABLE `admin_changes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`entity` text NOT NULL,
	`record_id` text NOT NULL,
	`before_data` text NOT NULL,
	`after_data` text NOT NULL,
	`summary` text NOT NULL,
	`state` text DEFAULT 'draft' NOT NULL,
	`created_at` text NOT NULL,
	`applied_at` text
);
