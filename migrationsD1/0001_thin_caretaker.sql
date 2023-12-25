ALTER TABLE `user` RENAME TO `users`;--> statement-breakpoint
DROP INDEX IF EXISTS `user_username_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `user_email_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `user_phoneNumber_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phoneNumber_unique` ON `users` (`phoneNumber`);