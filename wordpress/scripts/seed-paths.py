#!/usr/bin/env python3
"""Seed additional learning paths (total 6, each 6 steps)"""
import subprocess, json, time

paths = [
    {
        "title": "FI/CO 経理実務マスターコース",
        "audience": "経理担当者",
        "desc": "経理実務に必要なFI/CO知識を実践的に学習。月次決算・原価管理・財務諸表まで対応。",
        "duration": "約10週間・30本",
        "accent": "#3b82f6",
        "steps": [
            ("経理業務の全体像を理解する", "30min"),
            ("会計伝票の基本操作", "40min"),
            ("月次決算処理の流れ", "50min"),
            ("消費税申告と税務処理", "45min"),
            ("原価計算の基礎", "40min"),
            ("財務諸表の作成と分析", "60min"),
        ]
    },
    {
        "title": "S/4HANA 移行プロジェクト実践ガイド",
        "audience": "プロジェクトメンバー",
        "desc": "ECCからのS/4移行を成功に導くための知識とスキル。Brownfield/Greenfield両対応。",
        "duration": "約12週間・36本",
        "accent": "#8b5cf6",
        "steps": [
            ("移行プロジェクトの基礎知識", "30min"),
            ("システムランドスケープ設計", "45min"),
            ("S/4HANA 簡素化リストの確認", "60min"),
            ("データ移行計画の策定", "50min"),
            ("カスタマイズ移行とテスト", "55min"),
            ("カットオーバーと本番稼働", "60min"),
        ]
    },
    {
        "title": "SAP コンサルタント入門講座",
        "audience": "新人コンサルタント",
        "desc": "SAPコンサルタントとして必要な基礎知識から実践スキルまでを体系的に学習。",
        "duration": "約8週間・24本",
        "accent": "#ec4899",
        "steps": [
            ("SAPコンサルタントの役割", "25min"),
            ("SAPモジュール概観", "35min"),
            ("要件定義の進め方", "50min"),
            ("Fit/Gap分析の実践", "55min"),
            ("テスト計画と実施方法", "45min"),
            ("ユーザートレーニングと運用支援", "40min"),
        ]
    },
]

for p in paths:
    r = subprocess.run(['/usr/local/bin/wp', 'post', 'create',
        '--post_type=learning_path', f'--post_title={p["title"]}',
        '--post_status=publish', '--porcelain'],
        capture_output=True, text=True, timeout=30,
        cwd='/Users/howard/Desktop/pm/sap-panda/wordpress')
    lines = r.stdout.strip().split('\n')
    pid = ''
    for l in reversed(lines):
        l = l.strip()
        if l.isdigit():
            pid = l
            break
    if not pid:
        print(f'❌ Failed to create: {p["title"]}')
        continue

    meta = [
        ('path_audience', p['audience']),
        ('path_description', p['desc']),
        ('path_duration', p['duration']),
        ('path_accent', p['accent']),
        ('path_steps', json.dumps([{'step_title': s[0], 'step_time': s[1]} for s in p['steps']])),
    ]
    for k, v in meta:
        subprocess.run(['/usr/local/bin/wp', 'post', 'meta', 'set', pid, k, v],
            capture_output=True, timeout=30, cwd='/Users/howard/Desktop/pm/sap-panda/wordpress')

    print(f'✅ {pid}: {p["title"]} ({p["audience"]}) - {len(p["steps"])} steps')
    time.sleep(0.3)
