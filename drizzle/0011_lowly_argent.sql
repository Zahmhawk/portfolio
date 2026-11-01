CREATE TABLE `site_update_views` (
	`user_id` text NOT NULL,
	`version` text NOT NULL,
	`seen_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `version`)
);
