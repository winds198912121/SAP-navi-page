#!/usr/bin/env python3
"""Seed 20 test articles per module (180 total) + courses + knowledge per module"""
import subprocess, time, random, json

WP = ['/usr/local/bin/wp', '--allow-root']
BASE_URL = 'http://localhost:8080'

# ── 9 modules with 20 articles each ──
DATA = {
    'fi': {
        'name': 'FI · 財務会計',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'topics': ['basic', 'master', 'transaction', 'process'],
        'authors': ['パンダ先生', 'タナカ', 'サトウ', '佐藤由美'],
        'articles': [
            ('【完全保存版】仕訳のしくみ — 借方・貸方を一発で覚える', '簿記の本を読んでも頭に入らない…そんなあなたへ。覚えるべきは「左右がイコール」というたった一つのルールだけ。', 1, 'basic'),
            ('勘定科目（G/L Account）ってつまり何？コードと名前のしくみ', 'マスタの中で一番触られる勘定科目。階層、グループ、表示形式 — 新人がつまずくところを整理。', 1, 'master'),
            ('会計伝票の文書タイプ（SA/KR/DR…）使い分けマスターガイド', '実は奥が深い文書タイプ。デフォルトのままで本当に大丈夫？案件で必ず議論になるポイントを解説。', 2, 'transaction'),
            ('消費税コード（Tax Code）の設計 — 軽減税率もインボイスも', '日本特有の論点が多い税務領域。区分記載、適格請求書、課税売上割合 — まとめて理解する。', 2, 'transaction'),
            ('月次決算を3日短縮した話 — Soft Close 運用のリアル', '理屈はわかるけど現場でどうするのか。某メーカーの事例ベースで、決算早期化の具体策を。', 3, 'process'),
            ('銀行勘定の自動消込（EBS）導入ガイド', 'Electronic Bank Statement を有効化するときの設定パラメータ全部見せます。よくあるエラーも。', 2, 'transaction'),
            ('新規G/L勘定科目の設計 — 現場で使えるルール7選', '現場でよくある「とりあえず作っておいた」が招く悲劇。30分で設計ルールをマスターしよう。', 1, 'master'),
            ('F-02 vs FB50 vs FB01L — 仕訳入力T-Codeの使い分け', 'どれを使うべき？3つのT-Codeの違いと、現場での実践的な使い分けを現役コンサルが解説。', 2, 'transaction'),
            ('決算整理仕訳の自動化 — F.13 と F.5B を極める', '手作業でやっている决算整理、この機会に完全自動化しよう。実装例と注意点を紹介。', 3, 'process'),
            ('AP/AR エイジングレポートの読み方・活かし方', '債権債務のエイジング管理は経理の要。SAP標準レポートでどこまでできるのか解説。', 2, 'process'),
            ('会計年度バリアントの設計 — 変則決算に対応する', '12月決算じゃない会社も多い。4-4-5カレンダーや13期の設定方法を詳しく解説。', 3, 'master'),
            ('FBL1N / FBL5N でできる仕入先・得意先分析', '「どの得意先が未回収多い？」「あの仕入先の支払い状況は？」を一発で把握する方法。', 1, 'transaction'),
            ('利益センタ会計（EC-PCA）入門', '利益センタって何のため？管理会計の基本としてのPCA、導入から活用までをわかりやすく。', 2, 'basic'),
            ('財務会計と管理会計の連携 — なぜ2つある？', 'FIとCOの関係を正しく理解しないと設計で痛い目を見る。初心者にこそ読んでほしい基礎知識。', 1, 'basic'),
            ('為替レートの管理と外貨評価の実務', '外貨建取引があるなら必ず押さえるべきレート管理とFI/FS10Nでの評価手順。', 2, 'transaction'),
            ('連接会計（Intercompany）のSAP実装パターン', 'グループ会社間の取引をどう処理する？共通通貨、消込、連結 — 実務の全体像を解説。', 3, 'process'),
            ('買掛金の支払い提案（F110）完全ガイド', 'F110が遅い・止まる・よくわからない…よくある困りごとを全部解決。パラメータ設定大全。', 2, 'transaction'),
            ('固定資産管理（FI-AA）の基礎と減価償却計算', 'Asset AccountingはFIの中でも特殊な領域。取得・償却・除却までを図解で理解。', 2, 'master'),
            ('SAP S/4HANA Finance の変更点まとめ', 'ECCからS/4に移行するとFIまわりは何が変わる？アクティブ・パッシブの判断基準も。', 3, 'basic'),
            ('パンダ先生に聞く！経理あるあるQ&A 10選', '「伝票番号が飛んだ」「なぜか残高が合わない」— 現場から寄せられた質問に一問一答。', 1, 'basic'),
        ],
    },
    'co': {
        'name': 'CO · 管理会計',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'articles': [
            ('原価センタ会計（CCA）の基礎 — 経費を管理する', '「どの部署にいくらかかった？」を明確にする原価センタ。配賦キックの設定まで図解。', 1, 'basic'),
            ('内部指図（Internal Order）の使いどころ', 'プロジェクト単位の原価管理に最適な内部指図。予算管理と決済の流れを解説。', 2, 'transaction'),
            ('製品原価計算（CO-PC） — 見積原価と実績原価', '製品1個あたりの原価はどう計算する？見積と実績の差異分析まで一気通貫で理解。', 2, 'basic'),
            ('利益勘定分析（CO-PA）で儲かる製品を知る', 'どの製品が本当に儲かっている？CO-PAのセグメント分析でマーケットベースの収益管理を。', 2, 'process'),
            ('PCA 利益センタ管理の実践設計', '利益センタを組織構造にどうマッピングする？配賦サイクルの設計と実運用のコツ。', 3, 'master'),
            ('原価配賦と配賦サイクル設計入門', '配賦ってそもそも何？一次配賦・二次配賦の違いと、実際のサイクル設定手順。', 1, 'transaction'),
            ('実績原価 vs 計画原価 — 差異分析の基礎', '「予算オーバー」を早期に発見するための実績vs計画分析。COのレポート活用法。', 2, 'process'),
            ('Activity Type と 配賦基準の設計', '活動基準配賦のキモはActivity Type。機械時間・人時間など現場に合った基準の選び方。', 2, 'master'),
            ('CO の月次決算 — やるべきことリスト10', 'FI決算と並行してCOも決算処理が必要。マテリアル・配賦・差異計算の正しい順番。', 3, 'process'),
            ('統計キー（Statistical Key Figure）の活用', '面積・人数・稼働時間 — 間接費を公平に配賦するための統計キー設計。', 2, 'master'),
            ('生産原価のバリアント計算とローリング見積', 'SAPの原価見積はどう動く？標準原価計算とローリング見積もりの違いを理解する。', 3, 'transaction'),
            ('管理会計レポート — 現場で使える10のT-Code', 'COで毎日使うレポートT-Codeを厳選。S_ALR_87013611 など現場で必須のコード集。', 1, 'transaction'),
            ('原価管理の組織構造設計', '会社コード・原価管理領域・事業領域の関係を整理。組織設計のベストプラクティス。', 2, 'master'),
            ('CO と MM/SD の連携ポイント', '購買で原価センタはどう決まる？販売で収益はどの勘定に？モジュール連携の要所。', 2, 'basic'),
            ('間接費配賦の自動化実践レシピ', '月次の手作業配賦をなくす。サイクル設定から自動実行ジョブの組み方まで。', 3, 'process'),
            ('製造原価 vs 売上原価の考え方', '「製造原価って結局何？」財務会計と管理会計での原価の見え方の違いをスッキリ解説。', 1, 'basic'),
            ('利益計画の策定と実績管理サイクル', '予算編成から実績管理まで、年間サイクルをどう回すか。COによる管理サイクル入門。', 3, 'process'),
            ('製品原価のバッチ投入と原価ローリング', 'CO-PCでのバッチ原価計算の流れ。MRPとの連携と月末処理の正しい実行順。', 2, 'transaction'),
            ('CO コンポーネント全体像 — 初心者のためのマップ', 'CCA / IO / PC / PA / PCA の関係が一目でわかる全体図。最初に読むべき一枚。', 1, 'basic'),
            ('原価計算と在庫評価の関係を理解する', '原価計算の結果が在庫評価額にどう影響する？FI-CO-MMの三者の関係を整理。', 3, 'process'),
        ],
    },
    'mm': {
        'name': 'MM · 購買・在庫',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'articles': [
            ('購買依頼 → 注文 → 入庫 → 請求 — MM基本フロー完全図解', '伝票がどう変わっていくのか図でつかむ。新人配属時に「これ知ってる前提」とされがちなあの流れ。', 1, 'basic'),
            ('資材マスタの基本 — これだけは押さえよう', '資材マスタの基本セグメント、ビュー、カスタマイズ。購買・在庫・会計の連携点。', 1, 'master'),
            ('移動タイプ早見表 — 現場でよく使う30選', '101・201・261・311…意味わからん移動タイプを現場視点で整理。業務パターンから引ける逆引き表。', 1, 'transaction'),
            ('購買情報レコード（Info Record）活用術', 'Info Record で購買条件を管理する。価格・リードタイムの標準化で購買業務を効率化。', 2, 'master'),
            ('在庫評価と移動平均法・標準原価法の比較', '移動平均と標準原価、どっちを選ぶ？在庫評価方法の選び方とS/4HANAでの変化。', 2, 'basic'),
            ('分割評価（Split Valuation）の設計と運用', '同じ資材でも評価が異なるケース。国産/輸入品や自主製造/外部調達の評価分けを解説。', 3, 'master'),
            ('外部調達プロセス — 標準注文から枠契約まで', '一括発注と枠契約の使い分け。契約・発注・納入の流れを購買業務フローで理解。', 2, 'transaction'),
            ('在庫棚卸の全手順 — サイクルカウンティングも', '年次棚卸からサイクルカウンティングへの移行。差異分析と在庫精度の上げ方。', 2, 'process'),
            ('MRP の基礎 — 資材所要量計画を理解する', 'MRPってどう動く？購買依頼の自動生成、リード時間、安全在庫。生産計画との連携。', 2, 'basic'),
            ('バッチ管理の導入と実践運用', '品質管理やトレーサビリティに必須のバッチ管理。バッチ決定とバッチ分類の設計。', 3, 'process'),
            ('購買グループの設計と権限管理', '購買グループ別の担当分け、承認ワークフロー、権限設定のベストプラクティス。', 2, 'master'),
            ('サービス購買（External Service Management）', '工事や保守などモノ以外の購買。入荷と請求の関係、サービスパッケージの作り方。', 3, 'transaction'),
            ('在庫転送（STO）のパターンと設定', '会社間・プラント間の在庫移動。STOを活用した在庫補給の全体設計。', 2, 'transaction'),
            ('購買依頼の承認ワークフロー設計', '「申請→承認→発注」の流れを自動化。閾値や階層承認の設定を実例で。', 2, 'process'),
            ('MM の月次処理 — やるべきことリスト', '月末にやること：在庫計上、消費計上、棚卸差異振替。MMの決算処理を完全網羅。', 3, 'process'),
            ('購買価格決定の仕組み — 条件タイプ完全理解', '条件タイプPB00/PBOM/PBXX…購買価格はどう決まる？価格決定の優先順位を解説。', 2, 'master'),
            ('MM 組織構造 — 購買組織・プラント・保管場所', '組織構造の設計が後々の運用を決める。現場に合わせた組織モデルの選び方。', 1, 'master'),
            ('帳票出力（Smart Forms / Adobe Forms）のカスタマイズ', '購買注文書や入庫伝票の帳票をSAPで作る。Smart FormsからAdobe Formsへの移行。', 3, 'transaction'),
            ('SAP Ariba と MM の連携', 'クラウド購買との連携ポイント。Ariba Networkを通じた購買業務の変革。', 3, 'basic'),
            ('パンダ先生のMM現場ハック — これは便利！10選', '現場で使える便利T-Codeや隠し機能。ME2M、ME29N、MRKO の知られざる活用術。', 1, 'transaction'),
        ],
    },
    'sd': {
        'name': 'SD · 販売管理',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'articles': [
            ('受注→出荷→請求 — SDの基本プロセス図解', '見積から代金回収までの一連の流れ。SDの全体像を掴む最初の一歩。', 1, 'basic'),
            ('得意先マスタの設計 — ここを間違えると後悔する', '販売エリア・勘定コード・支払条件。得意先マスタの設計は後々の運用を大きく左右する。', 1, 'master'),
            ('価格設定（Condition Technique）の仕組み', '値引き、割増、プロモーション — SAPの価格設定はどう動く？条件技術の完全理解。', 2, 'transaction'),
            ('出荷伝送と出荷確認の実務', '出荷の流れ、ピッキングから出庫確認まで。LEとの連携と出荷伝送の設定。', 2, 'transaction'),
            ('請求書の作成と会計連携', '請求書はどうやってFIに転送される？請求伝票と勘定コードの決定ロジック。', 2, 'transaction'),
            ('ビリングプラン（分割請求）の活用', '長期契約の分割請求。工期に応じた請求計画の作成と実際の運用ノウハウ。', 3, 'process'),
            ('出荷関連機能 — ピッキング・梱包・積込', 'LE-WMと連携した物流処理の全体像。出荷と在庫の同期をどう取るか。', 2, 'process'),
            ('返品処理のフローと勘定設定', '返品は受注より複雑。返品理由・返金・在庫戻し入れの流れを正しく理解する。', 2, 'process'),
            ('販売組織構造の設計', '販売組織・流通チャネル・部門の3階層。組織構造が価格決定と権限に与える影響。', 1, 'master'),
            ('大口顧客 vs 小口顧客 — ビジネスモデル別SD設計', 'BtoBとBtoCでSDの設計はどう違う？条件・出荷・請求の違いを実例で解説。', 2, 'basic'),
            ('出荷保留と補充オーダー — 在庫不足への対応', '在庫不足で出荷できない！出荷保留の解除と自動補充の発注連携。', 2, 'transaction'),
            ('販売契約（Contract）とジョブオーダーの違い', '長期契約を結んでいる得意先への対応。一括契約と個別受注の使い分け。', 3, 'master'),
            ('インターフェース（EDI/IDoc）の受注連携', '外部システムからSAPへ受注連携。IDocの送受信と障害対応の基礎知識。', 3, 'transaction'),
            ('SAP S/4HANA Order Management の新機能', 'S/4でのSDモジュールの変更点。新たな価格設定エンジンとFioriアプリ。', 3, 'basic'),
            ('返送品処理（RMA）のベストプラクティス', '返品された商品の検品・評価・再入庫の流れをスムーズにする現場の工夫。', 2, 'process'),
            ('販売レポート — これは見ておけ！15選', '売上分析、受注残、請求漏れチェック — 現場で使えるSD標準レポートを厳選。', 1, 'transaction'),
            ('価格設定のトラブルシューティング', '「なぜこの値段になった？」価格決定が思わぬ結果になった時の調査手順。', 3, 'transaction'),
            ('グローバル販売 — 輸出・三国間取引の設定', '輸出販売や三国間取引のSD設定。特殊な出荷と請求のパターンを詳説。', 3, 'process'),
            ('SAP S/4HANA での SD 変更点まとめ', 'ECCからS/4でSDは何が変わる？VBRK構造変更・価格エンジン刷新のインパクト。', 3, 'basic'),
            ('パンダ先生のSD用語集 — 基本から現場用語まで50語', '出荷伝票・納入日程行・条件レコード…SD特有の用語をわかりやすく解説。', 1, 'basic'),
        ],
    },
    'pp': {
        'name': 'PP · 生産計画',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'articles': [
            ('MRPの全体像 — 生産計画はこう動く', 'MRPって実際どういう仕組み？需要から製造指図までの流れをイラストで理解。', 1, 'basic'),
            ('BOM（部品表）の基礎と設計ポイント', 'BOMの種類と用途。製造BOM・設計BOM・包装BOMの違いと設計のベストプラクティス。', 1, 'master'),
            ('作業手順（Routing）設計の考え方', '作業工程・作業時間・機械設備。Routingは生産の設計図。現場視点での作り方。', 2, 'master'),
            ('製造指図（Production Order）のライフサイクル', 'リリース→印刷→実績入力→完了確認→決済。製造指図の一生を追いかける。', 2, 'transaction'),
            ('MRPシミュレーションとリアルタイム計画の違い', 'S/4HANAの新機能。従来のMRPシナリオと新時代の計画手法を比較。', 3, 'process'),
            ('能力計画（Capacity Planning）入門', '工場のキャパは足りてる？能力負荷の可視化とボトルネック解消の方法。', 2, 'process'),
            ('プロセス産業向け — PP-PIを使いこなす', '化学・食品・製薬などプロセス産業向けの機能。レシピ・製造バッチ管理。', 3, 'basic'),
            ('生産計画の3層構造 — S&OP → PP → MES', '中期経営計画から日々の生産指示まで。計画の階層とシステム連携の全体像。', 2, 'process'),
            ('BOM explosion と引当のメカニズム', 'BOMを展開すると何が起きる？在庫引当とMRP連携の内部ロジック。', 2, 'transaction'),
            ('生産バージョンの管理（Production Version）', '複数の製造方法がある時の管理方法。BOM/Lotサイズのバリエーション設定。', 2, 'master'),
            ('SAP S/4HANA Manufacturing の新機能', 'S/4PP/DSの新機能、製造実行統合、デジタルツイン連携まで解説。', 3, 'basic'),
            ('現場の生産実績入力 — 実務のコツ', '作業員が実際に入力する実績。バーコード・Fiori・バッチ入力の比較。', 1, 'transaction'),
            ('生産能力調整 — 残業から外注まで', 'キャパ不足の時の選択肢。シフト調整・外注加工・代替ラインの計画方法。', 2, 'process'),
            ('工場カレンダーの設計と運用', '稼働日/非稼働日の管理。シフトパターンと休日カレンダーの正しい設定。', 1, 'master'),
            ('かんばん（KANBAN）によるJIT生産', 'SAPのKANBANを活用したジャストインタイム生産。現品管理と補充フロー。', 3, 'process'),
            ('PP と MM の連携 — 生産と購買の橋渡し', 'MRP結果は購買依頼にどう変換される？製造指図と在庫の相互作用を理解。', 2, 'transaction'),
            ('製造指図の原価計算と差異分析', '作るといくらかかる？製造指図の見積原価・実績原価・差異の分析。', 2, 'transaction'),
            ('PP 組織構造 — プラントとMRPコントローラ', 'プラントの定義・MRPコントローラの設定。計画と実行の組織設計。', 1, 'master'),
            ('リピーティティブ生産（REM）の導入と運用', '量産型の生産管理。製造指図を使わないREMのメリットと設定方法。', 2, 'process'),
            ('パンダ先生に学ぶ生産管理用語50', 'MRP・BOM・Routing・Plan Order…生産管理の専門用語をまとめて理解。', 1, 'basic'),
        ],
    },
    'hr': {
        'name': 'HR · 人事管理',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'articles': [
            ('SAP HR の全体像 — モジュールマップ', 'PA・PD・TM・PY・ESS/MSS。HRのサブモジュールと機能範囲を一望する。', 1, 'basic'),
            ('人事マスタの基本 — インフォタイプ完全理解', 'インフォタイプ(IT0001〜IT9999)の基本構造。人事マスタはインフォタイプでできている。', 1, 'master'),
            ('給与計算（PY）の基礎とロジック', '給与計算はどう動く？スキーマ・ファンクション・給与計算シミュレーションの流れ。', 2, 'transaction'),
            ('採用管理から退職までの人事プロセス', '入社から退職までの人事イベントとシステム操作。SAP HRでやるべきこと。', 1, 'basic'),
            ('組織管理（OM／PD）の設計', '組織図をSAPで表現する。組織単位・職位・ポジションの階層設計。', 2, 'master'),
            ('人件費計画と予算管理', '給与・賞与の予算策定。計画バージョンと実績比較の方法。', 3, 'process'),
            ('勤怠管理 — 勤務パターンと時間評価', 'シフト勤務の管理。勤怠データの取り込みから給与計算への連携。', 2, 'transaction'),
            ('SAP SuccessFactors との統合', 'クラウドHRとの連携。Employee CentralとSAP HRのデータ同期を理解する。', 3, 'basic'),
            ('人材開発・育成計画（CD）の機能', '研修コースの管理・資格認定・キャリア開発計画。HRの人材育成機能。', 2, 'process'),
            ('評価面談と目標管理（MBO）のシステム化', '目標設定→中間評価→最終評価のプロセスをSAPで管理する方法。', 2, 'process'),
            ('年末調整のためのSAP設定', '日本固有の年末調整。扶養控除・保険料・住宅ローン控除のシステム対応。', 3, 'transaction'),
            ('採用選考管理（Recruitment）のプロセス', '求人票の公開から内定承諾まで。採用管理機能の全体像。', 2, 'process'),
            ('HR レポート — よく使う10選', '人事異動一覧、給与明細、年次有給残高…現場で毎日使うレポートを厳選。', 1, 'transaction'),
            ('昇給・昇格のシステム処理', '昇給のタイミングとインフォタイプ更新。給与計算への影響を考慮した処理手順。', 3, 'process'),
            ('人事と給与の年度更新', '4月の年度更新作業。等級変更・給与改定・社会保険料率変更の一括処理。', 3, 'process'),
            ('SAP HR の組織階層と権限設計', '人事業務は情報がデリケート。組織ベースの権限設定をどう設計するか。', 2, 'master'),
            ('法定帳票出力 — 雇用保険・社会保険・労災', '日本法対応の法定帳票。算定基礎・月額変更・賞与処理を理解。', 3, 'transaction'),
            ('採用データから給与計算までのデータ連携', '採用で登録したデータが給与計算までどう流れる？HRのデータフロー完全解説。', 1, 'basic'),
            ('グローバル人事 — 複数国の給与管理', '国際人事のポイント。各国法対応、通貨管理、レポーティング。', 3, 'process'),
            ('パンダ先生と学ぶHR超入門', '人事の仕事って何？HRのサブモジュールをパンダ先生がやさしく解説する最初の一歩。', 1, 'basic'),
        ],
    },
    'abap': {
        'name': 'ABAP · 開発言語',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'articles': [
            ('ABAP 超入門 — プログラミングって何？から始める', 'プログラミング未経験でも大丈夫。Hello Worldからデータベースアクセスまでを優しく解説。', 1, 'basic'),
            ('SELECT 文のパフォーマンス改善 — INDEX を使うべき5つの場面', '本番環境で動かないコードはコードじゃない。実例コード付きで明日から効くABAP最適化テクニック。', 2, 'transaction'),
            ('ABAP オブジェクト指向 完全入門', 'クラス・メソッド・継承・インターフェース — OOLの基礎をSAP ABAPの実例で学ぶ。', 2, 'basic'),
            ('ALV レポートの作成 — 現場で使える3パターン', 'REUSE_ALV_GRID_DISPLAY から SALV factory まで。現代的なALV実装を完全網羅。', 2, 'transaction'),
            ('BAPI / RFC / OData — APIの選び方と使い方', '外部連携に最適なAPI方式はどれ？BAPIの探索からODataサービス公開まで。', 2, 'basic'),
            ('CDS View 入門 — モダンABAPの第一歩', 'S/4HANA時代のABAP開発はCDS Viewから始まる。基本構文からアノテーションまで。', 3, 'transaction'),
            ('ABAP Unit テストの書き方', '品質を上げる最初の一歩はテスト。ABAP Unitの基本からモックの活用まで。', 2, 'process'),
            ('SAP Fiori / UI5 開発とABAP連携', 'Fioriアプリ開発の基礎。ODataサービスとUI5の連携、ゲートウェイ設定。', 3, 'process'),
            ('ABAP の内部テーブル操作 — Data Reference も', '内部テーブルの操作はABAPの肝。SORT・LOOP・COLLECTの最適な使い方を実例で。', 2, 'transaction'),
            ('ABAP Enhancement の完全理解', 'Exits・BTI・BAdI・Implicit Enhancement — 拡張手法の選び方と実装例。', 2, 'master'),
            ('ABAP 新文法 — 知っておくべき10の機能', 'CORRESPONDING #( )、VALUE #( )、FOR ループ…新文法を使いこなしてコードを短く。', 1, 'basic'),
            ('ABAP パフォーマンスチューニング完全ガイド', '遅いプログラムを高速化する。SQLトレース・ABAPトレース・実行計画の読み方。', 3, 'transaction'),
            ('BDC / LSMW によるデータ移行入門', 'SAPへのデータ取込はBDCとLSMWで。バッチインプットの基礎からトラブル対応まで。', 2, 'transaction'),
            ('ABAP 例外処理のベストプラクティス', 'TRY-CATCH-CLEANUP。エラー処理をちゃんと書かないと本番で泣く。', 2, 'master'),
            ('ABAP コーディング規約 — 現場で使える標準化ガイド', '命名規則・構造化・コメントの書き方。チーム開発で絶対に決めておくべきルール。', 1, 'master'),
            ('RAP (Restful ABAP Programming) 完全入門', 'S/4HANAの新しいプログラミングモデル。CDS → Behavior → Service を一気に理解。', 3, 'process'),
            ('AUnit とコードカバレッジ — 品質向上の習慣', 'テストのないコードはリファクタリングできない。カバレッジ計測とCI/CDパイプライン。', 3, 'process'),
            ('SAP ゲートウェイ（IWF）サービスのデプロイ', 'ODataサービスの登録からIWFランタイムへのデプロイ。Service Builderの使い方。', 2, 'transaction'),
            ('OpenSQL と Native SQL — いつどっち？', 'SELECT * FROM dbtab と EXEC SQL の使い分け。パフォーマンスとメンテナンス性のバランス。', 2, 'transaction'),
            ('パンダ先生に聞く！ABAP現場のQ&A', '「システムダンプが頻発」「ロック競合が多発」— 現場から届いた質問にパンダ先生が回答。', 1, 'basic'),
        ],
    },
    'basis': {
        'name': 'Basis · 基盤管理',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'articles': [
            ('SAP Basis って何？— 役割と仕事範囲', 'サーバ管理者とSAP管理者は何が違う？BASISの仕事範囲とAPO・PFCG・STSなど主要タスク。', 1, 'basic'),
            ('SAP システムの起動と停止 — 正しい手順', 'STOP/STARTの正しい順番。ABAP・Java・Web Dispatcherの起動シーケンスを完全理解。', 1, 'transaction'),
            ('PFCG による権限設計完全ガイド', 'ロール・プロファイル・権限オブジェクトの階層。SU01とPFCGを駆使した権限管理の極意。', 2, 'master'),
            ('ユーザ管理（SU01）の効率化テクニック', '大量ユーザー作成、一括ロック、パスワードリセット。SU01を使いこなして時短する。', 2, 'transaction'),
            ('SAP トランスポート管理（TMS）完全理解', '開発→テスト→本番への変更伝送。TMSの設定とトランスポートリクエストの管理方法。', 2, 'process'),
            ('SAP システムのバックアップ戦略', '何をいつバックアップする？オフラインバックアップとオンラインバックアップの違い。', 2, 'process'),
            ('SPAM/SAINT アップデートの正しいやり方', 'Support Package Manager を使ったシステムアップデート。アップグレード手順と注意点。', 3, 'transaction'),
            ('SAP パフォーマンスモニタリング入門', 'ST22・ST05・STAD — パフォーマンス分析の基本。どこを見ればいい？', 2, 'transaction'),
            ('SAP システムのサイジング', '導入前にやるべきサイジング。CPU・メモリ・ディスクの見積もり計算。', 3, 'master'),
            ('SAP クライアントコピーの正しい手順', 'SCC4 → SCC1 → SCC9。クライアントコピーの流れとエラー対応。', 2, 'transaction'),
            ('SAP バッチジョブ管理（SM36/SM37）', 'バッチジョブのスケジューリングと監視。ジョブチェーンとジョブ分類。', 1, 'transaction'),
            ('SAP ロック管理 — データベースロックとSAPロック', 'SM12でロックエントリを確認。デッドロックの検出と解消の実践手順。', 2, 'transaction'),
            ('プリンタ設定とスプール管理（SPAD）', 'SAPからの印刷出力。スプールサーバ・出力デバイス・フォーマット設定。', 1, 'transaction'),
            ('SAP システムランドスケープ設計', 'Sandbox → Dev → QAS → PRD。環境構成のベストプラクティス。', 2, 'master'),
            ('SAP メモリ管理 — ABAPメモリと共有メモリ', 'Extended Memory / Heap Memory / Shared Memory。メモリ不足によるダンプを防ぐ。', 3, 'master'),
            ('SAProuter の設定と運用', 'ネットワークセキュリティ。SAProuterを経由したリモートサポート接続の設定。', 3, 'process'),
            ('SAP 診断 — CCMS 監視セット入門', 'システム監視の自動化。CCMSで死活監視・パフォーマンス監視・しきい値設定。', 2, 'process'),
            ('SAP S/4HANA Basis の変更点', 'S/4HANAでのBasis業務の変化。Sumiツール・HANA DB管理・Fiori基盤。', 3, 'basic'),
            ('SAP 早期ウォッチアラート（EarlyWatch Alert）', 'SAPの健康診断。EWAの読み方と定期的なシステムチェックの習慣。', 2, 'process'),
            ('Basis 初心者ロードマップ', 'これからBasisを始める人が最初にやるべきこと。覚えておくべきT-Codeと学習の順序。', 1, 'basic'),
        ],
    },
    's4': {
        'name': 'S/4 · S/4HANA',
        'levels': ['beginner', 'intermediate', 'advanced'],
        'articles': [
            ('S/4HANA って何が違う？— ECCユーザーのための超入門', 'ECCとS/4で何が変わった？HANA DB・Fiori・コード削減・シンプリフィケーションを一言で。', 1, 'basic'),
            ('S/4HANA 移行プロジェクト — 成功の7ステップ', 'Brownfield vs Greenfield の判断基準。移行計画・データ移行・テストのベストプラクティス。', 2, 'process'),
            ('S/4HANA Fiori — もうSAP GUIはいらない？', 'Fiori Launchpadの設定とFioriアプリの導入。GUIトランザクションとの共存戦略。', 2, 'basic'),
            ('S/4 Material Ledger の変更点', 'MLの計算方式が変わった！Actual Costing / 並行評価のS/4での扱い方。', 3, 'transaction'),
            ('S/4HANA Universal Journal（ACDOCA）完全解説', 'A表と統合された新しいテーブル構造。ACDOCAが変えるFI/CO統合の世界。', 2, 'master'),
            ('S/4HANA 簡素化リストを読み解く', '廃止される機能とその代替案。稼働前に知っておくべきSimplification List的重要ポイント。', 3, 'process'),
            ('S/4HANA のデータ移行 — Migration Cockpit 活用術', 'LTMC・マイグレーションオブジェクト・テンプレート。移行ツールを使いこなす。', 2, 'transaction'),
            ('S/4HANA Business Partner コンセプト', '得意先・仕入先がBPに統合！CVI（Customer Vendor Integration）の設計と実装。', 2, 'master'),
            ('S/4HANA Cloud の選択肢', 'パブリッククラウド vs プライベートクラウド vs オンプレ。S/4HANA Cloudのエディション比較。', 2, 'basic'),
            ('S/4HANA ABAP Platform の新機能', 'ABAP開発者から見たS/4HANA。CDS View / RAP / ADT の開発ツール変革を解説。', 3, 'transaction'),
            ('S/4HANA 移行のビジネスケース作成', '移行のROIをどう計算する？インフラ削減・運用効率化・新機能導入の投資対効果。', 2, 'process'),
            ('SAP Activate Methodology による導入', 'Activateのフェーズ構成。Discover → Prepare → Explore → Realize → Deploy → Run。', 1, 'process'),
            ('Embedded Analytics — S/4HANA の分析機能', 'S/4HANAのビルトイン分析。CDS ViewベースのレポートとFiori分析アプリ。', 2, 'transaction'),
            ('S/4HANA のシステム移行ツール（SUM）', 'DMO（Database Migration Option）を使った移行手順。ダウンタイム最小化の方法。', 3, 'transaction'),
            ('S/4HANA Finance の主要な変更点', 'FI/CO領域のS/4変更点を完全網羅。新残高表示・Documents変更・レポート。', 2, 'basic'),
            ('S/4HANA のカスタマイジング移行', 'SPROの移行戦略。S/4で削除・変更されたCustomizingの確認。', 3, 'master'),
            ('S/4HANA テスト戦略 — 何をどこまでテストするか', '移行プロジェクトのテスト範囲。SIT・UAT・回帰テストの効率的な進め方。', 2, 'process'),
            ('S/4HANA 移行後の性能チューニング', '移行後に遅くなった！新環境でのパフォーマンス問題の診断と対策。', 3, 'transaction'),
            ('SAP Business Technology Platform（BTP）との連携', 'S/4HANAとBTPの連携シナリオ。Extension Suite・Analytics・AIの活用。', 3, 'process'),
            ('S/4HANA 導入プロジェクトの教訓100', '実際の導入プロジェクトで学んだ失敗と成功の教訓。プロジェクトマネジメント視点。', 3, 'process'),
        ],
    },
}

