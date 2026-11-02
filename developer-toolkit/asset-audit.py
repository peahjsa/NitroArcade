"""Check local HTML/CSS/JS references without any dependencies."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
missing=[]
for page in root.rglob('*.html'):
    content=page.read_text(encoding='utf-8',errors='replace')
    for value in re.findall(r'(?:src|href)=[\"\']([^\"\']+)',content):
        if value.startswith(('http:','https:','data:','#','javascript:','//','mailto:')):continue
        target=(page.parent/value.split('?',1)[0].split('#',1)[0]).resolve()
        if not target.exists():missing.append((str(page.relative_to(root)),value))
print('Missing local assets:',len(missing))
for a,b in missing[:200]:print(a,'->',b)
