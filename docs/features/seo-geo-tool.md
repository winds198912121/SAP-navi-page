# SEO & GEO 管理ツール

> **機能ID:** F-ADM-08
> **作成日:** 2026-06-14
> **担当:** Admin Agent

---

## 1. 機能概要

管理画面で SEO（検索エンジン最適化）と GEO（生成AI最適化）の設定を一元管理します。

### SEO（Search Engine Optimization）
- サイト全体のメタ情報管理
- OGP / Twitter Card 設定
- robots.txt 編集
- Google Analytics 連携
- トラッキングキーワード管理

### GEO（Generative Engine Optimization）
- ChatGPT / Gemini / Perplexity 向け最適化
- Organization 構造化データ
- FAQPage 構造化データ
- AIフレンドリーなHTML出力設定
- SNSプロフィール連携

---

## 2. API 設計

### 2.1 SEO 設定

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wp-json/sap/v1/admin/seo-settings` | 全SEO設定を取得 |
| PUT | `/wp-json/sap/v1/admin/seo-settings` | SEO設定を保存 |
| GET | `/wp-json/sap/v1/admin/seo-keywords` | キーワード一覧 |
| POST | `/wp-json/sap/v1/admin/seo-keywords` | キーワード追加 |
| DELETE | `/wp-json/sap/v1/admin/seo-keywords` | キーワード削除 |

### 2.2 FAQ 構造化データ

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wp-json/sap/v1/admin/faq-schemas` | FAQ全件取得 |
| POST | `/wp-json/sap/v1/admin/faq-schemas` | FAQ新規追加 |
| PUT | `/wp-json/sap/v1/admin/faq-schemas/{id}` | FAQ更新 |
| DELETE | `/wp-json/sap/v1/admin/faq-schemas/{id}` | FAQ削除 |

### 2.3 SEO 設定のデータモデル

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `site_name` | string | サイト名（タイトルタグ用） |
| `site_description` | string | meta description（120-160文字推奨） |
| `default_keywords` | string | デフォルトキーワード（カンマ区切り） |
| `og_image` | string | OG画像URL |
| `twitter_handle` | string | Twitterハンドル |
| `google_analytics_id` | string | GA4測定ID |
| `robots_txt` | string | robots.txt内容 |
| `geo_enabled` | bool | GEO最適化ON/OFF |
| `organization_name` | string | 組織名 |
| `organization_logo` | string | ロゴURL |
| `organization_url` | string | 組織URL |
| `social_links` | string[] | SNSリンク一覧 |
| `ai_optimization` | bool | AIフレンドリー出力ON/OFF |
| `faq_page_url` | string | FAQページURL |

---

## 3. 管理画面UI

### アクセス
管理サイドバー → `⚙ システム管理` → `🔍 SEO/GEO`

### タブ構成

| タブ | 設定項目 |
|------|----------|
| 🔍 SEO設定 | サイト名、meta description、OG画像、GA4 ID、robots.txt |
| 🤖 GEO設定 | GEO最適化ON/OFF、組織情報、SNSリンク、AIフレンドリー出力 |
| ❓ FAQ構造化 | FAQのCRUD（FAQPage JSON-LDとして出力） |
| 🏷️ キーワード | トラッキングキーワードの管理 |

### 権限
- 管理者のみアクセス可能
- API 認証: JWT + `check_admin()`

---

## 4. フロントエンド連携

### Seo.tsx
設定値は `Seo.tsx` コンポーネントで使用されます：
- `SITE_NAME` → `settings.site_name`
- `DEFAULT_DESC` → `settings.site_description`
- `DEFAULT_KEYWORDS` → `settings.default_keywords`
- `BASE_URL` → `settings.organization_url`
- JSON-LD Organization → `settings.organization_name / logo / social_links`

### 保存先
全設定は WordPress `wp_options` テーブルに `sap_panda_seo_settings` / `sap_panda_faq_schemas` / `sap_panda_seo_keywords` として保存。

---

## 5. JSON-LD 出力イメージ

### Organization Schema（GEO設定より）
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SAP パンダ先生 NAVI",
  "url": "https://sap-panda.com",
  "logo": "https://sap-panda.com/panda-sensei.png",
  "sameAs": ["https://twitter.com/sap_panda"]
}
```

### FAQPage Schema（FAQ管理より）
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "SAPとは何ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "SAPは..."
    }
  }]
}
```

---

## 6. テスト

| テスト項目 | 方法 |
|-----------|------|
| SEO設定の保存/読込 | 管理画面で変更 → 再読込で反映確認 |
| robots.txt 書出し | robots.txt 編集 → 保存 → /robots.txt で内容確認 |
| FAQ CRUD | 追加/編集/削除 → 一覧の整合性確認 |
| GEO設定の永続化 | 設定変更 → ページリロード → 値が保持されているか |
