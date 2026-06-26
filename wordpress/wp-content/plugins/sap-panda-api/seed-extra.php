<?php
/**
 * SAP Panda 追加テストデータ生成
 *
 * 教師、会員プラン、デモユーザー、学習パス、反応データ
 *
 * 使用方法： wp eval-file seed-extra.php
 */

// teachers
$teachers = [
  [
    'name' => 'パンダ先生',
    'bio' => 'SAP歴20年のベテランコンサルタント。FI/CO、S/4HANA を中心に数多くの導入プロジェクトを手がける。難しい概念をやさしく解説するのが得意。著書に「SAP入門の入門」「S/4HANA実践ガイド」など。',
    'specialty' => 'FI/CO, S/4HANA, ABAP',
    'avatar' => 'panda.svg',
    'experience' => 20,
  ],
  [
    'name' => 'たろうくん',
    'bio' => '24歳・SAP学習中の若手コンサルタント。新卒でSAPベンダーに入社し、日々修行中。初心者の視点で「わからない」を代弁する記事が好評。SAP資格: SAP Certified Application Associate - SAP S/4HANA FI',
    'specialty' => 'FI, MM 学習中',
    'avatar' => 'panda.svg',
    'experience' => 2,
  ],
  [
    'name' => 'タナカ',
    'bio' => 'バックエンド開発が専門のABAPエンジニア。ABAP Objects、CDS View、RAP などモダンな開発技術に精通。パフォーマンス改善のスペシャリストとして、多くのプロジェクトで活躍。',
    'specialty' => 'ABAP, CDS, RAP, Fiori',
    'avatar' => 'panda.svg',
    'experience' => 12,
  ],
  [
    'name' => 'サトウ',
    'bio' => 'S/4HANA 移行プロジェクトを多数手がけるプロジェクトマネージャー。Brownfield/Greenfield 両方の移行方式を経験。PMO支援から全体統括まで幅広く対応。PMP, SAP Activate Methodology 認定。',
    'specialty' => 'S/4HANA移行, PM, Basis',
    'avatar' => 'panda.svg',
    'experience' => 15,
  ],
  [
    'name' => 'ウエノ',
    'bio' => 'MM/SD/LE のロジスティクス系SAPコンサルタント。小売・製造業のプロジェクト経験豊富。在庫管理、購買プロセス、物流の最適化が得意。SAP Certified Application Professional - SCM',
    'specialty' => 'MM, SD, LE, WM',
    'avatar' => 'panda.svg',
    'experience' => 10,
  ],
  [
    'name' => 'ナカムラ',
    'bio' => 'SAP Basis/Cloud のインフラエンジニア。SAP on AWS/Azure/GCP への移行経験多数。HANA DB の管理、パフォーマンスチューニングも担当。ドイツ語が堪能でSAP本社との折衝も可能。',
    'specialty' => 'Basis, Cloud, HANA, Security',
    'avatar' => 'panda.svg',
    'experience' => 14,
  ],
  [
    'name' => 'ハヤシ',
    'bio' => 'CO/PS の管理会計スペシャリスト。原価計算、利益分析、プロジェクトシステムの設計構築を専門とする。製造業のコスト削減プロジェクトで多数の実績あり。',
    'specialty' => 'CO, PS, 原価管理',
    'avatar' => 'panda.svg',
    'experience' => 11,
  ],
];

