CREATE TABLE `admin_sessions` (
	`token_hash` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`expires_at` datetime NOT NULL,
	`ip_hash` varchar(64) NOT NULL,
	`user_agent` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `admin_sessions_token_hash` PRIMARY KEY(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(254) NOT NULL,
	`name` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`totp_secret` varchar(64),
	`totp_last_step` int,
	`role` enum('owner','editor') NOT NULL DEFAULT 'editor',
	`is_active` int NOT NULL DEFAULT 1,
	`failed_attempts` int NOT NULL DEFAULT 0,
	`locked_until` datetime,
	`last_login_at` datetime,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`actor` varchar(254) NOT NULL,
	`action` varchar(60) NOT NULL,
	`target` varchar(120) NOT NULL,
	`detail` varchar(500) NOT NULL,
	`ip_hash` varchar(64) NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `admin_sessions_user_idx` ON `admin_sessions` (`user_id`,`expires_at`);--> statement-breakpoint
CREATE INDEX `audit_log_created_idx` ON `audit_log` (`created_at`);