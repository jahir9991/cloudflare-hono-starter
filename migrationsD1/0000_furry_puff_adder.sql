CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text,
	`email` text DEFAULT null,
	`phoneNumber` text DEFAULT null,
	`password` text,
	`role` text DEFAULT 'USER' NOT NULL,
	`int_modifiers` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phoneNumber_unique` ON `user` (`phoneNumber`);