// membership plans
$plans = [
  [
    'title' => '無料（Free）',
    'desc' => 'SAP学習を始めたばかりの方に最適なプランです。基礎的なコンテンツを無料でお試しいただけます。',
    'price' => 0,
    'interval' => 'month',
    'popular' => false,
    'features' => ['厳選10コース', '毎日クイズ', 'SAP用語集', '広告表示'],
  ],
  [
    'title' => 'スタンダード（Standard）',
    'desc' => '本格的にSAPを学びたい方に。全コースと動画ライブラリが使い放題。学習記録も追跡可能です。',
    'price' => 1980,
    'interval' => 'month',
    'popular' => true,
    'features' => ['全コース見放題', '全動画ライブラリ', '毎日クイズ+過去問', '学習記録・進捗管理', '広告非表示', '月次レポート'],
  ],
  [
    'title' => 'プレミアム（Premium）',
    'desc' => 'プロのSAPコンサルタントを目指す方に。AIアシスタント付きの最上位プラン。案件情報やキャリアサポートも。',
    'price' => 4980,
    'interval' => 'month',
    'popular' => false,
    'features' => ['全コース+演習問題', '全動画+限定コンテンツ', 'AIアシスタント(OpenAI連携)', '案件情報へのアクセス', 'キャリア相談', 'オフライン視聴', '修了証発行', '優先サポート'],
  ],
  [
    'title' => '年間（Annual）',
    'desc' => 'スタンダードプランが年間契約で2ヶ月分お得。計画的に学習を続けたい方に。',
    'price' => 19800,
    'interval' => 'year',
    'popular' => false,
    'features' => ['スタンダードの全機能', '2ヶ月分お得', '学習データのエクスポート', '限定ウェビナー参加権'],
  ],
];

// demo users
$users = [
  [
    'name' => '佐藤 健太',
    'email' => 'kenta.sato@example.com',
    'role' => 'subscriber',
    'desc' => '大手製造業の経理部で働く社会人3年目。SAP FI のスキルを身につけて社内SEを目指している。',
  ],
  [
    'name' => '田中 みほ',
    'email' => 'miho.tanaka@example.com',
    'role' => 'subscriber',
    'desc' => 'SAPベンダーに入社2年目の若手コンサルタント。MMモジュールを中心に学習中。平日は毎日1時間、週末は3時間勉強している。',
  ],
  [
    'name' => '鈴木 一郎',
    'email' => 'ichiro.suzuki@example.com',
    'role' => 'subscriber',
    'desc' => '40代のSAPエンジニア。ABAPからS/4HANAへのスキルチェンジを目指してCDS ViewやFioriを勉強中。',
  ],
  [
    'name' => '高橋 美咲',
    'email' => 'misaki.takahashi@example.com',
    'role' => 'subscriber',
    'desc' => '大学で情報システムを学ぶ4年生。SAPに興味を持ち、就職活動に向けてSAPの知識を習得したい。',
  ],
  [
    'name' => '山田 太郎',
    'email' => 'taro.yamada@example.com',
    'role' => 'subscriber',
    'desc' => 'フリーランスのITコンサルタント。SAPプロジェクトに参画するため一からSAPを学習中。',
  ],
  [
    'name' => '渡辺 直美',
    'email' => 'naomi.watanabe@example.com',
    'role' => 'subscriber',
    'desc' => 'SAPのHRモジュール担当。SuccessFactorsの導入プロジェクトにアサインされ、クラウドHRの知識を深めたい。',
  ],
  [
    'name' => '伊藤 朋也',
    'email' => 'tomoya.ito@example.com',
    'role' => 'subscriber',
    'desc' => '中国地方の製造業でSAPの社内運用担当。Basisのスキルアップのため学習中。',
  ],
];

