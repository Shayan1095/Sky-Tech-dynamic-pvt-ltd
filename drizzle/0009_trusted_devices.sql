CREATE TABLE `trusted_devices` (
	`token_hash` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`expires_at` datetime NOT NULL,
	`ip_hash` varchar(64) NOT NULL,
	`user_agent` varchar(255) NOT NULL,
	`last_used_at` datetime,
	`created_at` datetime NOT NULL,
	CONSTRAINT `trusted_devices_token_hash` PRIMARY KEY(`token_hash`)
);
--> statement-breakpoint
CREATE INDEX `trusted_devices_user_idx` ON `trusted_devices` (`user_id`,`expires_at`);