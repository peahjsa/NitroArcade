# Optional Python utility: validate the local games API JSON. No third-party packages.
import json
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'api'/'games.json'
games=json.loads(p.read_text(encoding='utf8'))['games']
for game in games: print(game['id'], game['title'], 'offline' if game['offline'] else 'online')
