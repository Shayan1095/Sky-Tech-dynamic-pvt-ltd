CREATE TABLE `service_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`service_name` varchar(60) NOT NULL,
	`package_name` varchar(160) NOT NULL,
	`price` varchar(40) NOT NULL,
	`updated_at` datetime NOT NULL,
	`updated_by` int,
	CONSTRAINT `service_prices_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_prices_item_idx` UNIQUE(`service_name`,`package_name`)
);
