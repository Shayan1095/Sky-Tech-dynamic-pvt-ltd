CREATE TABLE `page_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`day` varchar(10) NOT NULL,
	`path` varchar(255) NOT NULL,
	`referrer` varchar(120) NOT NULL,
	`device` enum('mobile','desktop') NOT NULL,
	`visitor_hash` varchar(64) NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `page_views_id` PRIMARY KEY(`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX `page_views_day_idx` ON `page_views` (`day`);
CREATE INDEX `page_views_path_idx` ON `page_views` (`day`,`path`);
