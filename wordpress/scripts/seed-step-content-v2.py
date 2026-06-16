#!/usr/bin/env python3
"""Seed rich HTML content via wp-cli"""
import subprocess, json, tempfile, os

contents = {
    965: [
        "<h2>SAPの世界観を知る</h2><p>SAPは企業の基幹業務を支えるERPシステムです。このステップではSAPの基礎を学びます。</p><div class=\"callout-box\"><div class=\"ic\">💡</div><div><div class=\"title\">パンダ先生のメモ</div><p class=\"text\">Fortune500の87%がSAPを利用しています。</p></div></div>",
        "<h2>GUI操作の基本</h2><p>SAP GUIの操作方法を学びます。</p><ul><li>起動とログイン</li><li>トランザクションコードの入力</li><li>メニューナビゲーション</li></ul>",
        "<h2>マスタとトランザクション</h2><p>マスタデータとトランザクションデータの違いを理解します。</p>",
        "<h2>はじめての仕訳入力</h2><p>FB50を使って仕訳を入力してみましょう。</p><ol><li>FB50を実行</li><li>日付と勘定科目を入力</li><li>借方/貸方の金額</li><li>保存</li></ol>",
        "<h2>SAP用語に慣れる</h2><p>よく使うSAP用語を覚えましょう。</p>",
        "<h2>コミュニティを活用</h2><p>SAP学習に役立つコミュニティリソース。</p>",
    ],
    966: [
        "<h2>要件定義の進め方</h2><p>プロジェクト成功の鍵は要件定義にあります。</p>",
        "<h2>組織構造の設計</h2><p>SAP組織単位の設計方法を学びます。</p>",
        "<h2>マスタ設計のコツ</h2><p>品質を決めるマスタデータ設計。</p>",
        "<h2>テストシナリオ作成</h2><p>効果的なテスト計画の立て方。</p>",
        "<h2>プロジェクト管理</h2><p>SAPプロジェクトの管理手法。</p>",
        "<h2>提案書の書き方</h2><p>コンサルタントの提案書作成スキル。</p>",
    ],
    967: [
        "<h2>モダンABAP構文</h2><p>S/4HANA時代の新しいABAP記法。</p>",
        "<h2>CDS Views入門</h2><p>データモデリングの新しい標準。</p>",
        "<h2>ODataサービス公開</h2><p>API公開の手順を学びます。</p>",
        "<h2>Fiori連携の基礎</h2><p>UI5とバックエンドの連携。</p>",
        "<h2>Unitテスト実践</h2><p>品質を高めるテスト手法。</p>",
        "<h2>パフォーマンス最適化</h2><p>ABAPプログラムの高速化。</p>",
    ],
}

times = ["20min", "30min", "40min", "45min", "25min", "20min"]

for pid, titles in {965: ["SAPの世界観を知る","GUI操作の基本","マスタとトランザクション","はじめての仕訳入力","SAP用語に慣れる","SAPコミュニティを活用する"],
                     966: ["要件定義の進め方","組織構造の設計","マスタ設計のコツ","テストシナリオ作成","プロジェクト管理の基礎","提案書の書き方"],
                     967: ["モダンABAP構文","CDS Views入門","ODataサービス公開","Fiori連携の基礎","Unitテスト実践","パフォーマンス最適化"]}.items():
    steps = []
    for i, t in enumerate(titles):
        steps.append({
            "step_title": t,
            "step_time": times[i] if i < len(times) else "30min",
            "step_content": contents[pid][i] if i < len(contents[pid]) else "",
        })
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(steps, f, ensure_ascii=False)
        tmp = f.name
    subprocess.run(['/usr/local/bin/wp', 'post', 'meta', 'update', str(pid), 'path_steps', '--format=json'],
        stdin=open(tmp), capture_output=True, timeout=30,
        cwd='/Users/howard/Desktop/pm/sap-panda/wordpress')
    os.unlink(tmp)
    print(f"✅ Path {pid}: {len(steps)} steps")

# Verify
r = subprocess.run(['curl', '-s', 'http://localhost:8080/wp-json/sap/v1/learning-paths/965'], capture_output=True, text=True, timeout=10)
d = json.loads(r.stdout)
s = d['data']['steps'][0]
print(f"Verify: '{s['title']}' content_len={len(s.get('content',''))}")
