CREATE TABLE `publication_access` (
	`user_id` text NOT NULL,
	`publication_id` text NOT NULL,
	`submission_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `publication_id`)
);
