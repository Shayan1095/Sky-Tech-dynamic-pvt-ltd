CREATE TABLE `page_text` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page_key` varchar(80) NOT NULL,
	`field_key` varchar(120) NOT NULL,
	`value` text NOT NULL,
	`updated_at` datetime NOT NULL,
	`updated_by` int,
	CONSTRAINT `page_text_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_text_field_idx` UNIQUE(`page_key`,`field_key`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
