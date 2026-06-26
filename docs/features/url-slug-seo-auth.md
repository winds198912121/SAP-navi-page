# URL Slug + SEO 优化 + 未登录内容限制

> **功能 ID:** F-URL-SLUG
> **生成日期:** 2026-06-26
> **涉及 Epic:** Epic 3 (内容管理系统), Epic 8 (前端用户体验)

---

## 功能说明

### 1. Lesson/Knowledge/Note 详情页 URL 加 slug

所有内容详情页 URL 从 `/:id` 改为 `/:id/:slug` 格式：

| 页面 | 旧 URL | 新 URL |
|------|--------|--------|
| 文章 (Article) | `/article/:id/:slug` | ✅ 已实现（之前版本） |
| レッスン (Lesson) | `/lesson/:id` | `/lesson/:id/:slug` |
| ナレッジ (Knowledge) | `/knowledge/:id` | `/knowledge/:id/:slug` |
| 记事 (Note) | — (新功能) | `/note/:id/:slug` |

**向后兼容：** 旧 URL 访问时自动 301 重定向到带 slug 的新 URL。

### 2. 新建「记事」功能 (Notes)

- CPT `note` 注册（public, show_in_rest）
- REST API CRUD 端点（GET/POST/PUT/DELETE）
- 公共详情页 NotePage.tsx
- 管理后台一覧/編集/削除（NoteList.tsx, NoteForm.tsx）
- 种子数据 3 条

### 3. SEO 优化

- **JSON-LD 结构化数据** — Article schema（headline/description/datePublished/author）
- **Canonical URL** — 带 slug 的完整 URL
- **パンくずリスト** — 階層型 breadcrumb
- **OG/Twitter Card** — 由 Seo 组件统一处理
- **動的 TOC** — 从 HTML 内容自动生成目次

### 4. 未登录用户内容限制

- 未登录用户只能看到内容的前 **30%**
- 超过阈值处显示「続きを読むにはログインが必要です」壁
- ログイン/新規登録ボタン表示
- 管理员不受限制

---

## API 设计

### Lesson / Knowledge — 新增字段

`GET /sap/v1/lessons/:id` 响应新增：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "sap-accounting-basics",
    "title": "SAP 会計基礎",
    ...
  }
}
```

`GET /sap/v1/knowledge/:id` 响应新增：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "what-is-fi-module",
    "title": "FIモジュールとは",
    ...
  }
}
```

### Notes — 新增端点

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/sap/v1/notes` | 记事一覧 | Public |
| GET | `/sap/v1/notes/:id` | 记事详情（含 content） | Public |
| POST | `/sap/v1/notes` | 创建记事 | Admin |
| PUT | `/sap/v1/notes/:id` | 更新记事 | Admin |
| DELETE | `/sap/v1/notes/:id` | 删除记事 | Admin |

**GET /notes 响应示例：**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "sap-learning-roadmap",
      "title": "SAP 学習ロードマップ",
      "excerpt": "SAP学習を始める方向けのロードマップ",
      "module": {"slug": "s4", "name": "S/4HANA"},
      "difficulty": {"slug": "beginner", "name": "初級"},
      "created_at": "2026-06-26 12:00:00"
    }
  ]
}
```

**GET /notes/:id 追加字段：**
- `content` — HTML 本文
- `references` — 参考リンク配列
- `author` — 著者情報

---

## 数据模型

### note CPT 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| ID | int (WP post) | 自动 |
| title | post_title | 记事标题 |
| slug | post_name (auto) | URL 友好的标识 |
| content | post_content | HTML 正文 |
| excerpt | post_excerpt | 摘要 |
| module | taxonomy `sap_module` | 关联模块 |
| difficulty | taxonomy `difficulty` | 难度等级 |
| topic | taxonomy `topic` | 主题标签 |
| references | meta `note_references` | 参考链接 JSON |

### Lesson API 新增字段

| 字段 | 类型 | 来源 |
|------|------|------|
| slug | string | `$post->post_name` |

### Knowledge API 新增字段

| 字段 | 类型 | 来源 |
|------|------|------|
| slug | string | `$post->post_name` |

---

## 测试方案

### 后端测试

1. Lesson API — 验证 `slug` 字段存在且正确
2. Knowledge API — 验证 `slug` 字段存在且正确
3. Note CRUD — 所有端点返回正确数据
4. 未登录用户 — 内容完整返回（限制在前端）

### 前端测试

1. URL 路由 — `/lesson/:id/:slug` 正确渲染详情页
2. 旧 URL — 自动重定向到新 URL
3. 未登录 — 内容截断至 30%，显示登录提示
4. 已登录 — 完整内容显示
5. Note 管理页面 — CRUD 操作正常

### E2E 测试

1. 访问带 slug 的 URL → 页面正常渲染
2. 访问不带 slug 的旧 URL → 自动重定向
3. 未登录访问受保护内容 → 看到登录壁
4. 管理员看到完整内容

---

## 变更文件清单

### 后端 (PHP)

| 文件 | 变更类型 |
|------|---------|
| `includes/class-cpt.php` | 🆕 注册 note CPT |
| `includes/class-rest.php` | 🔄 lesson/knowledge 添加 slug |
| | 🆕 note CRUD 端点 (6个) |
| `seed-data.php` | 🆕 3条记事种子数据 |

### 前端 (TSX/TS)

| 文件 | 变更类型 |
|------|---------|
| `App.tsx` | 🔄 路由更新 + note 路由 |
| `types/index.ts` | 🔄 SapKnowledge 添加 slug |
| `services/api.ts` | 🆕 note API 方法 (5个) |
| `pages/LessonPage.tsx` | 🔄 slug URL + JSON-LD + 未登录限制 |
| `pages/KnowledgePage.tsx` | 🔄 slug URL + JSON-LD + 未登录限制 |
| `pages/NotePage.tsx` | 🆕 记事公共详情页 |
| `pages/admin/NoteList.tsx` | 🆕 记事管理一覧 |
| `pages/admin/NoteForm.tsx` | 🆕 记事作成/編集 |
| `pages/admin/AdminLayout.tsx` | 🔄 新增记事菜单 |
| `pages/Category.tsx` | 🔄 知识链接含 slug |
| `pages/CoursePage.tsx` | 🔄 レッスン链接含 slug |
| `pages/StepPage.tsx` | 🔄 知识链接含 slug |
