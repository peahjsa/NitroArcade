"""Optional local worker: validate bundled catalog (Python 3)."""
import json,pathlib
p=pathlib.Path(__file__).resolve().parents[2]/'api'/'games.json'
data=json.loads(p.read_text(encoding='utf8'))
print('Catalog valid:',len(data) if isinstance(data,list) else len(data.get('games',[])),'entries')
