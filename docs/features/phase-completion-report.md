# SAP Panda Academy — 開発フェーズ完了報告書

> 作成日: 2026-06-12
> プロジェクト: SAP Panda Academy（パンダ先生 × SAP NAVI）

---

## 1. プロジェクト概要

SAP 学習プラットフォーム「パンダ先生」のフロントエンド（React/TypeScript）＋バックエンド（WordPress Plugin）の機能開発。学習コース、ナレッジ管理、案件情報、管理画面などを実装。

**技術スタック:**
| 区分 | 技術 |
|------|------|
| フロントエンド | React 18, TypeScript, Vite, react-router-dom, axios |
| バックエンド | WordPress, PHP 8.3+, Custom Post Type, REST API |
| データベース | MySQL 8（WordPress標準） |
| 認証 | JWT（カスタム実装） |
| UI | カスタムCSS（CSS変数によるテーマシステム） |
| エディター | react-quill（WYSIWYG HTML エディター） |
| テスト | Vitest（フロントエンド）, PHPUnit（バックエンド） |
| E2E | Playwright |

---

## 2. 開発成果サマリー

### 2.1 管理画面（Admin Panel） `/admin/*`

| 機能 | ファイル | 説明 |
|------|---------|------|
| レイアウト | `AdminLayout.tsx` | サイドバーナビ + ルートガード（管理者のみ） |
| 記事管理 | `ArticlesList.tsx`, `ArticleForm.tsx` | 記事CRUD、検索、モジュール絞り込み、ページネーション |
| モジュール管理 | `AdminModules.tsx`, `ModuleForm.tsx` | モジュール一覧、新規作成/編集（カラー、レベル選択） |
| コース管理 | `CoursesList.tsx`, `CourseForm.tsx` | コースCRUD、検索、ページネーション |
| レッスン管理 | `LessonsList.tsx`, `LessonForm.tsx` | レッスン一覧/作成/編集、検索、コース絞り込み、ページネーション |
| ナレッジ管理 | `KnowledgeList.tsx`, `KnowledgeForm.tsx` | ナレッジCRUD、タイプ/モジュールフィルター、ページネーション |

### 2.2 公開画面（Public Pages）

| ページ | ルート | 主要機能 |
|--------|--------|---------|
| ホーム | `/` | Hero（動的統計 + CTA）、モジュール、学習パス、記事、クイズ、ニュースレター |
| モジュール一覧 | `/modules` | グリッド表示、検索、難易度フィルター |
| モジュール詳細 | `/category/:module` | 記事/コース/ナレッジのタブ切り替え |
| 学習パス一覧 | `/paths` | パスカード、オーディエンスフィルター |
| 学習パス詳細 | `/learning/:id` | ステップ一覧、関連記事 |
| コース詳細 | `/course/:id` | コース情報 + レッスン一覧（20件/ページ ページネーション）、関連コース |
| レッスン詳細 | `/lesson/:id` | 章節目次（スクロール追従）、コースリンク |
| ナレッジ詳細 | `/knowledge/:id` | 章節目次、参考リンク、モジュールリンク |
| クイズ | `/quiz-page` | 日替わりクイズ、正否判定+解説 |
| 案件一覧 | `/cases` | 跑马灯（クリックで詳細表示）、スキルマッチ、絞り込み検索（勤務地/月給/期間/経験）、ページネーション、応募フォーム |
| フリーランス登録 | `/cases#worries` | 登録モーダル（ファイル添付可）、ログイン後自動遷移 |
| 動画 | `/video` | — |
| プロフィール | `/profile` | ユーザー情報編集、ポイント表示 |

### 2.3 共通コンポーネント

| コンポーネント | 説明 |
|---------------|------|
| `SiteHeader` | グローバルナビ + 検索 + ユーザードロップダウン |
| `HeaderDropdown` | ユーザーメニュー（プロフィール/会員/ポイント/管理/ログアウト） |
| `LoginModal` | ログイン/新規登録モーダル（パスワード表示切替） |
| `HtmlEditor` | react-quil ベース WYSIWYG エディター（画像アップロード対応） |
| `CaseTicker` | 案件跑马灯（クリックで詳細モーダル） |
| `CaseCard` | 案件カード |
| `CaseDetailModal` | 案件詳細モーダル（パンダ先生コメント、スキル表示、応募） |
| `ApplyForm` | 案件応募フォーム（ファイル添付） |
| `FreelanceWorries` | フリーランス登録（Login → RegisterModal 自動連携） |
| `Reveal` | スクロール表示アニメーション |
| `FloatingPanda` | フローティングパンダ |

### 2.4 バックエンド（WordPress Plugin）

**新規・拡張した REST API エンドポイント:**

| グループ | エンドポイント | メソッド |
|---------|--------------|---------|
| Articles | `/articles`, `/articles/{id}`, `/articles/popular`, `/articles/search` | GET, POST, PUT, DELETE |
| Modules | `/modules`, `/modules/{slug}` | GET, POST, PUT |
| Courses | `/courses`, `/courses/{id}` | GET, POST, PUT, DELETE |
| Lessons | `/lessons`, `/lessons/{id}`, `/courses/{id}/lessons` | GET, POST, PUT, DELETE |
| Knowledge | `/knowledge`, `/knowledge/{id}` | GET, POST, PUT, DELETE |
| Cases | `/cases`, `/cases/{id}`, `/cases/{id}/apply` | GET, POST（q検索対応） |
| Media | `/media/upload` | POST（管理者のみ画像アップロード） |

