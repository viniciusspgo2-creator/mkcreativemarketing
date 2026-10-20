#!/usr/bin/env bash
# Portable source archive. No database changes and no credentials in the ZIP.
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
python3 - "$PROJECT_ROOT" <<'PY'
from pathlib import Path
import sys, zipfile
root = Path(sys.argv[1])
out = root / 'download' / 'mk-creative-site-v3.1.zip'
out.parent.mkdir(exist_ok=True)
excluded = {'node_modules', '.next', '.git', 'download', 'upload', '.package-stage', 'db', 'previas'}
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in sorted(root.rglob('*')):
        rel = p.relative_to(root)
        if not p.is_file() or any(x in excluded for x in rel.parts): continue
        if p.name.startswith('.env') and p.name != '.env.example': continue
        if p.suffix in {'.log', '.tsbuildinfo', '.db'} or p.name in {'AGENTS.md', 'bun.lock'}: continue
        z.write(p, rel)
print(out)
PY
