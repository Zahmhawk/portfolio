-- ============================================================================
-- Portfolio System — Complete MySQL / MariaDB Database Schema & Initial Seed
-- Compatible with Hostinger MySQL 8.0+ and MariaDB 10.6+ (phpMyAdmin import)
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `accounts` (
  `user_id` VARCHAR(384) NOT NULL,
  `email` LONGTEXT NOT NULL,
  `role` VARCHAR(64) NOT NULL DEFAULT 'viewer',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `admin_changes` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `entity` VARCHAR(64) NOT NULL,
  `record_id` LONGTEXT NOT NULL,
  `before_data` LONGTEXT NOT NULL,
  `after_data` LONGTEXT NOT NULL,
  `summary` LONGTEXT NOT NULL,
  `state` VARCHAR(64) NOT NULL DEFAULT 'draft',
  `created_at` VARCHAR(64) NOT NULL,
  `applied_at` VARCHAR(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `ai_usage` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `connection_id` LONGTEXT NOT NULL,
  `provider` VARCHAR(64) NOT NULL,
  `model` VARCHAR(255) NOT NULL,
  `status` VARCHAR(64) NOT NULL,
  `input_tokens` BIGINT DEFAULT NULL,
  `output_tokens` BIGINT DEFAULT NULL,
  `cost_usd` VARCHAR(64) DEFAULT NULL,
  `duration_ms` BIGINT NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `answers` (
  `id` VARCHAR(384) NOT NULL,
  `survey_id` VARCHAR(384) NOT NULL,
  `version` BIGINT NOT NULL,
  `data` LONGTEXT NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  `participant` LONGTEXT NOT NULL,
  `deletion_hash` VARCHAR(255) DEFAULT NULL,
  `expires_at` VARCHAR(64) DEFAULT NULL,
  `review` LONGTEXT NOT NULL,
  `timing` LONGTEXT NOT NULL,
  `user_id` VARCHAR(384) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `assistant_preferences` (
  `user_id` VARCHAR(384) NOT NULL,
  `memories` LONGTEXT NOT NULL,
  `skills` LONGTEXT NOT NULL,
  `budget_usd` VARCHAR(64) NOT NULL DEFAULT '0',
  `updated_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `assistant_survey_drafts` (
  `user_id` VARCHAR(384) NOT NULL,
  `thread_id` VARCHAR(384) NOT NULL,
  `data` LONGTEXT NOT NULL,
  `source_text` LONGTEXT NOT NULL,
  `generation` LONGTEXT NOT NULL,
  `proposal_id` VARCHAR(384) DEFAULT NULL,
  `state` VARCHAR(64) NOT NULL DEFAULT 'collecting',
  `updated_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`user_id`, `thread_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `audit` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `action` LONGTEXT NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `chat_connections` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` LONGTEXT NOT NULL,
  `provider` VARCHAR(64) NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `encrypted_key` LONGTEXT NOT NULL,
  `models` LONGTEXT NOT NULL,
  `model` VARCHAR(255) NOT NULL DEFAULT '',
  `voice_model` VARCHAR(255) NOT NULL DEFAULT '',
  `position` BIGINT NOT NULL DEFAULT 0,
  `updated_at` VARCHAR(64) NOT NULL,
  `region` VARCHAR(64) NOT NULL DEFAULT 'us-east-1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `chat_limits` (
  `user_id` VARCHAR(384) NOT NULL,
  `window_start` BIGINT NOT NULL,
  `count` BIGINT NOT NULL DEFAULT 0,
  `busy_until` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` VARCHAR(384) NOT NULL,
  `thread_id` VARCHAR(384) NOT NULL,
  `role` VARCHAR(64) NOT NULL,
  `body` LONGTEXT NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `chat_profiles` (
  `user_id` VARCHAR(384) NOT NULL,
  `encrypted_key` LONGTEXT DEFAULT NULL,
  `model` VARCHAR(255) NOT NULL DEFAULT '',
  `updated_at` VARCHAR(64) NOT NULL,
  `active_connection` VARCHAR(384) DEFAULT NULL,
  `auto_fallback` BIGINT NOT NULL DEFAULT 0,
  `voice_name` VARCHAR(64) NOT NULL DEFAULT 'Kore',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `chat_requests` (
  `user_id` VARCHAR(384) NOT NULL,
  `request_id` VARCHAR(384) NOT NULL,
  `result` LONGTEXT DEFAULT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`user_id`, `request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `chat_threads` (
  `id` VARCHAR(384) NOT NULL,
  `user_id` VARCHAR(384) NOT NULL,
  `title` LONGTEXT NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  `updated_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `content` (
  `id` VARCHAR(384) NOT NULL,
  `kind` VARCHAR(64) NOT NULL,
  `data` LONGTEXT NOT NULL,
  `status` VARCHAR(64) NOT NULL DEFAULT 'draft',
  `position` BIGINT NOT NULL DEFAULT 0,
  `updated_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `files` (
  `id` VARCHAR(384) NOT NULL,
  `name` LONGTEXT NOT NULL,
  `mime` VARCHAR(128) NOT NULL,
  `is_public` BIGINT NOT NULL DEFAULT 0,
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `login_attempts` (
  `key` VARCHAR(384) NOT NULL,
  `started_at` BIGINT NOT NULL,
  `count` BIGINT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `login_credentials` (
  `user_id` VARCHAR(384) NOT NULL,
  `username` VARCHAR(384) NOT NULL,
  `email` VARCHAR(384) NOT NULL,
  `name` LONGTEXT NOT NULL,
  `password_hash` LONGTEXT DEFAULT NULL,
  `force_change` BIGINT NOT NULL DEFAULT 0,
  `verified` BIGINT NOT NULL DEFAULT 0,
  `google_sub` VARCHAR(384) DEFAULT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `login_credentials_google_sub_unique` (`google_sub`),
  UNIQUE KEY `login_credentials_email_unique` (`email`),
  UNIQUE KEY `login_credentials_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `login_sessions` (
  `token_hash` VARCHAR(384) NOT NULL,
  `user_id` VARCHAR(384) NOT NULL,
  `expires_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `login_tokens` (
  `token_hash` VARCHAR(384) NOT NULL,
  `user_id` VARCHAR(384) NOT NULL,
  `kind` VARCHAR(64) NOT NULL,
  `expires_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `publication_access` (
  `user_id` VARCHAR(384) NOT NULL,
  `publication_id` VARCHAR(384) NOT NULL,
  `submission_id` VARCHAR(384) NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`user_id`, `publication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `revisions` (
  `id` VARCHAR(384) NOT NULL,
  `content_id` VARCHAR(384) NOT NULL,
  `data` LONGTEXT NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(384) NOT NULL,
  `data` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `site_update_views` (
  `user_id` VARCHAR(384) NOT NULL,
  `version` VARCHAR(384) NOT NULL,
  `seen_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`user_id`, `version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` VARCHAR(384) NOT NULL,
  `kind` VARCHAR(64) NOT NULL,
  `ref` VARCHAR(384) DEFAULT NULL,
  `name` LONGTEXT NOT NULL,
  `contact` LONGTEXT NOT NULL,
  `data` LONGTEXT NOT NULL,
  `status` VARCHAR(64) NOT NULL DEFAULT 'new',
  `created_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `survey_sessions` (
  `id` VARCHAR(384) NOT NULL,
  `survey_id` VARCHAR(384) NOT NULL,
  `version` BIGINT NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `started_at` VARCHAR(64) NOT NULL,
  `expires_at` VARCHAR(64) NOT NULL,
  `status` VARCHAR(64) NOT NULL DEFAULT 'started',
  `user_id` VARCHAR(384) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `surveys` (
  `id` VARCHAR(384) NOT NULL,
  `title` LONGTEXT NOT NULL,
  `description` LONGTEXT NOT NULL,
  `consent` LONGTEXT NOT NULL,
  `questions` LONGTEXT NOT NULL,
  `status` VARCHAR(64) NOT NULL DEFAULT 'draft',
  `version` BIGINT NOT NULL DEFAULT 1,
  `created_at` VARCHAR(64) NOT NULL,
  `config` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `voice_limits` (
  `user_id` VARCHAR(384) NOT NULL,
  `window_start` BIGINT NOT NULL,
  `count` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ============================================================================
-- Initial Seed Data (Settings, Portfolio Content, & Default Admin Account)
-- Default Admin Login: NIAZIS11 / 12345678 (prompts password change on first login)
-- ============================================================================

INSERT IGNORE INTO `settings` (`id`, `data`) VALUES (
  'site',
  '{"themePreset": "forest", "themePrimary": "#28543e", "themeAccent": "#a8864b", "themeBackground": "#f7f8f2", "themeText": "#183c39", "themeSurface": "#ffffff", "themeSoft": "#e9f0e7", "siteVersion": "1.0", "themeConfigured": false, "researchCategoriesJson": "[{\\"id\\":\\"student\\",\\"label\\":\\"Student\\",\\"labelUr\\":\\"طالب علم\\",\\"active\\":true},{\\"id\\":\\"teacher\\",\\"label\\":\\"Teacher\\",\\"labelUr\\":\\"استاد\\",\\"active\\":true},{\\"id\\":\\"parent\\",\\"label\\":\\"Parent\\",\\"labelUr\\":\\"والدین\\",\\"active\\":true},{\\"id\\":\\"principal\\",\\"label\\":\\"Principal / Leader\\",\\"labelUr\\":\\"پرنسپل / قائد\\",\\"active\\":true},{\\"id\\":\\"general\\",\\"label\\":\\"General / Other\\",\\"labelUr\\":\\"عمومی / دیگر\\",\\"active\\":true}]", "surveyIntakeByCategoryJson": "{}", "compactIntakeVersion": 0, "intakeFieldsJson": "{\\"contact\\":{\\"name\\":{\\"visible\\":true,\\"required\\":true},\\"fatherName\\":{\\"visible\\":false,\\"required\\":false},\\"role\\":{\\"visible\\":true,\\"required\\":true},\\"gender\\":{\\"visible\\":false,\\"required\\":false},\\"ageGroup\\":{\\"visible\\":false,\\"required\\":false},\\"email\\":{\\"visible\\":true,\\"required\\":false},\\"phone\\":{\\"visible\\":true,\\"required\\":true},\\"whatsapp\\":{\\"visible\\":false,\\"required\\":false},\\"qualification\\":{\\"visible\\":true,\\"required\\":false},\\"profession\\":{\\"visible\\":false,\\"required\\":false},\\"designation\\":{\\"visible\\":false,\\"required\\":false},\\"experience\\":{\\"visible\\":false,\\"required\\":false},\\"studentClass\\":{\\"visible\\":false,\\"required\\":false},\\"fieldOfStudy\\":{\\"visible\\":false,\\"required\\":false},\\"institution\\":{\\"visible\\":true,\\"required\\":false},\\"city\\":{\\"visible\\":true,\\"required\\":true},\\"district\\":{\\"visible\\":false,\\"required\\":false},\\"province\\":{\\"visible\\":false,\\"required\\":false},\\"country\\":{\\"visible\\":false,\\"required\\":false},\\"purpose\\":{\\"visible\\":true,\\"required\\":true},\\"preferredContact\\":{\\"visible\\":false,\\"required\\":false},\\"contactTime\\":{\\"visible\\":false,\\"required\\":false},\\"guardianContact\\":{\\"visible\\":false,\\"required\\":false}},\\"registration\\":{\\"name\\":{\\"visible\\":true,\\"required\\":true},\\"fatherName\\":{\\"visible\\":true,\\"required\\":false},\\"role\\":{\\"visible\\":true,\\"required\\":true},\\"gender\\":{\\"visible\\":true,\\"required\\":false},\\"ageGroup\\":{\\"visible\\":true,\\"required\\":false},\\"email\\":{\\"visible\\":true,\\"required\\":false},\\"phone\\":{\\"visible\\":true,\\"required\\":true},\\"whatsapp\\":{\\"visible\\":true,\\"required\\":false},\\"qualification\\":{\\"visible\\":true,\\"required\\":false},\\"profession\\":{\\"visible\\":true,\\"required\\":false},\\"designation\\":{\\"visible\\":true,\\"required\\":false},\\"experience\\":{\\"visible\\":true,\\"required\\":false},\\"studentClass\\":{\\"visible\\":true,\\"required\\":false},\\"fieldOfStudy\\":{\\"visible\\":true,\\"required\\":false},\\"institution\\":{\\"visible\\":true,\\"required\\":false},\\"city\\":{\\"visible\\":true,\\"required\\":true},\\"district\\":{\\"visible\\":true,\\"required\\":false},\\"province\\":{\\"visible\\":true,\\"required\\":false},\\"country\\":{\\"visible\\":true,\\"required\\":false},\\"purpose\\":{\\"visible\\":true,\\"required\\":true},\\"preferredContact\\":{\\"visible\\":true,\\"required\\":false},\\"contactTime\\":{\\"visible\\":true,\\"required\\":false},\\"guardianContact\\":{\\"visible\\":true,\\"required\\":false}},\\"publication\\":{\\"name\\":{\\"visible\\":true,\\"required\\":true},\\"fatherName\\":{\\"visible\\":true,\\"required\\":false},\\"role\\":{\\"visible\\":true,\\"required\\":true},\\"gender\\":{\\"visible\\":true,\\"required\\":false},\\"ageGroup\\":{\\"visible\\":true,\\"required\\":false},\\"email\\":{\\"visible\\":true,\\"required\\":true},\\"phone\\":{\\"visible\\":true,\\"required\\":false},\\"whatsapp\\":{\\"visible\\":true,\\"required\\":false},\\"qualification\\":{\\"visible\\":true,\\"required\\":false},\\"profession\\":{\\"visible\\":true,\\"required\\":false},\\"designation\\":{\\"visible\\":true,\\"required\\":false},\\"experience\\":{\\"visible\\":true,\\"required\\":false},\\"studentClass\\":{\\"visible\\":true,\\"required\\":false},\\"fieldOfStudy\\":{\\"visible\\":true,\\"required\\":false},\\"institution\\":{\\"visible\\":true,\\"required\\":false},\\"city\\":{\\"visible\\":true,\\"required\\":true},\\"district\\":{\\"visible\\":true,\\"required\\":false},\\"province\\":{\\"visible\\":true,\\"required\\":false},\\"country\\":{\\"visible\\":true,\\"required\\":false},\\"purpose\\":{\\"visible\\":true,\\"required\\":true},\\"preferredContact\\":{\\"visible\\":true,\\"required\\":false},\\"contactTime\\":{\\"visible\\":true,\\"required\\":false},\\"guardianContact\\":{\\"visible\\":true,\\"required\\":false}},\\"survey\\":{\\"name\\":{\\"visible\\":true,\\"required\\":true},\\"fatherName\\":{\\"visible\\":false,\\"required\\":false},\\"role\\":{\\"visible\\":true,\\"required\\":true},\\"gender\\":{\\"visible\\":false,\\"required\\":false},\\"ageGroup\\":{\\"visible\\":true,\\"required\\":false},\\"email\\":{\\"visible\\":true,\\"required\\":false},\\"phone\\":{\\"visible\\":true,\\"required\\":true},\\"whatsapp\\":{\\"visible\\":false,\\"required\\":false},\\"qualification\\":{\\"visible\\":true,\\"required\\":false},\\"profession\\":{\\"visible\\":false,\\"required\\":false},\\"designation\\":{\\"visible\\":false,\\"required\\":false},\\"experience\\":{\\"visible\\":false,\\"required\\":false},\\"studentClass\\":{\\"visible\\":false,\\"required\\":false},\\"fieldOfStudy\\":{\\"visible\\":false,\\"required\\":false},\\"institution\\":{\\"visible\\":true,\\"required\\":false},\\"city\\":{\\"visible\\":true,\\"required\\":true},\\"district\\":{\\"visible\\":false,\\"required\\":false},\\"province\\":{\\"visible\\":false,\\"required\\":false},\\"country\\":{\\"visible\\":false,\\"required\\":false},\\"purpose\\":{\\"visible\\":true,\\"required\\":true},\\"preferredContact\\":{\\"visible\\":false,\\"required\\":false},\\"contactTime\\":{\\"visible\\":false,\\"required\\":false},\\"guardianContact\\":{\\"visible\\":false,\\"required\\":false}}}", "surveyThankYou": "Thank you! Your responses have been submitted successfully. Our team will review them and contact you using the details provided.", "surveyThankYouUr": "شکریہ! آپ کے جوابات موصول ہوگئے ہیں۔ ہماری ٹیم جائزہ لینے کے بعد آپ سے رابطہ کرے گی۔", "demoContent": true, "navLabelsV2": false, "navUseThemeColors": true, "navShowMenuSocial": true, "navSurveyConfigured": false, "navTheme": "blue", "navCorners": "rounded", "navEffect": "contrast", "navFont": "sans", "navSticky": true, "navDesign": "minimal", "navLayout": "stacked", "navAlign": "center", "navFontSize": 13, "navItemPadding": 18, "navBarHeight": 48, "navRadius": 14, "navShadow": true, "navBackground": "#ffffff", "navText": "#183c39", "navActiveBackground": "#183c39", "navActiveText": "#ffffff", "navBorder": "#dce2d7", "navItemsJson": "[{\\"id\\":\\"home\\",\\"href\\":\\"/\\",\\"label\\":\\"Home\\",\\"labelUr\\":\\"ابتدا\\",\\"visible\\":true,\\"newTab\\":false},{\\"id\\":\\"profile\\",\\"href\\":\\"/profile\\",\\"label\\":\\"About Me\\",\\"labelUr\\":\\"میرے بارے میں\\",\\"visible\\":true,\\"newTab\\":false},{\\"id\\":\\"services\\",\\"href\\":\\"/services\\",\\"label\\":\\"Services & trainings\\",\\"labelUr\\":\\"خدمات و تربیت\\",\\"visible\\":true,\\"newTab\\":false},{\\"id\\":\\"research\\",\\"href\\":\\"/research\\",\\"label\\":\\"Research & projects\\",\\"labelUr\\":\\"تحقیق و منصوبے\\",\\"visible\\":true,\\"newTab\\":false},{\\"id\\":\\"publications\\",\\"href\\":\\"/publications\\",\\"label\\":\\"Resources\\",\\"labelUr\\":\\"وسائل\\",\\"visible\\":true,\\"newTab\\":false},{\\"id\\":\\"test-survey\\",\\"href\\":\\"/test-and-survey\\",\\"label\\":\\"Test and Survey\\",\\"labelUr\\":\\"ٹیسٹ اور سروے\\",\\"visible\\":true,\\"newTab\\":false},{\\"id\\":\\"contact\\",\\"href\\":\\"/contact\\",\\"label\\":\\"Contact\\",\\"labelUr\\":\\"رابطہ\\",\\"visible\\":true,\\"newTab\\":false}]", "navMonogram": "AW", "navLogo": "", "navShowMark": true, "navSubtitle": "EDUCATION · MENTORSHIP · RESEARCH", "navSubtitleUr": "تعلیم · تربیت · تحقیق", "navShowSubtitle": false, "navCtaAction": "account", "navCtaLabel": "Connect", "navCtaLabelUr": "کنیکٹ کریں", "navCtaHref": "/contact", "navShowCTA": true, "bannerEnabled": true, "bannerSlidesJson": "[{\\"id\\":\\"banner-education\\",\\"image\\":\\"/banners/education.svg\\",\\"mobileImage\\":\\"\\",\\"alt\\":\\"Abstract book illustration on a green background\\",\\"title\\":\\"Learning with purpose.\\",\\"titleUr\\":\\"بامقصد تعلیم کا سفر۔\\",\\"subtitle\\":\\"EDUCATION · MENTORSHIP · GROWTH\\",\\"subtitleUr\\":\\"تعلیم · تربیت · ترقی\\",\\"body\\":\\"Supporting educators, school leaders and learners through meaningful teaching and mentorship.\\",\\"bodyUr\\":\\"بامعنی تدریس اور تربیت کے ذریعے اساتذہ، تعلیمی قائدین اور طلبہ کی رہنمائی۔\\",\\"button\\":\\"Explore my work\\",\\"buttonUr\\":\\"میرا کام دیکھیں\\",\\"href\\":\\"/profile\\",\\"enabled\\":true,\\"position\\":\\"center\\"},{\\"id\\":\\"banner-research\\",\\"image\\":\\"/banners/research.svg\\",\\"mobileImage\\":\\"\\",\\"alt\\":\\"Abstract research document illustration on a blue background\\",\\"title\\":\\"Ideas into meaningful practice.\\",\\"titleUr\\":\\"خیالات سے بامعنی عمل تک۔\\",\\"subtitle\\":\\"RESEARCH · PUBLICATIONS · PROJECTS\\",\\"subtitleUr\\":\\"تحقیق · تصانیف · منصوبے\\",\\"body\\":\\"Explore educational research, authored work and initiatives that help learning move forward.\\",\\"bodyUr\\":\\"تعلیمی تحقیق، تصانیف اور سیکھنے کو آگے بڑھانے والے منصوبے دیکھیں۔\\",\\"button\\":\\"Browse publications\\",\\"buttonUr\\":\\"تصانیف دیکھیں\\",\\"href\\":\\"/publications\\",\\"enabled\\":true,\\"position\\":\\"center\\"}]", "bannerAutoplay": true, "bannerInterval": 6, "bannerTransition": "fade", "bannerHeight": 520, "bannerOverlay": 35, "bannerBlur": 0, "bannerAlignment": "start", "bannerLayout": "full", "bannerAllPages": false, "bannerShowArrows": true, "bannerShowDots": true, "bannerTextMode": "fixed", "bannerFixedTitle": "Learning with purpose.", "bannerFixedTitleUr": "بامقصد تعلیم کا سفر۔", "bannerFixedSubtitle": "EDUCATION · MENTORSHIP · GROWTH", "bannerFixedSubtitleUr": "تعلیم · تربیت · ترقی", "bannerFixedBody": "Supporting educators, school leaders and learners through meaningful teaching and mentorship.", "bannerFixedBodyUr": "بامعنی تدریس اور تربیت کے ذریعے اساتذہ، تعلیمی قائدین اور طلبہ کی رہنمائی۔", "bannerFixedButton": "Explore my work", "bannerFixedButtonUr": "میرا کام دیکھیں", "bannerFixedHref": "/profile", "footerLinksJson": "[]", "footerSubscribe": true, "footerSubscribeTitle": "Stay connected", "footerSubscribeTitleUr": "رابطے میں رہیں", "footerSubscribeBody": "Receive updates about training, new publications and educational initiatives.", "footerSubscribeBodyUr": "تربیت، نئی تصانیف اور تعلیمی منصوبوں کی تازہ معلومات حاصل کریں۔", "showFeedback": true, "showImpact": true, "animateImpact": true, "showFeaturedTrainings": true, "showFeaturedPeople": true, "name": "Abdul Wahid", "nameUr": "عبدالواحد", "role": "Educator. Mentor. Researcher.", "roleUr": "ماہرِ تعلیم۔ مربی۔ محقق۔", "headline": "Better educators.\\nStronger futures.", "headlineUr": "بہتر اساتذہ۔\\nروشن مستقبل۔", "intro": "I work with educators, school leaders and learners to turn purposeful teaching into lasting growth.", "introUr": "میں اساتذہ، تعلیمی قائدین اور طلبہ کے ساتھ بامقصد تدریس اور پائیدار ترقی کے لیے کام کرتا ہوں۔", "bio": "As Chief Executive Officer of Advanced Institute of Mentoring, my work brings together teacher development, educational leadership, learning recovery and Qur’anic approaches to mentorship. I believe that meaningful progress begins when an educator takes responsibility for the learner.", "bioUr": "Advanced Institute of Mentoring کے چیف ایگزیکٹو آفیسر کی حیثیت سے میرا کام اساتذہ کی تربیت، تعلیمی قیادت، کمزور طلبہ کی بحالی اور قرآنی اسالیبِ تربیت کو یکجا کرتا ہے۔ میری نظر میں بامعنی ترقی کا آغاز اس وقت ہوتا ہے جب معلم طالب علم کی ذمہ داری قبول کرتا ہے۔", "quote": "Before a struggling child can own learning, an educator must own the learner.", "quoteUr": "بچے کو سیکھنے کی ذمہ داری دینے سے پہلے، معلم کو بچے کی ذمہ داری قبول کرنا ہوگی۔", "email": "", "whatsapp": "", "location": "Pakistan", "locationUr": "پاکستان", "portrait": "", "cv": "", "accent": "#a8864b", "showQuote": true, "showProjects": true, "showTrainings": true, "privacy": "We use your account, contact and registration information to manage sign-in, respond to enquiries, provide resource access and coordinate programmes. Resource access details and test or survey submissions are stored for authorised administrative review.\\n\\nResearch participation is voluntary. Please review each questionnaire’s purpose and consent information before submitting. Individual answers, assessments and reports are accessible only to authorised administrators; they are not displayed publicly or shown to participants through the website. The administrator may contact you separately to discuss your results.\\n\\nIf you use the AI assistant, your messages and attachments may be processed by the selected AI provider. Google or Apple sign-in, when enabled, uses the respective provider to verify your identity.\\n\\nContact the site owner to request access to, correction of or deletion of your identifiable records, or to withdraw your newsletter subscription.", "privacyUr": "رابطے اور رجسٹریشن کی معلومات آپ کی درخواست کا جواب دینے اور متعلقہ پروگرام کے انتظام کے لیے استعمال ہوتی ہیں۔ تحقیق میں شرکت رضاکارانہ ہے اور ہر سوال نامے میں مقصد و رضامندی واضح ہوگی۔ انفرادی تحقیقی جوابات شائع نہیں کیے جاتے۔ قابلِ شناخت ریکارڈ کی اصلاح یا حذف کے لیے سائٹ کے منتظم سے رابطہ کریں۔"}'
);

INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-0', 'experience', '{"title": "Chief Executive Officer", "titleUr": "چیف ایگزیکٹو آفیسر", "subtitle": "Advanced Institute of Mentoring", "subtitleUr": "Advanced Institute of Mentoring", "body": "Leading mentoring, professional development and educational initiatives.", "bodyUr": "تربیت، پیشہ ورانہ ترقی اور تعلیمی منصوبوں کی قیادت۔", "meta": "Current", "metaUr": "موجودہ"}', 'published', 0, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-1', 'education', '{"title": "MPhil in Qur’anic Studies", "titleUr": "ایم فل علومِ قرآن", "subtitle": "Research in progress", "subtitleUr": "تحقیق جاری ہے", "body": "Research focus: the role of Qur’anic methods in the professional development of teachers.", "bodyUr": "موضوعِ تحقیق: عصر حاضر میں اساتذہ کی پیشہ ورانہ تربیت میں قرآنی اسالیبِ تربیت کا کردار۔", "meta": "In progress", "metaUr": "جاری"}', 'published', 1, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-2', 'service', '{"title": "Teacher development", "titleUr": "اساتذہ کی پیشہ ورانہ تربیت", "subtitle": "For teachers and institutions", "subtitleUr": "اساتذہ اور اداروں کے لیے", "body": "Practical workshops on teaching skills, learner engagement and reflective classroom practice.", "bodyUr": "تدریسی مہارتوں، طلبہ کی شمولیت اور تدریسی جائزے کے لیے عملی تربیت۔", "tag": "Teaching", "tagUr": "تدریس"}', 'published', 2, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-3', 'service', '{"title": "Educational leadership", "titleUr": "تعلیمی قیادت", "subtitle": "For school leaders", "subtitleUr": "تعلیمی قائدین کے لیے", "body": "Develop purposeful leadership, stronger teams and consistent school improvement practices.", "bodyUr": "بامقصد قیادت، مضبوط ٹیم اور سکول کی مسلسل بہتری کے لیے رہنمائی۔", "tag": "Leadership", "tagUr": "قیادت"}', 'published', 3, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-4', 'service', '{"title": "Mentoring and personal growth", "titleUr": "رہنمائی اور شخصیت سازی", "subtitle": "For learners and educators", "subtitleUr": "طلبہ اور اساتذہ کے لیے", "body": "Build confidence, character and purposeful habits through educational mentoring.", "bodyUr": "تعلیمی رہنمائی کے ذریعے اعتماد، کردار اور بامقصد عادات کی نشوونما۔", "tag": "Mentoring", "tagUr": "رہنمائی"}', 'published', 4, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-5', 'service', '{"title": "Institutional collaboration", "titleUr": "ادارہ جاتی اشتراک", "subtitle": "For schools and organisations", "subtitleUr": "سکولوں اور تنظیموں کے لیے", "body": "Collaborate on training, learning recovery and educational improvement projects.", "bodyUr": "تربیت، تعلیمی بحالی اور ادارہ جاتی بہتری کے منصوبوں میں اشتراک۔", "tag": "Collaboration", "tagUr": "اشتراک"}', 'published', 5, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-6', 'project', '{"title": "Intensive Care Learning Program", "titleUr": "انتہائی نگہداشت تعلیمی پروگرام", "subtitle": "Learning recovery", "subtitleUr": "تعلیمی بحالی", "body": "ICLP supports struggling learners through diagnostic assessment, a focused recovery plan and measurable progress.", "bodyUr": "ICLP تشخیصی جائزے، مرکوز بحالی کے منصوبے اور قابلِ پیمائش پیش رفت کے ذریعے کمزور طلبہ کی مدد کرتا ہے۔", "tag": "Ongoing", "tagUr": "جاری", "meta": "Assessment → Plan → Progress", "metaUr": "تشخیص ← منصوبہ ← پیش رفت"}', 'published', 6, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-7', 'project', '{"title": "Teacher Development and Placement", "titleUr": "اساتذہ کی تربیت و تقرری", "subtitle": "Professional pathways", "subtitleUr": "پیشہ ورانہ مواقع", "body": "An AIM initiative connecting subject assessment, teaching skills, internship and placement support.", "bodyUr": "AIM کا منصوبہ جو مضمون کے جائزے، تدریسی مہارتوں، انٹرن شپ اور تقرری میں مدد کو یکجا کرتا ہے۔", "tag": "Initiative", "tagUr": "منصوبہ"}', 'published', 7, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-8', 'publication', '{"title": "Prophetic Teaching Methodologies", "titleUr": "نبوی طریقۂ تدریس", "subtitle": "Authored work", "subtitleUr": "تصنیف", "body": "An educational work exploring Prophetic approaches to teaching and mentorship.", "bodyUr": "تدریس اور تربیت کے نبوی اسالیب سے متعلق تعلیمی تصنیف۔"}', 'published', 8, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-9', 'publication', '{"title": "Comprehensive Qur’anic Qaida", "titleUr": "جامع قرآنی قاعدہ", "subtitle": "Authored work", "subtitleUr": "تصنیف", "body": "A learning resource for foundational Qur’anic reading.", "bodyUr": "قرآن خوانی کی بنیادی تعلیم کے لیے تعلیمی وسیلہ۔"}', 'published', 9, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-10', 'goal', '{"title": "Evidence informed learning recovery", "titleUr": "شواہد کی بنیاد پر تعلیمی بحالی", "subtitle": "Future direction", "subtitleUr": "آئندہ سمت", "body": "Strengthen early identification, compassionate support and measurable progress for struggling learners.", "bodyUr": "کمزور طلبہ کی بروقت شناخت، مشفقانہ مدد اور قابلِ پیمائش پیش رفت کو فروغ دینا۔"}', 'published', 10, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-11', 'skill', '{"title": "Teacher training", "titleUr": "اساتذہ کی تربیت", "subtitle": "", "subtitleUr": "", "body": ""}', 'published', 11, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-12', 'skill', '{"title": "Educational leadership", "titleUr": "تعلیمی قیادت", "subtitle": "", "subtitleUr": "", "body": ""}', 'published', 12, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-13', 'skill', '{"title": "Mentoring", "titleUr": "رہنمائی", "subtitle": "", "subtitleUr": "", "body": ""}', 'published', 13, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-14', 'skill', '{"title": "Qur’anic education", "titleUr": "قرآنی تعلیم", "subtitle": "", "subtitleUr": "", "body": ""}', 'published', 14, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-15', 'skill', '{"title": "Learning assessment", "titleUr": "تعلیمی جائزہ", "subtitle": "", "subtitleUr": "", "body": ""}', 'published', 15, '2026-11-01T00:00:00.000Z');
INSERT IGNORE INTO `content` (`id`, `kind`, `data`, `status`, `position`, `updated_at`) VALUES ('initial-16', 'skill', '{"title": "Research and analysis", "titleUr": "تحقیق و تجزیہ", "subtitle": "", "subtitleUr": "", "body": ""}', 'published', 16, '2026-11-01T00:00:00.000Z');

INSERT IGNORE INTO `accounts` (`user_id`, `email`, `role`) VALUES (
  'local_seedy',
  'seedy@sites.test',
  'owner'
);

INSERT IGNORE INTO `login_credentials` (
  `user_id`, `username`, `email`, `name`, `password_hash`, `force_change`, `verified`, `created_at`
) VALUES (
  'local_seedy',
  'niazis11',
  'admin@localhost.invalid',
  'Administrator',
  'scrypt$32768$8$3$NUbPzJNT0C-VDKw9P7s5_07i$L-I94ZnOweTATUlAe6rvSqDJFDEWCMpPjXE8dWl7_m4',
  1,
  1,
  '2026-11-01T00:00:00.000Z'
);
