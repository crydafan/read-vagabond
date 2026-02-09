-- Populate manga_id for all existing chapters
UPDATE chapters SET manga_id = 1 WHERE manga_id IS NULL;