import json,pathlib
p=pathlib.Path(__file__).resolve().parents[2]/'games.json'
print(json.loads(p.read_text(encoding='utf8')))
