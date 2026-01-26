CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manga TEXT NOT NULL,
    volume INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    author TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_comments_chapter
ON comments (manga, volume, chapter);