// learning paths
$learning_paths = [
  [
    'title' => 'SAP 超入門パス',
    'desc' => 'SAPをまったく知らない初心者向けの入門パス。SAPの基本概念から主要モジュールの概要までを3ステップで学べます。',
    'audience' => 'SAP未経験者、新入社員',
    'duration' => '2週間',
    'module' => 's4',
    'steps' => [
      ['title' => 'SAP って何？ — 世界のERPを理解する', 'content' => 'SAPの歴史、ERPの役割、SAP社の製品群について学びます。'],
      ['title' => 'SAP のモジュール構成を覚えよう', 'content' => 'FI、CO、MM、SD、PP、HR、ABAP、Basis — 各モジュールの役割と連携を理解。'],
      ['title' => 'SAP システムの画面操作に慣れよう', 'content' => 'SAP GUI と Fiori Launchpad の基本操作、トランザクションコードの使い方。'],
    ],
  ],
  [
    'title' => 'FI/CO 会計マスターパス',
    'desc' => '財務会計（FI）と管理会計（CO）を体系的に学ぶ学習パス。基礎から応用まで7ステップでマスター。',
    'audience' => '経理業務担当者、FI/COコンサルタント志望',
    'duration' => '8週間',
    'module' => 'fi',
    'steps' => [
      ['title' => '財務会計の基礎概念', 'content' => '会社コード、勘定科目表、会計伝票の基本構造を理解する。'],
      ['title' => 'FI 基本設定とマスタデータ', 'content' => '会社コード設定、勘定科目マスタ、取引先マスタの作成方法。'],
      ['title' => '日常取引の処理', 'content' => 'FB50での仕訳入力、売掛金/買掛金管理、支払処理。'],
      ['title' => '管理会計（CO）の基礎', 'content' => '原価センタ、内部受注、配賦サイクルの基本。'],
      ['title' => '月次決算処理', 'content' => '減価償却、評価替え、決算整理仕訳、残高確認。'],
      ['title' => 'レポートと分析', 'content' => 'SAP標準レポート、FAN（Fiori Analysis）を使ったデータ分析。'],
      ['title' => 'S/4HANA会計の新機能', 'content' => 'Universal Journal、ドキュメント分割、新勘定科目表アプローチ。'],
    ],
  ],
  [
    'title' => 'ABAP 開発者養成パス',
    'desc' => 'ABAP初心者からモダンなS/4HANA開発までを6ステップで習得する開発者向けパス。',
    'audience' => 'プログラミング経験者、ABAP初心者',
    'duration' => '12週間',
    'module' => 'abap',
    'steps' => [
      ['title' => 'ABAP 基本構文', 'content' => 'データ型、変数、制御構文、内部テーブルの基本を学ぶ。'],
      ['title' => 'ABAP データベースアクセス', 'content' => 'Open SQL、SELECT文の書き方、パフォーマンスを考慮したコーディング。'],
      ['title' => 'ABAP オブジェクト指向', 'content' => 'クラス、インターフェース、継承、イベントハンドリング。'],
      ['title' => 'CDS View とデータモデリング', 'content' => 'CDS Viewの作成、アノテーション、Association。'],
      ['title' => 'RAP モデル開発', 'content' => 'Restful ABAP Programming Model のトランザクションハンドリング。'],
      ['title' => 'Fiori アプリ開発', 'content' => 'Fiori Elements、Fiori Launchpad 統合、OData サービスの公開。'],
    ],
  ],
  [
    'title' => 'MM/SD ロジスティクス実践パス',
    'desc' => '購買管理（MM）と販売管理（SD）の実務に必要な知識を8ステップで体系的に学習。',
    'audience' => '物流・購買・販売業務担当者、MM/SDコンサルタント',
    'duration' => '10週間',
    'module' => 'mm',
    'steps' => [
      ['title' => 'ロジスティクスの全体像', 'content' => 'MM と SD の基本組織体系とマスタデータの関係性を理解する。'],
      ['title' => 'MM 購買プロセス基礎', 'content' => '購買依頼、発注、入庫、請求照合の一連の流れ。'],
      ['title' => 'MM 在庫管理', 'content' => '移動タイプ、棚卸、在庫評価、転記の基礎。'],
      ['title' => 'MM 購買条件とソース決定', 'content' => '条件設定、ソースリスト、枠契約の管理。'],
      ['title' => 'SD 販売プロセス基礎', 'content' => '見積、受注、出荷、請求までの基本フロー。'],
      ['title' => 'SD 価格設定と条件技術', 'content' => '条件テーブル、条件タイプ、価格決定手順。'],
      ['title' => 'SD 出荷と輸送', 'content' => '出荷伝票の作成、ピッキング、配送ルート管理。'],
      ['title' => 'MM/SD 連携実務', 'content' => '購買と販売の連携、在庫管理と販売のデータ連携。'],
    ],
  ],
  [
    'title' => 'S/4HANA 移行プロフェッショナルパス',
    'desc' => 'ECC から S/4HANA への移行を成功させるための実践的ナレッジを5ステップで凝縮。',
    'audience' => 'プロジェクトマネージャー、SAPコンサルタント',
    'duration' => '6週間',
    'module' => 's4',
    'steps' => [
      ['title' => 'S/4HANA のアーキテクチャ理解', 'content' => 'S/4HANAの技術革新、HANA DB、Fiori、Simplification List。'],
      ['title' => '移行方式の選定', 'content' => 'Brownfield vs Greenfield、System Conversion vs New Implementation。'],
      ['title' => 'システム移行の実務', 'content' => 'SAP Readiness Check、SUM、データ移行ツールの活用。'],
      ['title' => 'テスト計画と実行', 'content' => 'テスト戦略、Regression Test、ユーザー受け入れテスト。'],
      ['title' => '運用移行とチェンジマネジメント', 'content' => 'カットオーバー計画、ユーザートレーニング、運用体制の構築。'],
    ],
  ],
  [
    'title' => 'SAP Basis & クラウドインフラパス',
    'desc' => 'SAP Basis の基礎からクラウド基盤の運用までを実践的に学ぶ。',
    'audience' => 'インフラエンジニア、SAP Basis初心者',
    'duration' => '8週間',
    'module' => 'basis',
    'steps' => [
      ['title' => 'SAP Basis の役割と基礎', 'content' => 'Basisの役割、システムアーキテクチャ、起動/停止手順。'],
      ['title' => 'ユーザー管理と権限設定', 'content' => 'PFCGロール管理、権限プロファイル、SU53/SUIMの活用。'],
      ['title' => 'トランスポート管理', 'content' => 'CTSの設定、トランスポートルート、リリース戦略。'],
      ['title' => 'SAP システム監視', 'content' => 'CCMS、ST03/ST04でのパフォーマンス監視、アラート設定。'],
      ['title' => 'バックアップとリカバリ', 'content' => 'DBバックアップ戦略、BRBACKUP/BRRESTORE、障害復旧手順。'],
      ['title' => 'クラウド移行と運用', 'content' => 'SAP on AWS/Azure/GCP、CLOUDの考慮点、TCO最適化。'],
    ],
  ],
];

