<?php
// Optional PHP endpoint for a hosted edition. Requires server + configured SQLite.
header('Content-Type: application/json');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {http_response_code(405);echo json_encode(['error'=>'GET required']);exit;}
$game = substr((string)($_GET['game'] ?? ''),0,120);
if (!preg_match('/^[a-zA-Z0-9_-]{1,120}$/',$game)){http_response_code(400);echo json_encode(['error'=>'Invalid game']);exit;}
$db = new PDO('sqlite:'.__DIR__.'/scores.sqlite',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$db->exec('CREATE TABLE IF NOT EXISTS high_scores (id INTEGER PRIMARY KEY, game_id TEXT NOT NULL, player_name TEXT NOT NULL, score INTEGER NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)');
$q=$db->prepare('SELECT player_name,score FROM high_scores WHERE game_id=? ORDER BY score DESC LIMIT 10');$q->execute([$game]);echo json_encode(['game'=>$game,'scores'=>$q->fetchAll(PDO::FETCH_ASSOC)]);
