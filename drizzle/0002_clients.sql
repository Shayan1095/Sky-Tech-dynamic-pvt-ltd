CREATE TABLE `client_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`service` varchar(60) NOT NULL,
	`package_name` varchar(160) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`billing` enum('once','monthly','yearly') NOT NULL DEFAULT 'once',
	`status` enum('proposed','active','completed','cancelled') NOT NULL DEFAULT 'proposed',
	`started_on` datetime,
	`ends_on` datetime,
	`notes` text,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `client_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`company` varchar(120) NOT NULL,
	`email` varchar(254) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`country` varchar(80) NOT NULL,
	`status` enum('lead','active','past','lost') NOT NULL DEFAULT 'lead',
	`source_enquiry_id` int,
	`notes` text,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `email_queue` ADD `client_id` int;--> statement-breakpoint
ALTER TABLE `email_queue` ADD `sent_by` int;--> statement-breakpoint
ALTER TABLE `email_queue` ADD `kind` enum('notification','reply') DEFAULT 'notification' NOT NULL;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `estimate_once` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `estimate_monthly` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `estimate_yearly` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `estimate_open` int DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `client_services_client_idx` ON `client_services` (`client_id`,`status`);--> statement-breakpoint
CREATE INDEX `clients_status_idx` ON `clients` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `clients_email_idx` ON `clients` (`email`);