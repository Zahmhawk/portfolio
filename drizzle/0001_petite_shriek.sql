ALTER TABLE `answers` ADD `participant` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `answers` ADD `deletion_hash` text;--> statement-breakpoint
ALTER TABLE `answers` ADD `expires_at` text;--> statement-breakpoint
ALTER TABLE `surveys` ADD `config` text DEFAULT '{}' NOT NULL;