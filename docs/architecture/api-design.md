# SAP パンダ先生 — API 设计文档

> **文档版本：** v1.0
> **创建日期：** 2026-06-09
> **命名空间：** `/wp-json/sap/v1`

---

## 目录

1. [API 规范](#1-api-规范)
2. [认证接口](#2-认证接口)
3. [文章接口](#3-文章接口)
4. [模块接口](#4-模块接口)
5. [Quiz 接口](#5-quiz-接口)
6. [案件接口](#6-案件接口)
7. [用户接口](#7-用户接口)
8. [积分接口](#8-积分接口)
9. [接口错误码](#9-接口错误码)

---

## 1. API 规范

### 1.1 通用规则

| 项目 | 规则 |
|------|------|
| 基础 URL | `/wp-json/sap/v1` |
| 请求格式 | JSON |
| 响应格式 | JSON |
| 字符编码 | UTF-8 |
| 分页参数 | `page`, `per_page` (默认 10, 最大 100) |
| 排序参数 | `orderby`, `order` |
| 筛选参数 | `module`, `difficulty`, `topic` |

### 1.2 通用响应格式

**成功响应：**
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**错误响应：**
```json
{
  "success": false,
  "data": null,
  "message": "错误描述",
  "code": "error_code"
}
```

**分页响应：**
```json
{
  "success": true,
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "per_page": 10,
  "total_pages": 10
}
```

### 1.3 认证方式

```
Authorization: Bearer <jwt_token>
X-WP-Nonce: <wp_nonce>
```

---

## 2. 认证接口

### 2.1 用户登录

```
POST /wp-json/sap/v1/auth/login
```

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "display_name": "ユーザー名",
      "avatar_url": "https://...",
      "roles": ["subscriber"]
    }
  }
}
```

### 2.2 用户注册

```
POST /wp-json/sap/v1/auth/register
```

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "display_name": "ユーザー名"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "user_id": 2,
    "message": "注册成功"
  }
}
```

### 2.3 Token 验证

```
POST /wp-json/sap/v1/auth/validate
```

**Headers:**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user_id": 1
  }
}
```

---

## 3. 文章接口

### 3.1 获取文章列表

```
GET /wp-json/sap/v1/articles
```

**请求参数：**

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `page` | int | 1 | 页码 |
| `per_page` | int | 10 | 每页数量 |
| `module` | string | - | 筛选模块 (fi/co/mm/...) |
| `difficulty` | string | - | 筛选难度 (beginner/intermediate/advanced) |
| `topic` | string | - | 筛选主题 (basic/master/transaction/process) |
| `orderby` | string | date | 排序 (date/views/title) |
| `order` | string | desc | 排序方向 (asc/desc) |
| `search` | string | - | 搜索关键词 |

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "仕訳のしくみ",
      "slug": "journal-entry-basics",
      "excerpt": "簿記の本を読んでも頭に入らない…",
      "module": {
        "slug": "fi",
        "name": "FI · 財務会計"
      },
      "difficulty": {
        "slug": "beginner",
        "name": "初級"
      },
      "author": {
        "id": 1,
        "display_name": "パンダ先生",
        "avatar": "https://..."
      },
      "reading_time": 6,
      "views": 12438,
      "featured_image": "https://...",
      "created_at": "2026-05-19T00:00:00"
    }
  ],
  "total": 48,
  "page": 1,
  "per_page": 10
}
```

### 3.2 获取文章详情

```
GET /wp-json/sap/v1/articles/{id}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "仕訳のしくみ",
    "content": "<p>文章HTML内容...</p>",
    "blocks": [
      {
        "type": "panda_dialog",
        "data": {
          "mood": "happy",
          "text": "いい質問だね！"
        }
      },
      {
        "type": "student_dialog",
        "data": {
          "mood": "think",
          "text": "先生、借方と貸方って..."
        }
      },
      {
        "type": "callout",
        "data": {
          "type": "info",
          "title": "パンダ先生のひとくちメモ",
          "content": "借方・貸方という言葉自体には意味はありません。"
        }
      }
    ],
    "toc": [
      {"id": "s1", "label": "はじめに：仕訳って何？"},
      {"id": "s2", "label": "左右がイコール"}
    ],
    "author": {...},
    "related_articles": [...],
    "meta": {
      "views": 12438,
      "reactions": {
        "👍": 128,
        "❤": 85,
        "🎋": 64,
        "🙏": 23
      }
    }
  }
}
```

### 3.3 获取热门文章 (Top 10)

```
GET /wp-json/sap/v1/articles/popular
```

**请求参数：**

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `per_page` | int | 10 | 数量 |

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "title": "【保存版】SAP用語集 — はじめての100単語",
      "module": {...},
      "views": 24100,
      "rank": 1
    }
  ]
}
```

### 3.4 文章搜索

```
GET /wp-json/sap/v1/articles/search?q={keyword}
```

**请求参数：**

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `q` | string | - | 搜索关键词 |
| `page` | int | 1 | 页码 |
| `per_page` | int | 10 | 每页数量 |

---

## 4. 模块接口

### 4.1 获取所有模块

```
GET /wp-json/sap/v1/modules
```

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "slug": "fi",
      "name_ja": "財務会計",
      "name_en": "Financial Accounting",
      "description": "会計帳簿、決算、勘定科目。",
      "color": "#2f6d44",
      "icon": "FI",
      "article_count": 48,
      "levels": ["beginner", "intermediate", "advanced"]
    }
  ]
}
```

### 4.2 获取模块分类文章

```
GET /wp-json/sap/v1/modules/{slug}/articles
```

**请求参数同 3.1 文章列表参数。**

---

## 5. Quiz 接口

### 5.1 获取每日一题

```
GET /wp-json/sap/v1/quizzes/today
```

**响应：**
```json
{
  "success": true,
  "data": {
    "id": 318,
    "question": "次のうち、SAP FI モジュールの主要な仕訳タイプとして「ない」ものはどれ？",
    "options": [
      "SA：一般仕訳",
      "KR：仕入先請求書",
      "DR：得意先請求書",
      "XX：在庫移動仕訳"
    ],
    "explanation": "「XX」というドキュメントタイプは標準にはありません。",
    "module": "fi",
    "difficulty": "intermediate",
    "date": "2026-06-09"
  }
}
```

### 5.2 提交 Quiz 答案

```
POST /wp-json/sap/v1/quizzes/{id}/answer
```

**请求体：**
```json
{
  "answer": 3,
  "user_id": 1
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "correct": false,
    "correct_answer": 3,
    "explanation": "「XX」というドキュメントタイプは標準にはありません。",
    "streak": 7
  }
}
```

### 5.3 获取用户答题统计

```
GET /wp-json/sap/v1/quizzes/stats
```

**Headers:**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "success": true,
  "data": {
    "total_answers": 45,
    "correct_count": 32,
    "accuracy": 71.1,
    "current_streak": 7,
    "longest_streak": 12
  }
}
```

---

## 6. 案件接口

### 6.1 获取案件列表

```
GET /wp-json/sap/v1/cases
```

**请求参数：**

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `page` | int | 1 | 页码 |
| `per_page` | int | 20 | 每页数量 |
| `modules` | string | - | 筛选模块 (逗号分隔) |
| `urgent` | bool | - | 仅急募 |
| `orderby` | string | date | 排序 |

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "グローバル製造業 / S4移行に伴う FI-CO コンサル",
      "modules": ["FI", "CO"],
      "rate_min": 85,
      "rate_max": 100,
      "period": "長期（6ヶ月〜）",
      "location": "東京・大手町",
      "remote": "リモート併用",
      "experience": "5年〜",
      "seats": 1,
      "urgent": true,
      "skills_must": ["FI/CO 設計・構築経験", "決算業務の理解", "S/4HANA 案件経験"],
      "skills_want": ["英語での会議対応", "グローバルテンプレート展開経験"],
      "blurb": "大手製造業の基幹システム刷新PJ。",
      "created_at": "2026-06-08T00:00:00"
    }
  ]
}
```

