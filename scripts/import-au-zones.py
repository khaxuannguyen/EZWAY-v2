"""Import the two EZWAY zone sheets. Usage: python scripts/import-au-zones.py checkzone.xlsx

Reads stored cell values only; workbook formulas/macros are never executed.
Standard A:E and Priority F:I are independent lookup tables, not joined rows.
"""
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from collections import defaultdict
from pathlib import Path

NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
source = Path(sys.argv[1])
with zipfile.ZipFile(source) as archive:
    strings = [''.join(si.itertext()) for si in ET.fromstring(archive.read('xl/sharedStrings.xml')).findall('s:si', NS)]
    def read_rows(name):
        root = ET.fromstring(archive.read(name))
        rows = []
        for row in root.findall('s:sheetData/s:row', NS):
            values = {}
            for cell in row:
                v = cell.find('s:v', NS)
                value = '' if v is None else v.text or ''
                if cell.get('t') == 's':
                    value = strings[int(value)]
                elif cell.get('t') == 'inlineStr':
                    value = ''.join(cell.find('s:is', NS).itertext())
                values[re.sub(r'\d', '', cell.get('r'))] = value
            rows.append(values)
        return rows
    aus_rows = read_rows('xl/worksheets/sheet1.xml')[3:]
    toll_rows = read_rows('xl/worksheets/sheet2.xml')[4:]

aus, standard, priority = {}, defaultdict(list), {}
for r in aus_rows:
    pc = r['A'].zfill(4)
    assert re.fullmatch(r'\d{4}', pc) and pc not in aus, f'Invalid/duplicate Aupost key: {pc}'
    aus[pc] = [r[c] for c in 'BCDEF']
for r in toll_rows:
    if r.get('A'):
        assert re.fullmatch(r'\d{4}', r['A']), f'Invalid Standard key: {r["A"]}'
        standard[r['A']].append([r[c] for c in 'BCDE'])
    if r.get('F'):
        pc = r['F'].zfill(4)
        assert re.fullmatch(r'\d{4}', pc) and pc not in priority, f'Invalid/duplicate Priority key: {pc}'
        priority[pc] = [r.get(c, '') for c in 'GHI']

destination = Path(__file__).resolve().parent.parent / 'public/data/au-zones.json'
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_text(json.dumps({'auspost': aus, 'standard': dict(standard), 'priority': priority}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(json.dumps({'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'auspostPostcodes': len(aus), 'standardRows': sum(map(len, standard.values())), 'priorityPostcodes': len(priority)}))
