CREATE TABLE `service_offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`service_name` varchar(60) NOT NULL,
	`title` varchar(140) NOT NULL,
	`body` varchar(400) NOT NULL,
	`code` varchar(40) NOT NULL,
	`starts_at` datetime,
	`ends_at` datetime,
	`is_active` int NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`updated_by` int,
	CONSTRAINT `service_offers_id` PRIMARY KEY(`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX `service_offers_lookup_idx` ON `service_offers` (`service_name`,`is_active`);
