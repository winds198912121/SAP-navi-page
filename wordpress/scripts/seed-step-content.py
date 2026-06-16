#!/usr/bin/env python3
"""Seed rich HTML content for learning path steps"""
import subprocess, json, time

MYSQL = "/usr/local/mysql-8.1.0-macos13-x86_64/bin/mysql -u root -S /tmp/sap-panda.sock wordpress"

contents = {
    965: [
        "<h2>SAPの世界観を知る</h2><p>SAPは企業の基幹業務を支えるERPシステムです。このステップでは、SAPがどんなものか、なぜ学ぶ必要があるのかを理解します。</p><div class=\"callout-box\"><div class=\"ic\">💡</div><div><div class=\"title\">パンダ先生のひとくちメモ</div><p class=\"text\">SAPは世界で最も使われているERPシステム。 Fortune500の87%がSAPを利用しています。</p></div></div><p>SAPを学ぶことで、企業の業務プロセス全体を理解できるようになります。</p>",
        "<h2>GUI 操作の基本</h2><p>SAP GUIの基本的な操作方法を学びます。ログインからトランザクションコードの実行まで。</p><ul><li>SAP GUIの起動とログイン</li><li>トランザクションコードの入力（/nコマンド）</li><li>メニューからのナビゲーション</li><li>ヘルプ機能の使い方</li></ul><div class=\"dialog\"><div class=\"bubble\"><span class=\"who\">パンダ先生：</span>SAP GUIの操作に慣れることが最初の一歩。まずは /n コマンドを覚えよう！</div></div>",
        "<h2>マスタとトランザクション</h2><p>SAPのデータは「マスタデータ」と「トランザクションデータ」に大別されます。</p><table style=\"width:100%;border-collapse:collapse;\"><tr style=\"background:var(--accent-soft);\"><th style=\"padding:8px;border:1px solid var(--line-2);\">マスタデータ</th><th style=\"padding:8px;border:1px solid var(--line-2);\">トランザクションデータ</th></tr><tr><td style=\"padding:8px;border:1px solid var(--line-2);\">得意先マスタ</td><td style=\"padding:8px;border:1px solid var(--line-2);\">受注伝票</td></tr><tr><td style=\"padding:8px;border:1px solid var(--line-2);\">資材マスタ</td><td style=\"padding:8px;border:1px solid var(--line-2);\">購買発注</td></tr></table>",
        "<h2>はじめての仕訳入力</h2><p>FB50を使って、実際に仕訳を入力してみましょう。</p><ol><li>トランザクションコード FB50 を実行</li><li>会社コードと日付を入力</li><li>勘定科目を選択</li><li>借方/貸方の金額を入力</li><li>保存して伝票番号を確認</li></ol><div class=\"callout-box warn\"><div class=\"ic\">⚠</div><div><div class=\"title\">よくある間違い</div><p class=\"text\">借方と貸方の合計が合わないと保存できません。必ず左右のバランスを確認しましょう。</p></div></div>",
        "<h2>SAP用語に慣れる</h2><p>SAPには独自の用語がたくさんあります。よく使う用語を覚えましょう。</p><ul><li><strong>インプリメンテーション</strong>：SAP導入プロジェクト</li><li><strong>カスタマイジング</strong>：システム設定</li><li><strong>ロールアウト</strong>：他拠点への展開</li></ul>",
        "<h2>SAPコミュニティを活用する</h2><p>SAP学習ではコミュニティの活用が重要です。</p><ul><li>SAP Community - 公式Q&Aサイト</li><li>パンダ先生のブログ</li><li>SAP Press - 参考書籍</li></ul><div class=\"dialog\"><div class=\"bubble\"><span class=\"who\">パンダ先生：</span>わからないことがあったら、コミュニティで質問してみよう！先輩SAPerがきっと助けてくれる🎋</div></div>",
    ],
    966: [
        "<h2>要件定義の進め方</h2><p>SAP導入プロジェクトの成功は要件定義で決まります。</p><p>要件定義では以下のステップを踏みます：</p><ol><li>現行業務のヒアリング</li><li>課題の抽出と整理</li><li>要件定義書の作成</li><li>顧客レビューと承認</li></ol>",
        "<h2>組織構造の設計</h2><p>SAPの組織構造は業務プロセスを支える基盤です。</p><p>主要な組織単位：</p><ul><li><strong>会社コード</strong>：財務諸表を作成する最小単位</li><li><strong>プラント</strong>：生産・在庫管理の単位</li><li><strong>購買組織</strong>：購買業務の単位</li></ul>",
        "<h2>マスタ設計のコツ</h2><p>マスタデータの品質がシステム品質を決めます。</p><div class=\"callout-box\"><div class=\"ic\">💡</div><div><div class=\"title\">設計のポイント</div><p class=\"text\">マスタは「共有」と「固有」のバランスが重要。共通項目は統一し、部門固有の項目は拡張可能に。</p></div></div>",
        "<h2>テストシナリオ作成</h2><p>テストは品質を保証する重要なプロセスです。</p><p>テストシナリオの種類：</p><ul><li>単体テスト（Unit Test）</li><li>結合テスト（Integration Test）</li><li>ユーザ受入テスト（UAT）</li></ul>",
        "<h2>プロジェクト管理の基礎</h2><p>SAPプロジェクトを成功に導くための管理手法を学びます。</p><p>ウォーターフォールとアジャイル、それぞれの特徴を理解しましょう。</p>",
        "<h2>提案書の書き方</h2><p>コンサルタントに必須の提案書作成スキル。</p><p>良い提案書の3要素：</p><ol><li>課題の明確な定義</li><li>具体的な解決策</li><li>期待される効果（ROI）</li></ol>",
    ],
    967: [
        "<h2>モダンABAP構文</h2><p>S/4HANA時代のABAPは進化しています。</p><p>新しい構文を使うことでコード量が半分に！</p><pre><code>\" 従来の書き方\nLOOP AT itab INTO wa.\n  wa-field = 'X'.\n  MODIFY itab FROM wa.\nENDLOOP.\n\n\" モダンな書き方\nitab = VALUE #( FOR wa IN itab ( field = 'X' ) ).</code></pre>",
        "<h2>CDS Views入門</h2><p>CDS ViewはS/4HANAのデータモデリングの核です。</p><ul><li>ABAP Dictionaryのビューに代わる新しい定義方法</li><li>SQLベースのシンプルな構文</li><li>ODataサービスとして公開可能</li></ul>",
        "<h2>ODataサービス公開</h2><p>CDS ViewをODataサービスとして公開する手順。</p><ol><li>CDS Viewの作成</li><li>Service Bindingの登録</li><li>ゲートウェイへの公開</li><li>テストとデバッグ</li></ol>",
        "<h2>Fiori連携の基礎</h2><p>FioriアプリとABAPバックエンドの連携方法。</p><div class=\"callout-box\"><div class=\"ic\">💡</div><div><div class=\"title\">ポイント</div><p class=\"text\">Fiori Elementsを使うと、CDS Viewから自動的にUIが生成されるので開発工数を大幅に削減できます。</p></div></div>",
        "<h2>Unitテスト実践</h2><p>品質を上げる最初の一歩はテストから。</p><p>ABAP Unitの基本：</p><ul><li>テストクラスの作成</li><li>テストメソッドの実装</li><li>アサーションの使い方</li></ul>",
        "<h2>パフォーマンス最適化</h2><p>ABAPプログラムのパフォーマンスを改善するテクニック。</p><p>主要な最適化ポイント：</p><ul><li>SELECT * は使わない</li><li>FOR ALL ENTRIES の活用</li><li>内部テーブル操作の効率化</li></ul>",
    ],
}

