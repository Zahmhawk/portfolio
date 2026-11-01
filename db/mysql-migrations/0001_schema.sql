-- DRAFT: MySQL 8.0.13+ only; validate on a disposable staging instance.
-- InnoDB, utf8mb4_0900_bin (NO PAD); indexed TEXT is bounded to 384 characters.
-- Apply only to a new staging database. See README.md before use.

CREATE TABLE `accounts` (
  `user_id` VARCHAR(384) NOT NULL,
  `email` LONGTEXT NOT NULL,
  `role` LONGTEXT NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `admin_changes` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `entity` LONGTEXT NOT NULL,
  `record_id` LONGTEXT NOT NULL,
  `before_data` LONGTEXT NOT NULL,
  `after_data` LONGTEXT NOT NULL,
  `summary` LONGTEXT NOT NULL,
  `state` LONGTEXT NOT NULL DEFAULT ('draft'),
  `created_at` LONGTEXT NOT NULL,
  `applied_at` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `ai_usage` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `connection_id` LONGTEXT NOT NULL,
  `provider` LONGTEXT NOT NULL,
  `model` LONGTEXT NOT NULL,
  `status` LONGTEXT NOT NULL,
  `input_tokens` BIGINT,
  `output_tokens` BIGINT,
  `cost_usd` LONGTEXT,
  `duration_ms` BIGINT NOT NULL,
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `answers` (
  `id` VARCHAR(384) NOT NULL,
  `survey_id` LONGTEXT NOT NULL,
  `version` BIGINT NOT NULL,
  `data` LONGTEXT NOT NULL,
  `created_at` LONGTEXT NOT NULL,
  `participant` LONGTEXT NOT NULL DEFAULT ('{}'),
  `deletion_hash` LONGTEXT,
  `expires_at` LONGTEXT,
  `review` LONGTEXT NOT NULL DEFAULT ('{}'),
  `timing` LONGTEXT NOT NULL DEFAULT ('{}'),
  `user_id` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `assistant_preferences` (
  `user_id` VARCHAR(384) NOT NULL,
  `memories` LONGTEXT NOT NULL DEFAULT ('[]'),
  `skills` LONGTEXT NOT NULL DEFAULT ('[]'),
  `budget_usd` LONGTEXT NOT NULL DEFAULT ('0'),
  `updated_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `assistant_survey_drafts` (
  `user_id` VARCHAR(384) NOT NULL,
  `thread_id` VARCHAR(384) NOT NULL,
  `data` LONGTEXT NOT NULL,
  `source_text` LONGTEXT NOT NULL,
  `generation` LONGTEXT NOT NULL DEFAULT ('{}'),
  `proposal_id` LONGTEXT,
  `state` LONGTEXT NOT NULL DEFAULT ('collecting'),
  `updated_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`user_id`, `thread_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `audit` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `action` LONGTEXT NOT NULL,
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `chat_connections` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `provider` LONGTEXT NOT NULL,
  `label` LONGTEXT NOT NULL,
  `encrypted_key` LONGTEXT NOT NULL,
  `models` LONGTEXT NOT NULL DEFAULT ('[]'),
  `model` LONGTEXT NOT NULL DEFAULT (''),
  `voice_model` LONGTEXT NOT NULL DEFAULT (''),
  `position` BIGINT NOT NULL DEFAULT 0,
  `updated_at` LONGTEXT NOT NULL,
  `region` LONGTEXT NOT NULL DEFAULT ('us-east-1'),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `chat_limits` (
  `user_id` VARCHAR(384) NOT NULL,
  `window_start` BIGINT NOT NULL,
  `count` BIGINT NOT NULL DEFAULT 0,
  `busy_until` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `chat_messages` (
  `id` VARCHAR(384) NOT NULL,
  `thread_id` LONGTEXT NOT NULL,
  `role` LONGTEXT NOT NULL,
  `body` LONGTEXT NOT NULL,
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `chat_profiles` (
  `user_id` VARCHAR(384) NOT NULL,
  `encrypted_key` LONGTEXT,
  `model` LONGTEXT NOT NULL DEFAULT (''),
  `updated_at` LONGTEXT NOT NULL,
  `active_connection` LONGTEXT,
  `auto_fallback` BIGINT NOT NULL DEFAULT 0,
  `voice_name` LONGTEXT NOT NULL DEFAULT ('Kore'),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `chat_requests` (
  `user_id` VARCHAR(384) NOT NULL,
  `request_id` VARCHAR(384) NOT NULL,
  `result` LONGTEXT,
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`user_id`, `request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `chat_threads` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `title` LONGTEXT NOT NULL,
  `created_at` LONGTEXT NOT NULL,
  `updated_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `content` (
  `id` VARCHAR(384) NOT NULL,
  `kind` LONGTEXT NOT NULL,
  `data` LONGTEXT NOT NULL,
  `status` LONGTEXT NOT NULL DEFAULT ('draft'),
  `position` BIGINT NOT NULL DEFAULT 0,
  `updated_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `files` (
  `id` VARCHAR(384) NOT NULL,
  `name` LONGTEXT NOT NULL,
  `mime` LONGTEXT NOT NULL,
  `is_public` BIGINT NOT NULL DEFAULT 0,
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `login_attempts` (
  `key` VARCHAR(384) NOT NULL,
  `started_at` BIGINT NOT NULL,
  `count` BIGINT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `login_credentials` (
  `user_id` VARCHAR(384) NOT NULL,
  `username` VARCHAR(384) NOT NULL,
  `email` VARCHAR(384) NOT NULL,
  `name` LONGTEXT NOT NULL,
  `password_hash` LONGTEXT,
  `force_change` BIGINT NOT NULL DEFAULT 0,
  `verified` BIGINT NOT NULL DEFAULT 0,
  `google_sub` VARCHAR(384),
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `login_credentials_google_sub_unique` (`google_sub`),
  UNIQUE KEY `login_credentials_email_unique` (`email`),
  UNIQUE KEY `login_credentials_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `login_sessions` (
  `token_hash` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `expires_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `login_tokens` (
  `token_hash` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `kind` LONGTEXT NOT NULL,
  `expires_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `publication_access` (
  `user_id` VARCHAR(384) NOT NULL,
  `publication_id` VARCHAR(384) NOT NULL,
  `submission_id` LONGTEXT NOT NULL,
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`user_id`, `publication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `revisions` (
  `id` VARCHAR(384) NOT NULL,
  `content_id` LONGTEXT NOT NULL,
  `data` LONGTEXT NOT NULL,
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `settings` (
  `id` VARCHAR(384) NOT NULL,
  `data` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `site_update_views` (
  `user_id` VARCHAR(384) NOT NULL,
  `version` VARCHAR(384) NOT NULL,
  `seen_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`user_id`, `version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `submissions` (
  `id` VARCHAR(384) NOT NULL,
  `kind` LONGTEXT NOT NULL,
  `ref` LONGTEXT,
  `name` LONGTEXT NOT NULL,
  `contact` LONGTEXT NOT NULL,
  `data` LONGTEXT NOT NULL,
  `status` LONGTEXT NOT NULL DEFAULT ('new'),
  `created_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `survey_sessions` (
  `id` VARCHAR(384) NOT NULL,
  `survey_id` LONGTEXT NOT NULL,
  `version` BIGINT NOT NULL,
  `token_hash` LONGTEXT NOT NULL,
  `started_at` LONGTEXT NOT NULL,
  `expires_at` LONGTEXT NOT NULL,
  `status` LONGTEXT NOT NULL DEFAULT ('started'),
  `user_id` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `surveys` (
  `id` VARCHAR(384) NOT NULL,
  `title` LONGTEXT NOT NULL,
  `description` LONGTEXT NOT NULL,
  `consent` LONGTEXT NOT NULL,
  `questions` LONGTEXT NOT NULL,
  `status` LONGTEXT NOT NULL DEFAULT ('draft'),
  `version` BIGINT NOT NULL DEFAULT 1,
  `created_at` LONGTEXT NOT NULL,
  `config` LONGTEXT NOT NULL DEFAULT ('{}'),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE `voice_limits` (
  `user_id` VARCHAR(384) NOT NULL,
  `window_start` BIGINT NOT NULL,
  `count` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

