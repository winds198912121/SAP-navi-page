#!/usr/bin/env python3
"""Create path_step CPT posts for all learning paths (6-10 steps each)"""
import subprocess, json, tempfile, os, time

WP = ['/usr/local/bin/wp', '--allow-root']
CWD = '/Users/howard/Desktop/pm/sap-panda/wordpress'

paths = {
    966: ("プロジェクトで通用する設計力", [
        ("要件定義の進め方", "<h2>要件定義の基本</h2><p>プロジェクト成功の鍵は要件定義にあります。要件定義では、顧客の業務プロセスを深く理解し、SAPで実現すべき機能を明確にします。</p><h3>要件定義のステップ</h3><ol><li>現行業務のヒアリング</li><li>課題の抽出と整理</li><li>要件定義書の作成</li><li>顧客レビューと承認</li></ol><div class='callout-box'><div class='ic'>💡</div><div><div class='title'>パンダ先生の一言</div><p class='text'>「聞くは一時の恥、聞かぬは一生の恥」— 要件定義ではわからないことをそのままにしないことが最も重要です！</p></div></div>"),
        ("組織構造の設計", "<h2>SAP組織構造</h2><p>SAPの組織構造は業務プロセスを支える基盤です。適切な組織設計が後々の運用を大きく左右します。</p><h3>主要な組織単位</h3><ul><li><strong>会社コード</strong> — 財務諸表を作成する最小単位</li><li><strong>プラント</strong> — 生産・在庫管理の単位</li><li><strong>販売組織</strong> — 販売活動の単位</li><li><strong>購買組織</strong> — 購買業務の単位</li></ul><p>組織構造は業務要件に合わせて柔軟に設計しましょう。</p>", "50min"),
        ("マスタ設計のコツ", "<h2>マスタデータ設計</h2><p>マスタデータの品質がシステム品質を決めると言っても過言ではありません。</p><h3>設計のポイント</h3><ul><li>コード体系は拡張性を考慮する</li><li>重複を避け、統一的な管理を徹底</li><li>部門ごとの固有項目は拡張領域を活用</li></ul>", "45min"),
        ("テストシナリオ作成", "<h2>テスト計画と実施</h2><p>テストは品質を保証する最も重要なプロセスです。</p><h3>テストの種類</h3><ul><li><strong>単体テスト</strong> — 個別機能の確認</li><li><strong>結合テスト</strong> — モジュール間の連携確認</li><li><strong>ユーザ受入テスト</strong> — 実際の業務での確認</li></ul>", "40min"),
        ("Fit/Gap分析", "<h2>Fit/Gap分析の実践</h2><p>SAP標準機能と顧客要件の一致・不一致を分析するFit/Gapは、プロジェクトの根幹を成す作業です。</p><p>分析結果は差異対応の方針決定に直結します。</p>", "55min"),
        ("プロジェクト管理", "<h2>SAPプロジェクト管理</h2><p>SAP導入プロジェクトならではの管理ポイントを押さえましょう。</p><ul><li>スコープ管理の重要性</li><li>リソース計画と進捗管理</li><li>リスク管理とエスカレーション</li></ul>", "35min"),
        ("提案書の書き方", "<h2>コンサルタントの提案書</h2><p>良い提案書は案件獲得の決め手となります。</p><h3>提案書の3要素</h3><ol><li>課題の明確な定義</li><li>具体的な解決策とスケジュール</li><li>期待される効果（ROI）</li></ol>", "30min"),
    ]),
    967: ("ABAP × S/4HANA モダン開発", [
        ("モダンABAP構文", "<h2>新しいABAPの書き方</h2><p>S/4HANA時代のABAPは進化を遂げています。新しい構文を使うことでコード量が半分に！</p><pre><code>\" 従来の書き方\nLOOP AT itab INTO wa.\n  wa-field = 'X'.\n  MODIFY itab FROM wa.\nENDLOOP.\n\n\" モダン\nitab = VALUE #( FOR wa IN itab ( field = 'X' ) ).</code></pre>", "40min"),
        ("CDS Views入門", "<h2>CDS View完全理解</h2><p>CDS ViewはS/4HANAのデータモデリングの中核です。</p><ul><li>SQLベースのシンプルな定義</li><li>ODataサービスとしての公開</li><li>アノテーションによるUI設定</li></ul><p>ABAP開発者はCDS Viewをマスターすることが必須です。</p>", "55min"),
        ("ODataサービス公開", "<h2>API公開の手順</h2><p>CDS ViewをODataサービスとして公開する手順を学びます。</p><ol><li>CDS Viewの作成</li><li>Service Bindingの登録</li><li>サービス公開とテスト</li></ol>", "50min"),
        ("Fiori連携の基礎", "<h2>Fioriとバックエンド連携</h2><p>FioriアプリケーションとABAPバックエンドの連携方式を理解します。</p><div class='callout-box'><div class='ic'>💡</div><div><div class='title'>ポイント</div><p class='text'>Fiori Elementsを使えば、CDS Viewから自動的にUIが生成されます。</p></div></div>", "60min"),
        ("Unitテスト実践", "<h2>ABAP Unitの書き方</h2><p>品質を上げる最初の一歩はテストから。</p><ul><li>テストクラスの作成方法</li><li>テストメソッドの実装</li><li>アサーションの種類と使い分け</li></ul>", "45min"),
        ("パフォーマンス最適化", "<h2>ABAP高速化テクニック</h2><p>プログラムのパフォーマンスを改善する実践的なテクニック。</p><ul><li>SELECT * からの脱却</li><li>FOR ALL ENTRIES の注意点</li><li>内部テーブル操作の最適化</li></ul>", "50min"),
        ("RAPモデルの基礎", "<h2>RAP入門</h2><p>Restful ABAP Programming — S/4HANAの新しいプログラミングモデルを理解しましょう。</p><p>CDS→Behavior→Service の流れが基本です。</p>", "55min"),
    ]),
    971: ("FI/CO 経理実務マスターコース", [
        ("経理フローの理解", "<h2>経理業務の全体像</h2><p>経理業務は単なる伝票入力ではありません。日次処理から月次決算、年次決算まで幅広い業務があります。</p><ul><li>日常取引の記帳</li><li>月次決算処理</li><li>年次決算と財務諸表作成</li></ul>", "30min"),
        ("会計伝票の基本操作", "<h2>FB50/F-02の使い方</h2><p>SAPでの仕訳入力をマスターしましょう。</p><h3>基本操作</h3><ol><li>トランザクションコードの実行</li><li>ヘッダー情報の入力</li><li>明細行の入力（借方・貸方）</li><li>シミュレーションと保存</li></ol>", "45min"),
        ("月次決算処理", "<h2>月次決算を効率化</h2><p>月次決算で行うべき処理を体系的に学びます。</p><ul><li>未払い/前払いの計上</li><li>減価償却費の計算</li><li>消費税申告</li><li>勘定残高の照合</li></ul>", "60min"),
        ("消費税と税務処理", "<h2>税務申告の実務</h2><p>消費税コードの設計と税務申告データの作成方法。</p><div class='callout-box warn'><div class='ic'>⚠</div><div><div class='title'>注意</div><p class='text'>税区分を間違えると申告で大きな問題になります。設計時に入念なテストを！</p></div></div>", "45min"),
        ("原価計算の基礎", "<h2>COモジュール入門</h2><p>原価センタ管理と内部指図の基礎。</p><ul><li>原価センタの設定</li><li>内部指図の作成と決済</li><li>原価配賦の仕組み</li></ul>", "40min"),
        ("財務諸表と決算分析", "<h2>決算書の作成と分析</h2><p>貸借対照表、損益計算書の作成方法と分析手法を学びます。</p>", "50min"),
        ("連結会計の基礎", "<h2>グループ会社の連結</h2><p>複数の会社コードを持つ企業の連結会計処理の基本。</p>", "55min"),
        ("固定資産管理", "<h2>FI-AAの基礎</h2><p>固定資産の取得から減価償却、除却までの一連の流れ。</p>", "40min"),
    ]),
    972: ("S/4HANA 移行プロジェクト実践", [
        ("移行プロジェクト基礎", "<h2>S/4HANA移行の全体像</h2><p>S/4HANAへの移行方法は主に2つ。</p><ul><li><strong>Brownfield</strong> — システム変換（既存システムをそのまま移行）</li><li><strong>Greenfield</strong> — 新規導入（一新して構築）</li></ul><p>どちらを選ぶかはプロジェクトの状況次第です。</p>", "30min"),
        ("システムランドスケープ設計", "<h2>環境構成の設計</h2><p>Sandbox/Dev/QAS/PRDの各環境の役割と構成。</p><ul><li>開発・テスト・本番の分離</li><li>トランスポート管理</li><li>クライアント戦略</li></ul>", "45min"),
        ("簡素化リスト確認", "<h2>S/4HANAの変更点</h2><p>S/4HANAで廃止・変更される機能を事前に確認する作業。</p><div class='callout-box'><div class='ic'>💡</div><div><div class='title'>重要</div><p class='text'>簡素化リストはプロジェクト初期に必ず確認し、影響範囲を特定しましょう。</p></div></div>", "60min"),
        ("データ移行計画", "<h2>データ移行の進め方</h2><p>データ移行はプロジェクトの山場の一つ。</p><ol><li>データクレンジング</li><li>移行マッピングの作成</li><li>テスト移行の実施</li><li>本番移行と検証</li></ol>", "50min"),
        ("カスタマイズ移行", "<h2>既存カスタマイズの移行</h2><p>SPRO設定やABAPプログラムの移行手順。</p><ul><li>設定の棚卸し</li><li>S/4対応の確認</li><li>リトマスチェック</li></ul>", "55min"),
        ("カットオーバー計画", "<h2>本番切替の実務</h2><p>カットオーバーはプロジェクトの集大成。</p><p>切替手順・バックアップ計画・リカバリー手順を事前に準備しましょう。</p>", "60min"),
        ("並行稼働と安定化", "<h2>Go-Live後の運用</h2><p>本番稼働直後の安定化期間の運用計画。</p>", "40min"),
    ]),
    973: ("SAP コンサルタント入門講座", [
        ("SAPコンサルの役割", "<h2>コンサルタントとは</h2><p>SAPコンサルタントには大きく分けて以下の役割があります。</p><ul><li><strong>業務コンサルタント</strong> — 業務プロセス設計</li><li><strong>テクニカルコンサルタント</strong> — 技術設計・開発</li><li><strong>プロジェクトマネージャー</strong> — 全体統括</li></ul>", "25min"),
        ("SAPモジュール概観", "<h2>モジュール全体像</h2><p>SAPの主要モジュールを理解しましょう。</p><ul><li>FI/CO（財務会計/管理会計）</li><li>MM/SD（購買/販売）</li><li>PP（生産計画）</li><li>ABAP/Basis（開発/基盤）</li></ul>", "35min"),
        ("要件定義の実践", "<h2>顧客ヒアリングの技術</h2><p>効果的なヒアリングのコツ。</p><ul><li>業務プロセスの可視化</li><li>課題の本質を見極める</li><li>要件定義書の品質を高める</li></ul>", "50min"),
        ("Fit/Gap分析実践", "<h2>標準と要件の差異分析</h2><p>Fit/Gap分析はコンサルタントの腕の見せ所。</p><div class='callout-box'><div class='ic'>💡</div><div><div class='title'>ポイント</div><p class='text'>Gapがあるからといってすぐアドオン開発に入るのではなく、プロセス変更も検討しましょう。</p></div></div>", "55min"),
        ("テスト計画と実施", "<h2>テストのプロフェッショナル</h2><p>テスト工程の計画と実施方法。</p><ul><li>テストシナリオの設計</li><li>テストデータの準備</li><li>不具合管理と品質評価</li></ul>", "45min"),
        ("ユーザートレーニング", "<h2>エンドユーザ教育</h2><p>トレーニング計画の立案から実施までのノウハウ。</p><ul><li>トレーニング資料の作成</li><li>実施方法（集合/オンライン）</li><li>習熟度の評価</li></ul>", "40min"),
        ("運用支援と保守", "<h2>Go-Live後のフェーズ</h2><p>システム安定稼働のための運用支援業務。</p>", "35min"),
    ]),
}