for pid, steps in contents.items():
    steps_json = json.dumps([{"step_title": f"Step {i+1}", "step_time": "30min", "step_content": content} for i, content in enumerate(steps)], ensure_ascii=False)
    steps_json_esc = steps_json.replace("'", "\\'")
    cmd = f"UPDATE wp_postmeta SET meta_value='{steps_json_esc}' WHERE post_id={pid} AND meta_key='path_steps';"
    r = subprocess.run(MYSQL.split() + ['-e', cmd], capture_output=True, text=True, timeout=10)
    print(f"✅ Path {pid}: {len(steps)} steps with rich content")

# Get article IDs and associate them
r = subprocess.run(['curl', '-s', 'http://localhost:8080/wp-json/sap/v1/articles?per_page=20'], capture_output=True, text=True, timeout=10)
try:
    arts = json.loads(r.stdout).get('data', [])
    ids = [str(a['id']) for a in arts[:6]]
    for pid in [965, 966, 967]:
        if ids:
            cmd = f"UPDATE wp_postmeta SET meta_value='{','.join(ids)}' WHERE post_id={pid} AND meta_key='path_related_articles';"
            subprocess.run(MYSQL.split() + ['-e', cmd], capture_output=True, timeout=10)
            print(f"✅ Path {pid}: associated {len(ids)} articles")
except:
    print("⚠️ Could not associate articles")

print("\nDone!")
