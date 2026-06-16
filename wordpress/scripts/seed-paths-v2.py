#!/usr/bin/env python3
"""Update first 3 learning paths to have 6 steps each + assign sample articles"""
import subprocess, json, time

MYSQL = "/usr/local/mysql-8.1.0-macos13-x86_64/bin/mysql -u root -S /tmp/sap-panda.sock wordpress"

# Update path steps for IDs 965, 966, 967
updates = {
    965: [
        ("SAPの世界観を知る", "20min"), ("GUI操作の基本", "30min"),
        ("マスタとトランザクション", "40min"), ("はじめての仕訳入力", "45min"),
        ("SAP用語に慣れる", "25min"), ("SAPコミュニティを活用する", "20min"),
    ],
    966: [
        ("要件定義の進め方", "50min"), ("組織構造の設計", "60min"),
        ("マスタ設計のコツ", "45min"), ("テストシナリオ作成", "40min"),
        ("プロジェクト管理の基礎", "35min"), ("提案書の書き方", "30min"),
    ],
    967: [
        ("モダンABAP構文", "40min"), ("CDS Views入門", "55min"),
        ("ODataサービス公開", "50min"), ("Fiori連携の基礎", "60min"),
        ("Unitテスト実践", "45min"), ("パフォーマンス最適化", "50min"),
    ],
}

for pid, steps in updates.items():
    steps_json = json.dumps([{"step_title": s[0], "step_time": s[1]} for s in steps])
    subprocess.run(MYSQL.split() + ["-e", f"UPDATE wp_postmeta SET meta_value='{steps_json}' WHERE post_id={pid} AND meta_key='path_steps';"], capture_output=True, timeout=10)

    # Get some article IDs
    r = subprocess.run(['curl', '-s', f'http://localhost:8080/wp-json/sap/v1/modules/{["fi","co","abap"][list(updates.keys()).index(pid)]}/articles?per_page=5'], capture_output=True, text=True, timeout=10)
    try:
        arts = json.loads(r.stdout).get('data', [])
        ids = [str(a['id']) for a in arts if a.get('id')]
        if ids:
            subprocess.run(MYSQL.split() + ["-e", f"UPDATE wp_postmeta SET meta_value='{','.join(ids)}' WHERE post_id={pid} AND meta_key='path_related_articles';"], capture_output=True, timeout=10)
        print(f'✅ Path {pid}: {len(steps)} steps, {len(ids)} articles')
    except:
        print(f'✅ Path {pid}: {len(steps)} steps (no articles)')
    time.sleep(0.3)

print("\nDone!")
