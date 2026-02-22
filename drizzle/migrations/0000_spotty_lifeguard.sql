CREATE TABLE `authors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chapters` (
	`id` text PRIMARY KEY NOT NULL,
	`manga_id` text NOT NULL,
	`volume_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`number` integer NOT NULL,
	`page_count` integer NOT NULL,
	`release_date` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`manga_id`) REFERENCES `mangas`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`volume_id`) REFERENCES `volumes`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chapters_number_idx` ON `chapters` (`number`);--> statement-breakpoint
CREATE UNIQUE INDEX `chapters_volume_id_number_unique` ON `chapters` (`volume_id`,`number`);--> statement-breakpoint
CREATE TABLE `mangas` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`artist_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`artist_id`) REFERENCES `authors`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mangas_author_id_title_unique` ON `mangas` (`author_id`,`title`);--> statement-breakpoint
CREATE TABLE `volumes` (
	`id` text PRIMARY KEY NOT NULL,
	`manga_id` text NOT NULL,
	`number` integer NOT NULL,
	`release_date` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`manga_id`) REFERENCES `mangas`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `volumes_number_idx` ON `volumes` (`number`);--> statement-breakpoint
CREATE UNIQUE INDEX `volumes_manga_id_number_unique` ON `volumes` (`manga_id`,`number`);