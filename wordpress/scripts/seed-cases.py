#!/usr/bin/env python3
"""Seed case CPT with sample metadata"""
import requests, json, time

BASE = 'http://localhost:8080'
r = requests.post(f'{BASE}/wp-json/sap/v1/auth/login',
    json={'email': 'admin@panda-sensei.com', 'password': 'admin123'})
token = r.json()['data']['token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Get case posts
r = requests.get(f'{BASE}/wp-json/sap/v1/cases')
cases = r.json()['data']
ids = sorted([c['id'] for c in cases])
print(f'Found {len(ids)} cases: {ids}')

data = [
    {'mod': 'fi', 'rate_min': 85, 'rate_max': 100, 'urgent': True, 'location': '東京・大手町', 'remote': 'リモート併用', 'period': '長期（6ヶ月〜）', 'experience': '5年〜', 'seats': 1, 'blurb': '大手製造業の基幹システム刷新PJ。会計領域のリード候補。'},
    {'mod': 'abap', 'rate_min': 75, 'rate_max': 90, 'urgent': True, 'location': 'フルリモート', 'remote': 'フルリモート', 'period': '長期（12ヶ月〜）', 'experience': '3年〜', 'seats': 2, 'blurb': 'S/4HANA 上のアドオン開発チーム。在宅中心。'},
    {'mod': 'mm', 'rate_min': 65, 'rate_max': 78, 'urgent': False, 'location': '東京・品川', 'remote': '一部リモート', 'period': '長期（更新あり）', 'experience': '3年〜', 'seats': 1, 'blurb': '安定稼働中の小売基幹を支える保守運用＋改善。'},
    {'mod': 's4', 'rate_min': 90, 'rate_max': 110, 'urgent': False, 'location': '東京・丸の内', 'remote': '一部リモート', 'period': '長期（PJ完了まで）', 'experience': '7年〜', 'seats': 1, 'blurb': '経営の目が届く全社PJのPMO。高単価案件。'},
    {'mod': 'co', 'rate_min': 70, 'rate_max': 82, 'urgent': True, 'location': 'フルリモート', 'remote': 'フルリモート', 'period': '中期（4ヶ月〜）', 'experience': '4年〜', 'seats': 1, 'blurb': '原価計算の再設計フェーズ。週4稼働も相談可。'},
    {'mod': 'basis', 'rate_min': 60, 'rate_max': 72, 'urgent': False, 'location': '神奈川・新横浜', 'remote': '出社', 'period': '長期（更新あり）', 'experience': '3年〜', 'seats': 2, 'blurb': '安定した運用案件。チーム体制で安心。'},
    {'mod': 'pp', 'rate_min': 72, 'rate_max': 85, 'urgent': True, 'location': '愛知・名古屋', 'remote': '一部リモート', 'period': '中期（6ヶ月）', 'experience': '4年〜', 'seats': 1, 'blurb': '工場の生産計画を支える基幹改善PJ。'},
    {'mod': 'sd', 'rate_min': 68, 'rate_max': 80, 'urgent': False, 'location': 'フルリモート', 'remote': 'フルリモート', 'period': '長期（更新あり）', 'experience': '3年〜', 'seats': 1, 'blurb': '受注業務の機能拡張。フルリモートOK。'},
]

for i, cid in enumerate(ids):
    d = data[i]
    payload = {
        'meta': {
            'case_rate_min': d['rate_min'],
            'case_rate_max': d['rate_max'],
            'case_urgent': d['urgent'],
            'case_period': d['period'],
            'case_location': d['location'],
            'case_remote': d['remote'],
            'case_experience': d['experience'],
            'case_seats': d['seats'],
            'case_blurb': d['blurb'],
        },
        'sap_module': [d['mod']],
    }
    r = requests.post(f'{BASE}/wp-json/wp/v2/sap_case/{cid}', headers=headers, json=payload)
    if r.status_code == 200:
        print(f'  ✅ Case {cid}: {d["mod"]} {d["rate_min"]}~{d["rate_max"]}万')
    else:
        print(f'  ❌ Case {cid}: HTTP {r.status_code}')
    time.sleep(0.2)

# Verify
r = requests.get(f'{BASE}/wp-json/sap/v1/cases')
print('\n=== Final ===')
for c in r.json()['data']:
    print(f'  {c["title"][:30]:30s} {c["rate_min"]:3d}~{c["rate_max"]:3d}万 {str(c["mods"]):12s} urgent={str(c["urgent"]):5s} {c["location"]}')