### 6.2 获取案件详情

```
GET /wp-json/sap/v1/cases/{id}
```

### 6.3 投递案件

```
POST /wp-json/sap/v1/cases/{id}/apply
```

**Headers:**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "name": "山田 太郎",
  "email": "yamada@example.com",
  "phone": "090-1234-5678",
  "expected_rate": "85万円",
  "experience_years": "3",
  "skill_modules": ["FI", "CO", "MM"],
  "self_pr": "これまでのご経験...",
  "resume_url": "https://..."
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "application_id": 1,
    "message": "応募ありがとうございます！担当から1営業日以内にご連絡します。"
  }
}
```

---

## 7. 用户接口

### 7.1 获取用户信息

```
GET /wp-json/sap/v1/users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "display_name": "ユーザー名",
    "avatar_url": "https://...",
    "registered_at": "2026-05-01T00:00:00",
    "roles": ["subscriber"],
    "stats": {
      "articles_read": 23,
      "quizzes_answered": 45,
      "quiz_accuracy": 71.1,
      "points": 320,
      "streak": 7
    }
  }
}
```

### 7.2 更新用户信息

```
PUT /wp-json/sap/v1/users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "display_name": "新名称",
  "avatar_url": "https://..."
}
```

### 7.3 获取用户收藏

```
GET /wp-json/sap/v1/users/me/bookmarks
```

**Headers:**
```
Authorization: Bearer <token>
```

### 7.4 添加/删除收藏

```
POST /wp-json/sap/v1/users/me/bookmarks
DELETE /wp-json/sap/v1/users/me/bookmarks/{article_id}
```

---

## 8. 积分接口

### 8.1 获取积分明细

```
GET /wp-json/sap/v1/points
```

**Headers:**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "success": true,
  "data": {
    "total": 320,
    "history": [
      {
        "points": 10,
        "type": "daily_quiz",
        "description": "每日一题答对",
        "created_at": "2026-06-09T10:00:00"
      }
    ]
  }
}
```

### 8.2 领取每日积分

```
POST /wp-json/sap/v1/points/daily
```

---

## 9. 接口错误码

| HTTP 状态码 | 错误码 | 说明 |
|-----------|--------|------|
| 400 | `bad_request` | 请求参数错误 |
| 401 | `unauthorized` | 未认证 / Token 过期 |
| 403 | `forbidden` | 无权限操作 |
| 404 | `not_found` | 资源不存在 |
| 409 | `conflict` | 资源冲突（如重复投递） |
| 422 | `unprocessable` | 请求体验证失败 |
| 429 | `too_many_requests` | 请求频率超限 |
| 500 | `server_error` | 服务器内部错误 |

---

> **文档变更记录**
>
> | 版本 | 日期 | 变更内容 | 负责人 |
> |------|------|---------|-------|
> | v1.0 | 2026-06-09 | 初版创建 | PM |
