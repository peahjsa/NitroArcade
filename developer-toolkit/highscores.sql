-- Optional server-side schema; does not run from file://
CREATE TABLE IF NOT EXISTS high_scores (
 id INTEGER PRIMARY KEY, game_id VARCHAR(120) NOT NULL,
 player_name VARCHAR(80) NOT NULL, score INTEGER NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_high_scores_game ON high_scores(game_id,score);
