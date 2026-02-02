CREATE TABLE comment_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(comment_id, user_id),
  FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