# ── helpers ──

def run(cmd, **kw):
    subprocess.run(cmd, capture_output=True, text=True, timeout=30,
        cwd='/Users/howard/Desktop/pm/sap-panda/wordpress', **kw)

def create_post(post_type, title, status='publish'):
    r = subprocess.run(WP + ['post', 'create', f'--post_type={post_type}',
        f'--post_title={title}', f'--post_status={status}', '--porcelain'],
        capture_output=True, text=True, timeout=30, cwd='/Users/howard/Desktop/pm/sap-panda/wordpress')
    # Extract last numeric-only line from stdout (skip deprecation warnings)
    lines = r.stdout.strip().split('\n')
    for l in reversed(lines):
        l = l.strip()
        if l.isdigit():
            return l
    return ''

# ── Seed Posts ──

print('=== Seeding articles, courses, knowledge per module ===')
total = 0
for slug, mod in DATA.items():
    print(f'\n--- {mod["name"]} ---')

    # 20 articles
    for i, (title, excerpt, diff_lvl, topic) in enumerate(mod['articles']):
        content = f'<p>{excerpt}</p><p>SAP {slug.upper()} モジュールの学習コンテンツです。パンダ先生と一緒に理解を深めましょう！🎋</p><p>この記事では、現場で実際に役立つ知識をわかりやすく解説します。</p>'
        pid = create_post('post', title)
        if pid and pid.isdigit():
            run(WP + ['post', 'update', pid, '--post_content=' + content])
            run(WP + ['post', 'term', 'set', pid, 'sap_module', slug])
            diff_map = {1: 'beginner', 2: 'intermediate', 3: 'advanced'}
            run(WP + ['post', 'term', 'set', pid, 'difficulty', diff_map[diff_lvl]])
            run(WP + ['post', 'meta', 'set', pid, 'article_reading_time', str(random.randint(4, 15))])
            run(WP + ['post', 'meta', 'set', pid, 'article_cover_type', random.choice(['class', 'blackboard', 'learning'])])
            total += 1
    print(f'  20 articles ✓')

    # 5 courses
    for i in range(5):
        title = f'{mod["name"]} 基礎コース Level {i+1}'
        pid = create_post('course', title)
        if pid and pid.isdigit():
            run(WP + ['post', 'meta', 'set', pid, 'course_price', str(random.choice([0, 980, 1980, 4980, 9800, 19800]))])
            run(WP + ['post', 'meta', 'set', pid, 'course_duration', random.choice(['3週間·12本', '6週間·18本', '8週間·24本', '12週間·36本'])])
            run(WP + ['post', 'meta', 'set', pid, 'course_instructor', 'パンダ先生'])
            run(WP + ['post', 'term', 'set', pid, 'sap_module', slug])
    print(f'  5 courses ✓')

    # 5 knowledge
    for i in range(5):
        title = f'{mod["name"]} ナレッジ#{i+1}'
        pid = create_post('knowledge', title)
        if pid and pid.isdigit():
            ktype = random.choice(['concept', 'tcode', 'best_practice', 'glossary'])
            run(WP + ['post', 'meta', 'set', pid, 'knowledge_type', ktype])
            run(WP + ['post', 'term', 'set', pid, 'sap_module', slug])
    print(f'  5 knowledge ✓')

    # 2 quizzes
    for i in range(2):
        title = f'{slug.upper()} Quiz #{i+1}'
        pid = create_post('daily_quiz', title)
        if pid and pid.isdigit():
            opts = [
                {'text': f'{slug.upper()}の選択肢A', 'correct': True},
                {'text': f'{slug.upper()}の選択肢B', 'correct': False},
                {'text': f'{slug.upper()}の選択肢C', 'correct': False},
                {'text': f'{slug.upper()}の選択肢D', 'correct': False},
            ]
            run(WP + ['post', 'meta', 'set', pid, 'quiz_options', json.dumps(opts)])
            run(WP + ['post', 'meta', 'set', pid, 'quiz_explanation', f'{slug.upper()}に関する問題です。Aが正解！🎋'])
            run(WP + ['post', 'meta', 'set', pid, 'quiz_difficulty', random.choice(['beginner','intermediate','advanced'])])
            run(WP + ['post', 'meta', 'set', pid, 'quiz_module', slug])
            run(WP + ['post', 'term', 'set', pid, 'sap_module', slug])
    print(f'  2 quizzes ✓')

print(f'\n=== Total seeded: {total} articles, 45 courses, 45 knowledge, 18 quizzes ===')
