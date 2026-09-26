CREATE TABLE `email_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enquiry_id` int,
	`to_address` varchar(254) NOT NULL,
	`reply_to` varchar(254) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`body_text` text NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`attempts` int NOT NULL DEFAULT 0,
	`last_error` varchar(500) NOT NULL,
	`next_attempt_at` datetime NOT NULL,
	`created_at` datetime NOT NULL,
	`sent_at` datetime,
	CONSTRAINT `email_queue_id` PRIMARY KEY(`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(24) NOT NULL,
	`name` varchar(100) NOT NULL,
	`company` varchar(120) NOT NULL,
	`email` varchar(254) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`country` varchar(80) NOT NULL,
	`service` varchar(60) NOT NULL,
	`details` text NOT NULL,
	`budget` varchar(80) NOT NULL,
	`budget_custom` varchar(80) NOT NULL,
	`timeline` varchar(80) NOT NULL,
	`enquiry_type` varchar(20) NOT NULL,
	`package_name` varchar(160) NOT NULL,
	`add_ons` text NOT NULL,
	`estimate` varchar(120) NOT NULL,
	`status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
	`admin_notes` text,
	`ip_hash` varchar(64) NOT NULL,
	`user_agent` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`),
	CONSTRAINT `enquiries_reference_unique` UNIQUE(`reference`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `rate_limits` (
	`bucket` varchar(120) NOT NULL,
	`hits` int NOT NULL DEFAULT 0,
	`window_started_at` datetime NOT NULL,
	CONSTRAINT `rate_limits_bucket` PRIMARY KEY(`bucket`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX `email_queue_due_idx` ON `email_queue` (`status`,`next_attempt_at`);
CREATE INDEX `enquiries_status_created_idx` ON `enquiries` (`status`,`created_at`);
CREATE INDEX `enquiries_created_idx` ON `enquiries` (`created_at`);
