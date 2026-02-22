PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_authors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_authors`("id", "name", "created_at") SELECT "id", "name", "created_at" FROM `authors`;--> statement-breakpoint
DROP TABLE `authors`;--> statement-breakpoint
ALTER TABLE `__new_authors` RENAME TO `authors`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_chapters` (
	`id` text PRIMARY KEY NOT NULL,
	`manga_id` text NOT NULL,
	`volume_id` text NOT NULL,
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
CREATE INDEX `chapters_number_idx` ON `chapters` (`number`);--> statement-breakpoint
CREATE UNIQUE INDEX `chapters_volume_id_number_unique` ON `chapters` (`volume_id`,`number`);--> statement-breakpoint
CREATE TABLE `__new_mangas` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`artist_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`artist_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_mangas`("id", "author_id", "artist_id", "title", "description", "status", "created_at") SELECT "id", "author_id", "artist_id", "title", "description", "status", "created_at" FROM `mangas`;--> statement-breakpoint
DROP TABLE `mangas`;--> statement-breakpoint
ALTER TABLE `__new_mangas` RENAME TO `mangas`;--> statement-breakpoint
CREATE UNIQUE INDEX `mangas_author_id_title_unique` ON `mangas` (`author_id`,`title`);--> statement-breakpoint
CREATE TABLE `__new_volumes` (
	`id` text PRIMARY KEY NOT NULL,
	`manga_id` text NOT NULL,
	`number` integer NOT NULL,
	`release_date` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`manga_id`) REFERENCES `mangas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_volumes`("id", "manga_id", "number", "release_date", "created_at") SELECT "id", "manga_id", "number", "release_date", "created_at" FROM `volumes`;--> statement-breakpoint
DROP TABLE `volumes`;--> statement-breakpoint
ALTER TABLE `__new_volumes` RENAME TO `volumes`;--> statement-breakpoint
CREATE INDEX `volumes_number_idx` ON `volumes` (`number`);--> statement-breakpoint
CREATE UNIQUE INDEX `volumes_manga_id_number_unique` ON `volumes` (`manga_id`,`number`);