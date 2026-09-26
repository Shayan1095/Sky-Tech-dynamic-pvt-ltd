CREATE TABLE `site_settings` (
	`setting_key` varchar(60) NOT NULL,
	`value` text NOT NULL,
	`updated_at` datetime NOT NULL,
	`updated_by` int,
	CONSTRAINT `site_settings_setting_key` PRIMARY KEY(`setting_key`)
);
