CREATE TABLE `chat_requests` (
	`user_id` text NOT NULL,
	`request_id` text NOT NULL,
	`result` text,
	`created_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `request_id`)
);

--> statement-breakpoint
UPDATE settings SET data=json_set(data,'$.navShowSubtitle',json('false')) WHERE id='site';
