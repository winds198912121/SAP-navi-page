<?php
/**
 * 学習パスの各ステップに8〜10件の関連コンテンツを紐付ける
 * (ID直指定で確実にマッチ)
 *
 * 使用方法： wp eval-file seed-step-content.php
 */

// ============================================================
// 各ステップ → 関連アイテムID のマッピング
// 1ステップあたり8〜10件
// ============================================================

$path_map = [
  // === SAP 超入門パス (6 paths × 3 steps) ===
  2848 => [
    // Step 1: SAP って何？
    2849 => [
      ['type' => 'post',  'id' => 8],   // SAPとは？
      ['type' => 'post',  'id' => 64],  // 初心者が最初に選ぶべきモジュールは？
      ['type' => 'post',  'id' => 48],  // SAPコンサルタントになるには？
      ['type' => 'course',   'id' => 77],  // SAP プロジェクトマネジメント実践
      ['type' => 'course',   'id' => 68],  // SAP FI/CO 基本設定入門
      ['type' => 'video',    'id' => 2928],// SAP S/4HANA とは？
      ['type' => 'video',    'id' => 2929],// SAP Fiori 入門
      ['type' => 'knowledge','id' => 89],  // SAP 組織構造の基本
      ['type' => 'knowledge','id' => 94],  // SAP 用語集
      ['type' => 'post',  'id' => 60],  // SAP導入プロジェクトのフェーズ別仕事内容
    ],
    // Step 2: SAP のモジュール構成
    2850 => [
      ['type' => 'post',  'id' => 9],   // FIモジュール入門
      ['type' => 'post',  'id' => 10],  // COモジュールとは？
      ['type' => 'post',  'id' => 11],  // MMモジュール完全ガイド
      ['type' => 'post',  'id' => 12],  // SDモジュールの全体像
      ['type' => 'post',  'id' => 16],  // PPモジュール
      ['type' => 'post',  'id' => 17],  // HRモジュールの基礎
      ['type' => 'course',   'id' => 68],  // SAP FI/CO 基本設定入門
      ['type' => 'video',    'id' => 2928],// SAP S/4HANA とは？
      ['type' => 'knowledge','id' => 89],  // SAP 組織構造の基本
    ],
    // Step 3: 画面操作
    2851 => [
      ['type' => 'post',  'id' => 24],  // SAP Fioriとは？
      ['type' => 'post',  'id' => 22],  // ユーザー権限管理
      ['type' => 'course',   'id' => 75],  // Basis システム管理入門
      ['type' => 'course',   'id' => 68],  // SAP FI/CO 基本設定入門
      ['type' => 'video',    'id' => 2929],// SAP Fiori 入門
      ['type' => 'video',    'id' => 2954],// SM30 テーブルメンテナンス
      ['type' => 'knowledge','id' => 97],  // SM30
      ['type' => 'knowledge','id' => 88],  // FB50
      ['type' => 'post',  'id' => 27],  // バッチジョブの基礎
    ],
  ],

  // === FI/CO 会計マスターパス (7 steps) ===
  2852 => [
    2853 => [ // 財務会計の基礎概念
      ['type' => 'post',  'id' => 9],   // FIモジュール入門
      ['type' => 'post',  'id' => 18],  // SAP伝票体系
      ['type' => 'post',  'id' => 21],  // 会計伝票の基本
      ['type' => 'course',   'id' => 68],  // SAP FI/CO 基本設定入門
      ['type' => 'course',   'id' => 79],  // SAP 会計伝票の仕組み
      ['type' => 'video',    'id' => 2932],// SAP FI/CO 基本設定
      ['type' => 'video',    'id' => 2933],// 決算業務の効率化
      ['type' => 'knowledge','id' => 95],  // COとFIの違い
      ['type' => 'knowledge','id' => 89],  // 組織構造の基本
    ],
    2854 => [ // FI 基本設定とマスタデータ
      ['type' => 'post',  'id' => 9],   // FIモジュール入門
      ['type' => 'post',  'id' => 18],  // SAP伝票体系
      ['type' => 'post',  'id' => 19],  // SAP番号範囲
      ['type' => 'course',   'id' => 68],  // SAP FI/CO 基本設定入門
      ['type' => 'course',   'id' => 79],  // SAP 会計伝票の仕組み
      ['type' => 'course',   'id' => 69],  // MM 購買プロセス
      ['type' => 'video',    'id' => 2932],// SAP FI/CO 基本設定
      ['type' => 'knowledge','id' => 99],  // 勘定科目マスタ一括登録
      ['type' => 'knowledge','id' => 88],  // FB50
    ],
    2855 => [ // 日常取引の処理
      ['type' => 'post',  'id' => 21],  // 会計伝票の基本
      ['type' => 'post',  'id' => 18],  // SAP伝票体系
      ['type' => 'post',  'id' => 20],  // SAP承認プロセス
      ['type' => 'course',   'id' => 68],  // SAP FI/CO 基本設定入門
      ['type' => 'course',   'id' => 79],  // SAP 会計伝票の仕組み
      ['type' => 'video',    'id' => 2933],// 決算業務の効率化
      ['type' => 'video',    'id' => 2964],// FBCJ 小口現金管理
      ['type' => 'video',    'id' => 2965],// SAP 連結会計入門
      ['type' => 'knowledge','id' => 88],  // FB50
      ['type' => 'knowledge','id' => 99],  // 勘定科目マスタ
    ],
    2856 => [ // 管理会計（CO）の基礎
      ['type' => 'post',  'id' => 10],  // COモジュールとは？
      ['type' => 'post',  'id' => 18],  // SAP伝票体系
      ['type' => 'course',   'id' => 73],  // CO 原価計算実践マスター
      ['type' => 'course',   'id' => 84],  // CO 利益分析
      ['type' => 'video',    'id' => 2938],// CO 原価センタ会計入門
      ['type' => 'video',    'id' => 2939],// 内部受注の設定と実務
      ['type' => 'knowledge','id' => 106], // CO 内部受注
      ['type' => 'knowledge','id' => 95],  // COとFIの違い
    ],
    2857 => [ // 月次決算処理
      ['type' => 'post',  'id' => 9],   // FIモジュール入門
      ['type' => 'post',  'id' => 21],  // 会計伝票の基本
      ['type' => 'course',   'id' => 80],  // SAP S/4HANA 会計実践
      ['type' => 'course',   'id' => 68],  // SAP FI/CO 基本設定入門
      ['type' => 'video',    'id' => 2933],// 決算業務の効率化
      ['type' => 'video',    'id' => 2965],// SAP 連結会計入門
      ['type' => 'knowledge','id' => 88],  // FB50
      ['type' => 'knowledge','id' => 106], // CO 内部受注
      ['type' => 'post',  'id' => 19],  // SAP番号範囲
    ],
    2858 => [ // レポートと分析
      ['type' => 'post',  'id' => 34],  // SAP BTP
      ['type' => 'post',  'id' => 35],  // SAP Datasphere
      ['type' => 'course',   'id' => 84],  // CO 利益分析
      ['type' => 'course',   'id' => 80],  // SAP S/4HANA 会計実践
      ['type' => 'video',    'id' => 2963],// SAP Analytics Cloud
      ['type' => 'video',    'id' => 2952],// ALV レポート開発
      ['type' => 'knowledge','id' => 90],  // ALV レポート
      ['type' => 'knowledge','id' => 89],  // 組織構造の基本
    ],
    2859 => [ // S/4HANA会計の新機能
      ['type' => 'post',  'id' => 15],  // S/4HANAとは？
      ['type' => 'post',  'id' => 28],  // S/4HANA Cloud
      ['type' => 'post',  'id' => 33],  // SAP Clean Core
      ['type' => 'course',   'id' => 80],  // SAP S/4HANA 会計実践
      ['type' => 'course',   'id' => 72],  // S/4HANA移行
      ['type' => 'video',    'id' => 2951],// Universal Journal
      ['type' => 'video',    'id' => 2960],// S/4HANA Cloud vs On-Premise
      ['type' => 'knowledge','id' => 105], // S/4HANA簡素化リスト
      ['type' => 'knowledge','id' => 93],  // CDS View
    ],
  ],

  // === ABAP 開発者養成パス (6 steps) ===
  2860 => [
    2861 => [ // ABAP 基本構文
      ['type' => 'post',  'id' => 13],  // ABAPとは？
      ['type' => 'post',  'id' => 26],  // SAPテーブル構造
      ['type' => 'post',  'id' => 32],  // ABAP Cloud
      ['type' => 'course',   'id' => 70],  // ABAP オブジェクト指向
      ['type' => 'course',   'id' => 81],  // RAP モデル開発
      ['type' => 'video',    'id' => 2930],// ABAP プログラミング基礎
      ['type' => 'video',    'id' => 2940],// ABAP オブジェクト指向入門
      ['type' => 'knowledge','id' => 104], // ABAP 新しい構文
      ['type' => 'knowledge','id' => 90],  // ALV レポート
    ],
    2862 => [ // ABAP データベースアクセス
      ['type' => 'post',  'id' => 26],  // SAPテーブル構造
      ['type' => 'post',  'id' => 13],  // ABAPとは？
      ['type' => 'course',   'id' => 70],  // ABAP オブジェクト指向
      ['type' => 'course',   'id' => 85],  // Basis パフォーマンス
      ['type' => 'video',    'id' => 2945],// SAP パフォーマンスチューニング
      ['type' => 'video',    'id' => 2952],// ALV レポート開発
      ['type' => 'knowledge','id' => 93],  // CDS View
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
      ['type' => 'post',  'id' => 25],  // ALEとIDoc
    ],
    2863 => [ // ABAP オブジェクト指向
      ['type' => 'post',  'id' => 13],  // ABAPとは？
      ['type' => 'post',  'id' => 32],  // ABAP Cloud
      ['type' => 'course',   'id' => 70],  // ABAP オブジェクト指向
      ['type' => 'course',   'id' => 81],  // RAP モデル開発
      ['type' => 'video',    'id' => 2940],// ABAP オブジェクト指向入門
      ['type' => 'video',    'id' => 2941],// RAP モデル開発
      ['type' => 'knowledge','id' => 90],  // ALV レポート
      ['type' => 'knowledge','id' => 104], // ABAP 新しい構文
    ],
    2864 => [ // CDS View とデータモデリング
      ['type' => 'post',  'id' => 15],  // S/4HANAとは？
      ['type' => 'post',  'id' => 32],  // ABAP Cloud
      ['type' => 'post',  'id' => 26],  // SAPテーブル構造
      ['type' => 'course',   'id' => 81],  // RAP モデル開発
      ['type' => 'course',   'id' => 72],  // S/4HANA移行
      ['type' => 'video',    'id' => 2931],// CDS View 完全入門
      ['type' => 'video',    'id' => 2942],// Fiori Elements
      ['type' => 'knowledge','id' => 93],  // CDS Viewの基本構文
      ['type' => 'knowledge','id' => 105], // S/4HANA簡素化リスト
    ],
    2865 => [ // RAP モデル開発
      ['type' => 'post',  'id' => 32],  // ABAP Cloud
      ['type' => 'post',  'id' => 34],  // SAP BTP
      ['type' => 'post',  'id' => 33],  // SAP Clean Core
      ['type' => 'course',   'id' => 81],  // RAP モデル開発
      ['type' => 'course',   'id' => 78],  // Fiori アプリ開発入門
      ['type' => 'video',    'id' => 2941],// RAP モデル開発
      ['type' => 'video',    'id' => 2942],// Fiori Elements
      ['type' => 'knowledge','id' => 93],  // CDS View
      ['type' => 'knowledge','id' => 98],  // Fiori Launchpad
    ],
    2866 => [ // Fiori アプリ開発
      ['type' => 'post',  'id' => 24],  // SAP Fioriとは？
      ['type' => 'post',  'id' => 34],  // SAP BTP
      ['type' => 'post',  'id' => 32],  // ABAP Cloud
      ['type' => 'course',   'id' => 78],  // Fiori アプリ開発入門
      ['type' => 'course',   'id' => 81],  // RAP モデル開発
      ['type' => 'video',    'id' => 2929],// SAP Fiori 入門
      ['type' => 'video',    'id' => 2942],// Fiori Elements
      ['type' => 'knowledge','id' => 98],  // Fiori Launchpad
      ['type' => 'knowledge','id' => 97],  // SM30
    ],
  ],

  // === MM/SD ロジスティクス実践パス (8 steps) ===
  2867 => [
    2868 => [ // ロジスティクスの全体像
      ['type' => 'post',  'id' => 11],  // MMモジュール
      ['type' => 'post',  'id' => 12],  // SDモジュール
      ['type' => 'post',  'id' => 44],  // デジタルサプライチェーン
      ['type' => 'course',   'id' => 69],  // MM 購買プロセス
      ['type' => 'course',   'id' => 71],  // SD 販売管理
      ['type' => 'course',   'id' => 74],  // PP 生産計画
      ['type' => 'video',    'id' => 2934],// MM 購買プロセス
      ['type' => 'video',    'id' => 2936],// SD 受注から出荷
      ['type' => 'knowledge','id' => 91],  // MM 移動タイプ
      ['type' => 'knowledge','id' => 92],  // VA01
    ],
    2869 => [ // MM 購買プロセス基礎
      ['type' => 'post',  'id' => 11],  // MMモジュール
      ['type' => 'post',  'id' => 44],  // デジタルサプライチェーン
      ['type' => 'course',   'id' => 69],  // MM 購買プロセス
      ['type' => 'course',   'id' => 82],  // MM 在庫管理
      ['type' => 'video',    'id' => 2934],// MM 購買プロセス
      ['type' => 'video',    'id' => 2956],// ME21N 発注書作成
      ['type' => 'video',    'id' => 2966],// MM 購買情報照会
      ['type' => 'knowledge','id' => 102], // ME21N
      ['type' => 'knowledge','id' => 91],  // MM 移動タイプ
    ],
    2870 => [ // MM 在庫管理
      ['type' => 'post',  'id' => 11],  // MMモジュール
      ['type' => 'post',  'id' => 44],  // デジタルサプライチェーン
      ['type' => 'course',   'id' => 82],  // MM 在庫管理
      ['type' => 'course',   'id' => 69],  // MM 購買プロセス
      ['type' => 'video',    'id' => 2935],// 在庫管理の実務
      ['type' => 'video',    'id' => 2957],// 在庫評価の実務
      ['type' => 'knowledge','id' => 91],  // MM 移動タイプ
      ['type' => 'knowledge','id' => 102], // ME21N
      ['type' => 'post',  'id' => 19],  // SAP番号範囲
    ],
    2871 => [ // 購買条件とソース決定
      ['type' => 'post',  'id' => 11],  // MMモジュール
      ['type' => 'post',  'id' => 20],  // SAP承認プロセス
      ['type' => 'course',   'id' => 69],  // MM 購買プロセス
      ['type' => 'course',   'id' => 83],  // SD 価格設定
      ['type' => 'video',    'id' => 2934],// MM 購買プロセス
      ['type' => 'video',    'id' => 2966],// MM 購買情報照会
      ['type' => 'knowledge','id' => 102], // ME21N
      ['type' => 'knowledge','id' => 94],  // SAP 用語集
    ],
    2872 => [ // SD 販売プロセス基礎
      ['type' => 'post',  'id' => 12],  // SDモジュール
      ['type' => 'post',  'id' => 44],  // デジタルサプライチェーン
      ['type' => 'course',   'id' => 71],  // SD 販売管理
      ['type' => 'course',   'id' => 83],  // SD 価格設定
      ['type' => 'video',    'id' => 2936],// SD 受注から出荷
      ['type' => 'video',    'id' => 2958],// VA01 受注作成
      ['type' => 'knowledge','id' => 92],  // VA01
      ['type' => 'knowledge','id' => 103], // VF01
    ],
    2873 => [ // 価格設定と条件技術
      ['type' => 'post',  'id' => 12],  // SDモジュール
      ['type' => 'post',  'id' => 23],  // バリアント設定
      ['type' => 'course',   'id' => 83],  // SD 価格設定
      ['type' => 'course',   'id' => 71],  // SD 販売管理
      ['type' => 'video',    'id' => 2937],// SAP SD 価格設定
      ['type' => 'video',    'id' => 2958],// VA01 受注作成
      ['type' => 'knowledge','id' => 92],  // VA01
      ['type' => 'knowledge','id' => 103], // VF01
    ],
    2874 => [ // 出荷と輸送
      ['type' => 'post',  'id' => 12],  // SDモジュール
      ['type' => 'post',  'id' => 38],  // モバイルSAP
      ['type' => 'course',   'id' => 71],  // SD 販売管理
      ['type' => 'course',   'id' => 74],  // PP 生産計画
      ['type' => 'video',    'id' => 2936],// SD 受注から出荷
      ['type' => 'video',    'id' => 2959],// VF01 請求書作成
      ['type' => 'knowledge','id' => 92],  // VA01
      ['type' => 'knowledge','id' => 91],  // MM 移動タイプ
    ],
    2875 => [ // MM/SD 連携実務
      ['type' => 'post',  'id' => 11],  // MMモジュール
      ['type' => 'post',  'id' => 12],  // SDモジュール
      ['type' => 'post',  'id' => 44],  // デジタルサプライチェーン
      ['type' => 'course',   'id' => 69],  // MM 購買プロセス
      ['type' => 'course',   'id' => 71],  // SD 販売管理
      ['type' => 'course',   'id' => 74],  // PP 生産計画
      ['type' => 'video',    'id' => 2934],// MM 購買プロセス
      ['type' => 'video',    'id' => 2936],// SD 受注から出荷
      ['type' => 'knowledge','id' => 91],  // MM 移動タイプ
      ['type' => 'knowledge','id' => 92],  // VA01
    ],
  ],

  // === S/4HANA 移行プロフェッショナルパス (5 steps) ===
  2876 => [
    2877 => [ // アーキテクチャ理解
      ['type' => 'post',  'id' => 15],  // S/4HANAとは？
      ['type' => 'post',  'id' => 28],  // S/4HANA Cloud
      ['type' => 'post',  'id' => 29],  // RISE with SAP
      ['type' => 'course',   'id' => 72],  // S/4HANA移行
      ['type' => 'course',   'id' => 80],  // SAP S/4HANA 会計
      ['type' => 'video',    'id' => 2928],// SAP S/4HANA とは？
      ['type' => 'video',    'id' => 2951],// Universal Journal
      ['type' => 'knowledge','id' => 93],  // CDS View
      ['type' => 'knowledge','id' => 105], // S/4HANA簡素化リスト
    ],
    2878 => [ // 移行方式の選定
      ['type' => 'post',  'id' => 15],  // S/4HANAとは？
      ['type' => 'post',  'id' => 28],  // S/4HANA Cloud
      ['type' => 'post',  'id' => 31],  // グリーンリージョン戦略
      ['type' => 'course',   'id' => 72],  // S/4HANA移行
      ['type' => 'course',   'id' => 77],  // SAP プロジェクトマネジメント
      ['type' => 'video',    'id' => 2961],// Greenfield vs Brownfield
      ['type' => 'video',    'id' => 2950],// S/4HANA移行プロジェクト実践
      ['type' => 'knowledge','id' => 105], // S/4HANA簡素化リスト
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
    ],
    2879 => [ // システム移行の実務
      ['type' => 'post',  'id' => 28],  // S/4HANA Cloud
      ['type' => 'post',  'id' => 33],  // SAP Clean Core
      ['type' => 'post',  'id' => 29],  // RISE with SAP
      ['type' => 'course',   'id' => 72],  // S/4HANA移行
      ['type' => 'course',   'id' => 75],  // Basis システム管理
      ['type' => 'video',    'id' => 2950],// S/4HANA移行プロジェクト実践
      ['type' => 'video',    'id' => 2944],// SAP トランスポート管理
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
      ['type' => 'knowledge','id' => 105], // S/4HANA簡素化リスト
    ],
    2880 => [ // テスト計画と実行
      ['type' => 'post',  'id' => 60],  // SAP導入プロジェクト
      ['type' => 'post',  'id' => 67],  // SAPコンサル失敗事例
      ['type' => 'post',  'id' => 65],  // プロジェクトマネージャー
      ['type' => 'course',   'id' => 77],  // SAP プロジェクトマネジメント
      ['type' => 'course',   'id' => 72],  // S/4HANA移行
      ['type' => 'video',    'id' => 2960],// S/4HANA Cloud vs On-Premise
      ['type' => 'video',    'id' => 2962],// SAP BTP 入門
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
      ['type' => 'knowledge','id' => 101], // SAP 権限設定
    ],
    2881 => [ // 運用移行とチェンジマネジメント
      ['type' => 'post',  'id' => 60],  // SAP導入プロジェクト
      ['type' => 'post',  'id' => 65],  // PMへのキャリアアップ
      ['type' => 'post',  'id' => 67],  // 失敗事例
      ['type' => 'course',   'id' => 77],  // SAP プロジェクトマネジメント
      ['type' => 'course',   'id' => 72],  // S/4HANA移行
      ['type' => 'video',    'id' => 2950],// S/4HANA移行プロジェクト実践
      ['type' => 'video',    'id' => 2944],// SAP トランスポート管理
      ['type' => 'knowledge','id' => 101], // SAP 権限設定
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
    ],
  ],

  // === SAP Basis & クラウドインフラパス (6 steps) ===
  2882 => [
    2883 => [ // Basis の役割と基礎
      ['type' => 'post',  'id' => 14],  // Basis入門
      ['type' => 'post',  'id' => 26],  // SAPテーブル構造
      ['type' => 'post',  'id' => 27],  // バッチジョブの基礎
      ['type' => 'course',   'id' => 75],  // Basis システム管理入門
      ['type' => 'course',   'id' => 85],  // Basis パフォーマンス
      ['type' => 'video',    'id' => 2943],// Basis システム管理
      ['type' => 'video',    'id' => 2944],// SAP トランスポート管理
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
      ['type' => 'knowledge','id' => 97],  // SM30
    ],
    2884 => [ // ユーザー管理と権限設定
      ['type' => 'post',  'id' => 22],  // ユーザー権限管理
      ['type' => 'post',  'id' => 45],  // SAPサイバーセキュリティ
      ['type' => 'post',  'id' => 14],  // Basis入門
      ['type' => 'course',   'id' => 75],  // Basis システム管理入門
      ['type' => 'course',   'id' => 85],  // Basis パフォーマンス
      ['type' => 'video',    'id' => 2943],// Basis システム管理
      ['type' => 'video',    'id' => 2955],// SAP 権限エラー
      ['type' => 'video',    'id' => 2945],// SAP パフォーマンスチューニング
      ['type' => 'knowledge','id' => 101], // SAP 権限設定
      ['type' => 'knowledge','id' => 97],  // SM30
    ],
    2885 => [ // トランスポート管理
      ['type' => 'post',  'id' => 14],  // Basis入門
      ['type' => 'post',  'id' => 25],  // ALEとIDoc
      ['type' => 'post',  'id' => 20],  // SAP承認プロセス
      ['type' => 'course',   'id' => 75],  // Basis システム管理入門
      ['type' => 'course',   'id' => 77],  // SAP プロジェクトマネジメント
      ['type' => 'video',    'id' => 2944],// SAP トランスポート管理
      ['type' => 'video',    'id' => 2945],// SAP パフォーマンスチューニング
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
      ['type' => 'knowledge','id' => 97],  // SM30
    ],
    2886 => [ // システム監視
      ['type' => 'post',  'id' => 14],  // Basis入門
      ['type' => 'post',  'id' => 27],  // バッチジョブ
      ['type' => 'post',  'id' => 45],  // SAPサイバーセキュリティ
      ['type' => 'course',   'id' => 85],  // Basis パフォーマンス
      ['type' => 'course',   'id' => 75],  // Basis システム管理入門
      ['type' => 'video',    'id' => 2945],// SAP パフォーマンスチューニング
      ['type' => 'video',    'id' => 2943],// Basis システム管理
      ['type' => 'knowledge','id' => 101], // SAP 権限設定
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
    ],
    2887 => [ // バックアップとリカバリ
      ['type' => 'post',  'id' => 14],  // Basis入門
      ['type' => 'post',  'id' => 45],  // SAPサイバーセキュリティ
      ['type' => 'post',  'id' => 27],  // バッチジョブ
      ['type' => 'course',   'id' => 75],  // Basis システム管理入門
      ['type' => 'course',   'id' => 85],  // Basis パフォーマンス
      ['type' => 'video',    'id' => 2944],// SAP トランスポート管理
      ['type' => 'video',    'id' => 2945],// SAP パフォーマンスチューニング
      ['type' => 'knowledge','id' => 96],  // SAP トランスポート
      ['type' => 'knowledge','id' => 101], // SAP 権限設定
    ],
    2888 => [ // クラウド移行と運用
      ['type' => 'post',  'id' => 28],  // S/4HANA Cloud
      ['type' => 'post',  'id' => 29],  // RISE with SAP
      ['type' => 'post',  'id' => 34],  // SAP BTP
      ['type' => 'course',   'id' => 75],  // Basis システム管理入門
      ['type' => 'course',   'id' => 72],  // S/4HANA移行
      ['type' => 'video',    'id' => 2960],// S/4HANA Cloud vs On-Premise
      ['type' => 'video',    'id' => 2962],// SAP BTP 入門
      ['type' => 'video',    'id' => 2961],// Greenfield vs Brownfield
      ['type' => 'knowledge','id' => 105], // S/4HANA簡素化リスト
      ['type' => 'knowledge','id' => 93],  // CDS View
    ],
  ],
];

