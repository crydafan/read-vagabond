PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chapters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`manga_id` integer NOT NULL,
	`volume_id` integer NOT NULL,
	`title` text NOT NULL,
	`number` integer NOT NULL,
	`page_count` integer NOT NULL,
	`release_date` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`manga_id`) REFERENCES `mangas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`volume_id`) REFERENCES `volumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_chapters`("id", "manga_id", "volume_id", "title", "number", "page_count", "release_date", "created_at") SELECT "id", "manga_id", "volume_id", "title", "number", "page_count", "release_date", "created_at" FROM `chapters`;--> statement-breakpoint
DROP TABLE `chapters`;--> statement-breakpoint
ALTER TABLE `__new_chapters` RENAME TO `chapters`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `chapters_volume_id_number_unique` ON `chapters` (`volume_id`,`number`);