times_pool = ["25min","30min","35min","40min","45min","50min","55min","60min"]

for pid, (title, steps_data) in paths.items():
    print(f"\n--- {title} (PID={pid}) ---")
    step_num = 0
    for item in steps_data:
        s_title = item[0]
        s_content = item[1]
        s_time = item[2] if len(item) > 2 else "30min"
        step_num += 1

        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as tmpf:
            tmpf.write(s_content)
            tmpf.flush()
        r = subprocess.run(WP + ['post', 'create',
            '--post_type=path_step', f'--post_title={s_title}',
            f'--post_content=<file://{tmpf.name}>',
            '--post_status=publish', '--porcelain'],
            capture_output=True, text=True, timeout=30, cwd=CWD)
        lines = r.stdout.strip().split('\n')
        spid = ''
        for l in reversed(lines):
            l = l.strip()
            if l.isdigit():
                spid = l
                break
        if not spid:
            print(f'  ❌ Failed: {s_title[:20]}')
            continue

        subprocess.run(WP + ['post', 'meta', 'set', spid, 'step_path_id', str(pid)], capture_output=True, timeout=30, cwd=CWD)
        subprocess.run(WP + ['post', 'meta', 'set', spid, 'step_order', str(step_num)], capture_output=True, timeout=30, cwd=CWD)
        subprocess.run(WP + ['post', 'meta', 'set', spid, 'step_time', s_time], capture_output=True, timeout=30, cwd=CWD)
        print(f'  ✅ Step {step_num}: {s_title[:25]:25s} | {s_time} | ID={spid}')
        os.unlink(tmpf.name)
        time.sleep(0.3)
    print(f'  📊 Total: {step_num} steps')

print("\n✅ All steps created!")