// ============================================================
// 実行
// ============================================================
echo "=== 学習パスステップに関連コンテンツを紐付け ===\n\n";

$total_steps = 0;
$total_items = 0;

foreach ($path_map as $path_id => $steps) {
  $path = get_post($path_id);
  if (!$path) {
    echo "⚠️ Path {$path_id} not found\n";
    continue;
  }
  echo "【{$path->post_title}】\n";

  foreach ($steps as $step_id => $items) {
    $step = get_post($step_id);
    if (!$step) {
      echo "  ⚠️ Step {$step_id} not found\n";
      continue;
    }

    // すべてのアイテムが存在するか確認
    $valid = [];
    $missing = [];
    foreach ($items as $item) {
      $p = get_post($item['id']);
      if ($p && $p->post_type === $item['type']) {
        $valid[] = $item;
      } else {
        $missing[] = "{$item['type']}#{$item['id']}";
      }
    }

    if (!empty($missing)) {
      echo "  ⚠️ 欠落 ({$step->post_title}): " . implode(', ', $missing) . "\n";
    }

    if (!empty($valid)) {
      update_post_meta($step_id, 'step_related_items', $valid);
      echo "  ✓ {$step->post_title}: " . count($valid) . "件\n";
      $total_steps++;
      $total_items += count($valid);
    }
  }
  echo "\n";
}

echo "=== 完了 ===\n";
printf("処理ステップ: %d 件\n", $total_steps);
printf("総関連アイテム: %d 件\n", $total_items);
