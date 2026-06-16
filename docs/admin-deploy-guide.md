# SAP Panda Academy — WordPress 管理画面からのデプロイ手順

> **サイトURL**: `https://sap-navi.aladdin-techec.com/sap/`
> **前提**: SSH アクセス不可、WordPress 管理画面のみ権限あり
> **サーバーPHP**: 7.4.33（対応済み）

---

## 用意するファイル

ローカルの `deploy/packages/` ディレクトリに 2 つの ZIP ファイルがあります：

| ファイル | サイズ | 内容 |
|---------|--------|------|
| `sap-panda-api.zip` | 70KB | カスタム REST API + カスタム投稿タイプ + ACF ポリフィル |
| `sap-panda-theme.zip` | 2.1MB | React SPA テーマ（ビルド済み） |

---

## 手順

### Step 1 — プラグインをインストール

```
ブラウザで管理画面にアクセス
https://sap-navi.aladdin-techec.com/sap/wp-admin/

→ プラグイン
→ 新規追加
→ プラグインのアップロード
→ ファイルを選択 → sap-panda-api.zip を選択
→ 今すぐインストール
→ 有効化
```

**確認**: プラグイン一覧に「SAP Panda API」と表示され、有効化されていること。

### Step 2 — テーマをインストール

```
管理画面
→ 外観 → テーマ
→ 新規追加 → テーマのアップロード
→ ファイルを選択 → sap-panda-theme.zip を選択
→ 今すぐインストール
→ 有効化
```

**確認**: 外観 > テーマ に「SAP Panda Academy」が表示され、有効化されていること。

### Step 3 — パーマリンク設定

```
管理画面
→ 設定 → パーマリンク設定
→ 「基本」以外を選択（「投稿名」推奨）
→ 変更を保存
```

React Router のクライアントサイドルーティングを正しく動作させるために必要です。

### Step 4 — 動作確認

テーマ有効化後、以下の URL にアクセスしてください：

| 確認項目 | URL | 期待結果 |
|---------|-----|---------|
| トップページ | `https://sap-navi.aladdin-techec.com/sap/` | React SPA が表示される |
| REST API | `https://sap-navi.aladdin-techec.com/sap/wp-json/sap/v1/` | JSON が返ってくる |
| 管理画面 | `https://sap-navi.aladdin-techec.com/sap/wp-admin/` | 通常通り開く |

---

## テーマ有効化後の挙動

| アクセス先 | 動作 |
|-----------|------|
| `https://sap-navi.aladdin-techec.com/sap/` | React SPA トップページ |
| `https://sap-navi.aladdin-techec.com/sap/courses` | React ルーター → コース一覧 |
| `https://sap-navi.aladdin-techec.com/sap/about` | React ルーター → サイトについて |
| `https://sap-navi.aladdin-techec.com/sap/...` | React ルーターが処理 |
| `https://sap-navi.aladdin-techec.com/sap/wp-admin/` | WordPress 管理画面（通常通り） |
| `https://sap-navi.aladdin-techec.com/sap/wp-json/...` | REST API（通常通り） |

> ⚠️ **重要**: テーマを有効化すると、フロントエンドの**すべてのページ**が React SPA になります。WordPress の通常投稿・固定ページは SPA 側のルーティングに委ねられます。
>
> 元の WordPress サイトに戻したい場合は、管理画面から別のテーマを有効化してください（ロールバック手順参照）。

---

## ロールバック方法

```管理画面
→ 外観 → テーマ
→ Twenty Twenty-Five など別のテーマを有効化
→ SAP Panda Academy を削除（不要なら）
```

プラグインも同様：
```管理画面
→ プラグイン
→ SAP Panda API → 停止 or 削除
```

---

## 注意点

### 1. PHP 7.4 互換性 ✅

サーバーの PHP バージョンは **7.4.33** です。以下の対応済み：

| 対象 | 修正内容 |
|-----|---------|
| `functions.php` | `str_starts_with()` → `0 === strpos()`（PHP 8 非互換関数を置き換え） |
| `style.css` | `Requires PHP: 8.3` → `Requires PHP: 7.4` |

他に PHP 8 専用構文（`match`、`fn()`、名前付き引数、`?->`）は使用していないため、**問題なく動作します**。

### 2. サブディレクトリ `/sap/` 対応 ✅

WordPress が `/sap/` サブディレクトリにインストールされているため、以下を修正済み：

| 対象 | 修正内容 |
|-----|---------|
| `main.tsx` | `<BrowserRouter basename="/sap">` を追加 |
| `api.ts` | `API_BASE` を `/sap/wp-json/sap/v1` に変更 |
| 各ページ | ハードコードされた絶対パスを `/sap/` プレフィックス対応 |

### 3. JWT Secret

プラグインは JWT 認証を使用します。サーバーの `wp-config.php` に以下を設定してください：

```php
define('JWT_AUTH_SECRET_KEY', 'your-random-secret-key');
```

設定がない場合、管理画面に警告が表示されることがあります。
サーバーに SSH できない場合、ホスティング管理パネルから `wp-config.php` を編集できるか確認してください。

### 4. ファイルアップロード上限

管理画面からメディアをアップロードする際、サーバーの `upload_max_filesize` が小さい（2MB 以下）と制限に引っかかります。
ホスティング管理パネルから変更できる場合があります（64MB 推奨）。

### 5. ACF / CPT UI

- **Advanced Custom Fields (ACF)** → あれば便利（コード内で Polyfill が代替）
- **Custom Post Type UI** → あれば便利（コード内で自動登録）

---

## デプロイチェックリスト

- [ ] **Step 1**: プラグイン「SAP Panda API」を有効化 ✅
- [ ] **Step 2**: テーマ「SAP Panda Academy」を有効化 ✅
- [ ] **Step 3**: パーマリンク設定を「投稿名」に変更 ✅
- [ ] **Step 4-1**: トップページが表示される → `https://sap-navi.aladdin-techec.com/sap/`
- [ ] **Step 4-2**: REST API が応答する → `https://sap-navi.aladdin-techec.com/sap/wp-json/sap/v1/`
- [ ] **Step 4-3**: 管理画面にアクセスできる → `https://sap-navi.aladdin-techec.com/sap/wp-admin/`
- [ ] JWT Secret が設定されているか確認
- [ ] ACF Pro / CPT UI があればインストール

---

## 参考：修正したソースコードの一覧

| ファイル | 修正内容 |
|---------|---------|
| `admin-react/src/main.tsx` | `<BrowserRouter basename="/sap">` |
| `admin-react/src/services/api.ts` | `API_BASE = '/sap/wp-json/sap/v1'` |
| `admin-react/src/components/layout/Footer.tsx` | `href="/sap/#...` |
| `admin-react/src/pages/Article.tsx` | `href="/sap/"`, `href="/sap/category/..."` |
| `admin-react/src/pages/Contact.tsx` | `href="/sap/privacy"` |
| `admin-react/src/pages/Profile.tsx` | `window.location.href = '/sap/'` |
| `themes/sap-panda/functions.php` | `str_starts_with()` → `0 === strpos()` |
| `themes/sap-panda/style.css` | `Requires PHP: 7.4` |
