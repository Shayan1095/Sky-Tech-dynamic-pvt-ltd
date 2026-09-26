CREATE TABLE `admin_recovery_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`code_hash` varchar(64) NOT NULL,
	`used_at` datetime,
	`created_at` datetime NOT NULL,
	CONSTRAINT `admin_recovery_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password_resets` (
	`token_hash` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`expires_at` datetime NOT NULL,
	`used_at` datetime,
	`ip_hash` varchar(64) NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `password_resets_token_hash` PRIMARY KEY(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `section_visibility` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page_key` varchar(80) NOT NULL,
	`section_key` varchar(60) NOT NULL,
	`device` varchar(20) NOT NULL,
	`hidden` int NOT NULL DEFAULT 0,
	`updated_at` datetime NOT NULL,
	`updated_by` int,
	CONSTRAINT `section_visibility_id` PRIMARY KEY(`id`),
	CONSTRAINT `section_visibility_idx` UNIQUE(`page_key`,`section_key`,`device`)
);
--> statement-breakpoint
ALTER TABLE `admin_users` ADD `pending_totp_secret` varchar(64);--> statement-breakpoint
CREATE INDEX `admin_recovery_user_idx` ON `admin_recovery_codes` (`user_id`,`used_at`);--> statement-breakpoint
CREATE INDEX `password_resets_user_idx` ON `password_resets` (`user_id`,`expires_at`);