echo "=== SAP Panda 追加データ生成 ===\n\n";

// ----- 1. Teachers -----
echo "教師を作成中...\n";
$created_teachers = 0;
foreach ($teachers as $t) {
  $exists = get_posts(['post_type' => 'teacher', 'title' => $t['name'], 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
  if (!empty($exists)) { echo "  スキップ（既存）: {$t['name']}\n"; continue; }
  $pid = wp_insert_post([
    'post_type' => 'teacher',
    'post_title' => $t['name'],
    'post_content' => $t['bio'],
    'post_status' => 'publish',
    'post_author' => 1,
  ]);
  if (is_wp_error($pid)) { echo "  エラー: {$t['name']}\n"; continue; }
  update_post_meta($pid, 'teacher_specialty', $t['specialty']);
  update_post_meta($pid, 'teacher_avatar', $t['avatar']);
  update_post_meta($pid, 'teacher_experience', $t['experience']);
  echo "  ✓ 作成: {$t['name']} (ID: {$pid})\n";
  $created_teachers++;
}
echo "教師: {$created_teachers} 件作成\n\n";

// ----- 2. Membership Plans -----
echo "会員プランを作成中...\n";
$created_plans = 0;
foreach ($plans as $p) {
  $exists = get_posts(['post_type' => 'member_plan', 'title' => $p['title'], 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
  if (!empty($exists)) { echo "  スキップ（既存）: {$p['title']}\n"; continue; }
  $pid = wp_insert_post([
    'post_type' => 'member_plan',
    'post_title' => $p['title'],
    'post_content' => $p['desc'],
    'post_status' => 'publish',
    'post_author' => 1,
  ]);
  if (is_wp_error($pid)) { echo "  エラー: {$p['title']}\n"; continue; }
  update_post_meta($pid, 'plan_price', $p['price']);
  update_post_meta($pid, 'plan_interval', $p['interval']);
  update_post_meta($pid, 'plan_popular', $p['popular'] ? '1' : '0');
  update_post_meta($pid, 'plan_features', $p['features']);
  echo "  ✓ 作成: {$p['title']} (ID: {$pid}, ¥{$p['price']}/{$p['interval']})\n";
  $created_plans++;
}
echo "会員プラン: {$created_plans} 件作成\n\n";

// ----- 3. Demo Users -----
echo "デモユーザーを作成中...\n";
$created_users = 0;
foreach ($users as $u) {
  $exists = email_exists($u['email']);
  if ($exists) { echo "  スキップ（既存）: {$u['name']}\n"; continue; }
  $uid = wp_insert_user([
    'user_login' => strtok($u['email'], '@'),
    'user_email' => $u['email'],
    'user_pass' => 'demo1234',
    'display_name' => $u['name'],
    'role' => $u['role'],
    'description' => $u['desc'],
  ]);
  if (is_wp_error($uid)) { echo "  エラー: {$u['name']}\n"; continue; }
  update_user_meta($uid, 'nickname', $u['name']);
  echo "  ✓ 作成: {$u['name']} ({$u['email']}) ID: {$uid}\n";
  $created_users++;
}
echo "デモユーザー: {$created_users} 件作成（パスワード: demo1234）\n\n";

// ----- 4. Learning Paths -----
echo "学習パスを作成中...\n";
$created_paths = 0;
$created_steps = 0;
foreach ($learning_paths as $lp) {
  $exists = get_posts(['post_type' => 'learning_path', 'title' => $lp['title'], 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
  if (!empty($exists)) { echo "  スキップ（既存）: {$lp['title']}\n"; continue; }
  $path_id = wp_insert_post([
    'post_type' => 'learning_path',
    'post_title' => $lp['title'],
    'post_content' => '<p>' . $lp['desc'] . '</p>',
    'post_excerpt' => $lp['desc'],
    'post_status' => 'publish',
    'post_author' => 1,
  ]);
  if (is_wp_error($path_id)) { echo "  エラー: {$lp['title']}\n"; continue; }
  update_post_meta($path_id, 'path_audience', $lp['audience']);
  update_post_meta($path_id, 'path_duration', $lp['duration']);
  if (!empty($lp['module'])) {
    wp_set_object_terms($path_id, $lp['module'], 'sap_module');
  }
  echo "  ✓ 作成: {$lp['title']} (ID: {$path_id})\n";
  $created_paths++;
  // Create steps for this path
  $step_order = 1;
  foreach ($lp['steps'] as $s) {
    $step_exists = get_posts(['post_type' => 'path_step', 'title' => $s['title'], 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
    if (!empty($step_exists)) { continue; }
    $step_id = wp_insert_post([
      'post_type' => 'path_step',
      'post_title' => $s['title'],
      'post_content' => '<h2>' . $s['title'] . '</h2><p>' . $s['content'] . '</p>',
      'post_status' => 'publish',
      'post_author' => 1,
      'menu_order' => $step_order,
    ]);
    if (is_wp_error($step_id)) { continue; }
    update_post_meta($step_id, 'step_path_id', $path_id);
    update_post_meta($step_id, 'step_order', $step_order);
    echo "    └ ステップ {$step_order}: {$s['title']} (ID: {$step_id})\n";
    $created_steps++;
    $step_order++;
  }
  // Save path_steps meta so REST API can read it
  $steps_meta = [];
  foreach ($lp['steps'] as $i => $s) {
    $steps_meta[] = [
      'step_title' => $s['title'],
      'step_content' => $s['content'],
      'step_time' => $s['time'] ?? '30分',
      'step_order' => $i + 1,
    ];
  }
  update_post_meta($path_id, 'path_steps', $steps_meta);
echo "学習パス: {$created_paths} 件作成（ステップ: {$created_steps} 件）\n\n";

// ----- 5. Learning Progress (demo data) -----
echo "学習進捗データを作成中...\n";
global $wpdb;
$demo_users = get_users(['role' => 'subscriber', 'number' => 5]);
$courses = get_posts(['post_type' => 'course', 'posts_per_page' => -1, 'fields' => 'ids']);
$progress_table = $wpdb->prefix . 'learning_progress';
$progress_count = 0;
foreach ($demo_users as $user) {
  $assigned = array_slice($courses, 0, rand(3, 6));
  foreach ($assigned as $cid) {
    $wpdb->replace($progress_table, [
      'user_id' => $user->ID,
      'course_id' => $cid,
      'progress_percent' => rand(10, 100),
      'status' => rand(0, 3) > 0 ? 'in_progress' : 'completed',
      'started_at' => date('Y-m-d H:i:s', strtotime('-'.rand(7, 90).' days')),
      'updated_at' => current_time('mysql'),
    ]);
    $progress_count++;
  }
}
echo "学習進捗: {$progress_count} 件作成\n\n";

// ----- 6. Quiz Attempts -----
echo "クイズ回答データを作成中...\n";
$quizzes = get_posts(['post_type' => 'daily_quiz', 'posts_per_page' => -1, 'fields' => 'ids']);
$attempt_table = $wpdb->prefix . 'quiz_attempts';
$attempt_count = 0;
foreach ($demo_users as $user) {
  foreach ($quizzes as $qid) {
    if (rand(0, 3) > 0) { // 75% chance of attempting
      $options = get_post_meta($qid, 'quiz_options', true);
      $correct = 0;
      if (is_array($options)) {
        foreach ($options as $o) {
          if (!empty($o['correct'])) $correct = array_search($o, $options);
        }
      }
      $selected = rand(0, 3);
      $wpdb->insert($attempt_table, [
        'user_id' => $user->ID,
        'quiz_id' => $qid,
        'selected_option' => $selected,
        'is_correct' => ($selected === $correct) ? 1 : 0,
        'attempted_at' => date('Y-m-d H:i:s', strtotime('-'.rand(0, 14).' days')),
      ]);
      $attempt_count++;
    }
  }
}
echo "クイズ回答: {$attempt_count} 件作成\n\n";

// ----- 7. User Points -----
echo "ユーザーポイントを作成中...\n";
$points_table = $wpdb->prefix . 'user_points';
$points_count = 0;
foreach ($demo_users as $user) {
  $total = rand(50, 850);
  $wpdb->replace($points_table, [
    'user_id' => $user->ID,
    'total_points' => $total,
    'updated_at' => current_time('mysql'),
  ]);
  $points_count++;
}
echo "ユーザーポイント: {$points_count} 件作成\n\n";

// ----- 8. Post Reactions -----
echo "記事のリアクションを作成中...\n";
$articles = get_posts(['post_type' => 'post', 'posts_per_page' => 20, 'orderby' => 'rand']);
$reactions_table = $wpdb->prefix . 'reactions';
$reactions_count = 0;
$react_types = ['like', 'helpful', 'insightful', 'bookmark'];
foreach ($articles as $post) {
  $users = array_rand(array_flip($demo_users), min(rand(1, 4), count($demo_users)));
  if (!is_array($users)) $users = [$users];
  foreach ($users as $u) {
    $r = $react_types[array_rand($react_types)];
    $wpdb->replace($reactions_table, [
      'user_id' => is_object($u) ? $u->ID : $u,
      'post_id' => $post->ID,
      'reaction_type' => $r,
      'created_at' => current_time('mysql'),
    ]);
    $reactions_count++;
  }
}
echo "リアクション: {$reactions_count} 件作成\n\n";

echo "=== 完了 ===\n";
printf("教師: %d 件\n", $created_teachers);
printf("会員プラン: %d 件\n", $created_plans);
printf("デモユーザー: %d 件\n", $created_users);
printf("学習パス: %d 件\n", $created_paths);