**カスタム投稿タイプ（全11種）:**
course, lesson, teacher, exam, knowledge, video, daily_quiz, learning_path, path_step, sap_case, member_plan

**カスタム分類（全3種）:**
sap_module, difficulty, topic

### 2.5 テストデータ

`seed-data.php` で生成:
- コース: **20件**
- ナレッジ: **20件**
- レッスン: **20コース × 20 = 最大400件**
- ナレッジ参照リンク: **10件設定**

### 2.6 ユーザーエクスペリエンス改善

- ヘッダー右上アバタークリック → ドロップダウンメニュー
- パスワード表示切替アイコン
- ログイン後自動で登録フォーム表示
- 管理画面 管理者のみアクセス制御（未ログイン/非管理者に説明表示）
- フローティングサイドバー（目次追従）
- 全局 `getBoundingClientRect()` による正しいスクロール位置検出

---

## 3. ファイル構成

```
admin-react/src/
├── components/
│   ├── admin/
│   │   └── HtmlEditor.tsx            # WYSIWYG エディター
│   ├── auth/
│   │   └── LoginModal.tsx            # ログインモーダル
│   ├── cases/
│   │   ├── CaseCard.tsx              # 案件カード
│   │   ├── CaseDetailModal.tsx       # 案件詳細モーダル
│   │   ├── CaseTicker.tsx            # 案件跑马灯
│   │   ├── CasesSection.tsx          # 案件セクション（検索/フィルター/ページネーション）
│   │   ├── ApplyForm.tsx             # 応募フォーム
│   │   ├── FreelanceWorries.tsx      # フリーランス登録
│   │   └── SkillMatchBar.tsx         # スキルマッチ
│   ├── home/
│   │   └── HeroScene.tsx             # Hero アニメーション
│   ├── layout/
│   │   ├── Header.tsx                # グローバルヘッダー
│   │   ├── HeaderDropdown.tsx        # ユーザードロップダウン
│   │   ├── Footer.tsx                # フッター
│   │   └── FloatingPanda.tsx         # フローティングパンダ
│   ├── quiz/
│   │   └── QuizCard.tsx              # クイズカード
├── pages/
│   ├── Home.tsx                      # ホーム（Hero/Modules/Paths/Articles/Quiz/Newsletter）
│   ├── Modules.tsx                   # モジュール一覧
│   ├── Category.tsx                  # モジュール詳細（記事/コース/ナレッジ）
│   ├── PathsPage.tsx                 # 学習パス一覧
│   ├── LearningPage.tsx              # 学習パス詳細
│   ├── StepPage.tsx                  # ステップ詳細
│   ├── CoursePage.tsx                # コース詳細（レッスン一覧 + ページネーション）
│   ├── LessonPage.tsx                # レッスン詳細（目次）
│   ├── KnowledgePage.tsx             # ナレッジ詳細（目次 + 参考リンク）
│   ├── QuizPage.tsx                  # クイズ
│   ├── Cases.tsx                     # 案件一覧（モーダル管理）
│   ├── Article.tsx                   # 記事詳細
│   ├── VideoPage.tsx                 # 動画
│   ├── Profile.tsx                   # プロフィール
│   ├── Login.tsx                     # ログイン
│   ├── Register.tsx                  # 登録
│   └── admin/
│       ├── AdminLayout.tsx           # 管理画面レイアウト
│       ├── AdminModules.tsx          # モジュール管理一覧
│       ├── ModuleForm.tsx            # モジュール作成/編集
│       ├── ArticlesList.tsx          # 記事管理一覧
│       ├── ArticleForm.tsx           # 記事作成/編集
│       ├── CoursesList.tsx           # コース管理一覧
│       ├── CourseForm.tsx            # コース作成/編集
│       ├── LessonsList.tsx           # レッスン管理一覧（検索/ページネーション）
│       ├── LessonForm.tsx            # レッスン作成/編集
│       ├── KnowledgeList.tsx         # ナレッジ管理一覧
│       └── KnowledgeForm.tsx         # ナレッジ作成/編集
├── services/
│   └── api.ts                        # API サービス（全CRUD）
├── hooks/
│   ├── useAuth.tsx                   # 認証フック
│   └── useTheme.tsx                  # テーマフック
├── types/
│   └── index.ts                      # 型定義 + 定数
├── styles/
│   ├── index.css                     # 公開画面スタイル
│   └── admin.css                     # 管理画面スタイル
└── test/
    ├── api.test.ts                   # API サービス単体テスト
    ├── types.test.ts                 # 型チェックテスト
    ├── theme.test.ts                 # テーマフックテスト
    └── setup.ts                      # テストセットアップ
```

```
wordpress/wp-content/plugins/sap-panda-api/
├── sap-panda-api.php                 # メインプラグインファイル
├── includes/
│   ├── class-cpt.php                 # カスタム投稿タイプ登録
│   ├── class-taxonomies.php          # カスタム分類登録
│   ├── class-taxonomy-meta.php       # 分類メタフィールド（カラー/レベル等）
│   ├── class-metabox.php             # 管理画面メタボックス
│   ├── class-rest.php                # REST API（全エンドポイント）
│   ├── class-auth.php                # JWT 認証
│   └── class-admin.php               # 管理画面
└── seed-data.php                     # テストデータ生成
```
