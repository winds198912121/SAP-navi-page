# SAP パンダ先生 — 数据库设计文档

> **文档版本：** v1.0
> **创建日期：** 2026-06-09

---

## 目录

1. [ER 图概览](#1-er-图概览)
2. [WordPress 核心表](#2-wordpress-核心表)
3. [自定义内容类型](#3-自定义内容类型)
4. [自定义分类法](#4-自定义分类法)
5. [ACF 字段设计](#5-acf-字段设计)
6. [自定义表设计](#6-自定义表设计)
7. [索引设计](#7-索引设计)

---

## 1. ER 图概览

```
┌──────────────┐    ┌───────────────────┐    ┌──────────────┐
│   users      │    │   posts (文章)     │    │   terms      │
│──────────────│    │───────────────────│    │──────────────│
│ ID           │───▶│ ID                │◀───│ term_id      │
│ user_login   │    │ post_title        │    │ name         │
│ user_email   │    │ post_content      │    │ slug         │
│ display_name │    │ post_author      │    │ term_group   │
│ ...          │    │ post_date         │    └──────────────┘
└──────────────┘    │ post_type         │           │
       │            │ post_status       │           │
       │            └────────┬──────────┘           │
       │                     │                      │
       ▼                     ▼                      ▼
┌──────────────┐    ┌───────────────────┐    ┌──────────────┐
│ postmeta     │    │ term_relationships│    │ term_taxonomy │
│──────────────│    │───────────────────│    │──────────────│
│ meta_id      │    │ object_id         │    │ term_taxonomy │
│ post_id      │◀───│ term_taxonomy_id  │◀───│ term_id       │
│ meta_key     │    │ term_order        │    │ taxonomy      │
│ meta_value   │    └───────────────────┘    │ parent        │
└──────────────┘                             └──────────────┘
```

## 2. WordPress 核心表

本系统使用以下 WordPress 标准表：

| 表名 | 用途 | 主要字段 |
|------|------|---------|
| `wp_users` | 用户管理 | ID, user_login, user_email, display_name |
| `wp_usermeta` | 用户元数据 | user_id, meta_key, meta_value |
| `wp_posts` | 所有内容（文章/CPT） | ID, post_title, post_content, post_type, post_status |
| `wp_postmeta` | 内容元数据（含 ACF） | post_id, meta_key, meta_value |
| `wp_terms` | 分类项 | term_id, name, slug |
| `wp_term_taxonomy` | 分类法 | term_taxonomy_id, term_id, taxonomy |
| `wp_term_relationships` | 内容-分类关联 | object_id, term_taxonomy_id |
| `wp_options` | 系统设置 | option_name, option_value |
| `wp_comments` | 评论 | comment_post_ID, comment_content |

## 3. 自定义内容类型 (Custom Post Types)

### 3.1 CPT: `course` (课程)

**用途：** 管理 SAP 课程，按模块组织

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_title` | text | 课程标题 |
| `post_content` | longtext | 课程描述 |
| `course_module` | taxonomy | 所属模块 (FI/CO/MM...) |
| `course_difficulty` | taxonomy | 难度 (初/中/上級) |
| `course_price` | number | 价格 (会员专属) |
| `course_duration` | text | 课程时长 |
| `course_instructor` | text | 讲师 |
| `course_thumbnail` | image | 课程缩略图 |

### 3.2 CPT: `teacher` (讲师)

**用途：** 管理讲师信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_title` | text | 讲师姓名 |
| `teacher_avatar` | image | 头像 |
| `teacher_bio` | text | 简介 |
| `teacher_specialty` | text | 专长领域 |
| `teacher_social` | text | SNS 链接 |

### 3.3 CPT: `exam` (考试)

**用途：** 在线考试题库

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_title` | text | 题目 |
| `exam_type` | select | 题型 (single/multi/judge) |
| `exam_options` | repeater | 选项列表 |
| `exam_answer` | text | 正确答案 |
| `exam_explanation` | text | 解析 |
| `exam_module` | taxonomy | 关联模块 |
| `exam_difficulty` | taxonomy | 难度级别 |

### 3.4 CPT: `knowledge` (知识库)

**用途：** SAP 知识库条目

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_title` | text | 知识条目名称 |
| `post_content` | longtext | 详细内容 |
| `knowledge_module` | taxonomy | 关联模块 |
| `knowledge_tags` | taxonomy | 标签 |
| `knowledge_type` | select | 类型 (概念/T-Code/Best Practice) |

### 3.5 CPT: `news` (新闻)

**用途：** SAP 行业新闻

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_title` | text | 新闻标题 |
| `post_content` | longtext | 新闻内容 |
| `news_source` | url | 来源链接 |
| `news_date` | date | 新闻日期 |

### 3.6 CPT: `daily_quiz` (每日一题)

**用途：** 首页每日 Quiz 组件

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_title` | text | 问题 |
| `quiz_options` | repeater | 4 个选项 |
| `quiz_correct` | number | 正确答案 (0-3) |
| `quiz_explanation` | text | 解析说明 |
| `quiz_module` | taxonomy | 关联模块 |
| `quiz_difficulty` | select | 难度 |

### 3.7 CPT: `learning_path` (学习路径)

**用途：** 结构化学习路线

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_title` | text | 路径名称 |
| `path_audience` | text | 目标受众 |
| `path_description` | text | 路径描述 |
| `path_steps` | repeater | 步骤列表 (step_title, time) |
| `path_duration` | text | 总时长 |
| `path_cta_url` | url | 学习入口链接 |

### 3.8 CPT: `sap_case` (案件)

**用途：** SAP 工作机会信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_title` | text | 案件名称 |
| `case_modules` | taxonomy | 关联模块 |
| `case_rate_min` | number | 最低薪资(万円) |
| `case_rate_max` | number | 最高薪资(万円) |
| `case_period` | text | 期间 |
| `case_utilization` | text | 稼働形態 |
| `case_location` | text | 勤務地 |
| `case_remote` | text | リモート可否 |
| `case_experience` | text | 必要経験年数 |
| `case_seats` | number | 募集人数 |
| `case_urgent` | boolean | 急募フラグ |
| `case_scarce` | boolean | 残り僅かフラグ |
| `case_skills_must` | repeater | 必須スキル |
| `case_skills_want` | repeater | 歓迎スキル |
| `case_blurb` | text | 案件紹介文 |
| `case_company` | text | 企業名（任意） |

---

## 4. 自定义分类法 (Custom Taxonomies)

### 4.1 Taxonomy: `sap_module` (SAP 模块)

| 属性 | 值 |
|------|------|
| 名称 | sap_module |
| 标签 | SAP モジュール |
| 关联 CPT | post, course, exam, knowledge, sap_case |
| 层级 | 否 (flat) |

**预定义项：**

| slug | 名称 | 颜色 |
|------|------|------|
| `fi` | FI · 財務会計 | `#2f6d44` |
| `co` | CO · 管理会計 | `#2641a1` |
| `mm` | MM · 購買・在庫 | `#a25411` |
| `sd` | SD · 販売管理 | `#b62a4a` |
| `pp` | PP · 生産計画 | `#4828a8` |
| `hr` | HR · 人事管理 | `#8a6212` |
| `abap` | ABAP · 開発言語 | `#1f6f6f` |
| `basis` | Basis · 基盤管理 | `#4a432d` |
| `s4` | S/4 · S/4HANA | `#1864a3` |

### 4.2 Taxonomy: `difficulty` (难度级别)

| 属性 | 值 |
|------|------|
| 名称 | difficulty |
| 标签 | 難易度 |
| 关联 CPT | post, course, exam |
| 层级 | 否 |

**预定义项：**

| slug | 名称 | 颜色 class |
|------|------|-----------|
| `beginner` | 初級 | `l1` (绿) |
| `intermediate` | 中級 | `l2` (橙) |
| `advanced` | 上級 | `l3` (红) |

### 4.3 Taxonomy: `topic` (文章主题)

| 属性 | 值 |
|------|------|
| 名称 | topic |
| 标签 | トピック |
| 关联 CPT | post |
| 层级 | 否 |

**预定义项：**

| slug | 名称 |
|------|------|
| `basic` | 基本概念 |
| `master` | マスタ設計 |
| `transaction` | トランザクション |
| `process` | 業務プロセス |

---

## 5. ACF 字段设计

### 5.1 文章扩展字段

| 字段名 | 类型 | 位置 | 规则 |
|--------|------|------|------|
| `article_reading_time` | number | 文章编辑页 | 必填 -> min:1 |
| `article_cover_type` | select | 文章编辑页 | 默认: 'class' |
| `article_topic` | taxonomy | 文章编辑页 | 关联 topic 分类 |

### 5.2 文章特殊区块 (ACF Blocks)

#### Block: `panda-dialog` (熊猫对话框)

| 字段 | 类型 | 说明 |
|------|------|------|
| `dialog_mood` | select | happy / think / laugh / flat |
| `dialog_text` | text | 对话内容 |

#### Block: `student-dialog` (学生对话框)

| 字段 | 类型 | 说明 |
|------|------|------|
| `dialog_mood` | select | smile / think / o / surprise / flat |
| `dialog_text` | text | 对话内容 |

#### Block: `callout-box` (提示/警告框)

| 字段 | 类型 | 说明 |
|------|------|------|
| `callout_type` | select | info / warn |
| `callout_title` | text | 标题 |
| `callout_content` | text | 内容 |

#### Block: `learning-path-card` (学习路径卡片)

| 字段 | 类型 | 说明 |
|------|------|------|
| `path_audience` | text | 受众 |
| `path_title` | text | 标题 |
| `path_desc` | text | 描述 |
| `path_steps` | repeater | 步骤组 |
| `path_duration` | text | 时长 |

---

## 6. 自定义表设计

### 6.1 `wp_case_applications` (案件投递)

```sql
CREATE TABLE wp_case_applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED DEFAULT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(100) NOT NULL,
    applicant_phone VARCHAR(20) DEFAULT NULL,
    expected_rate VARCHAR(50) DEFAULT NULL,
    experience_years VARCHAR(20) DEFAULT NULL,
    skill_modules TEXT DEFAULT NULL,
    self_pr TEXT DEFAULT NULL,
    resume_file VARCHAR(255) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_case_id (case_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 6.2 `wp_quiz_attempts` (答题记录)

```sql
CREATE TABLE wp_quiz_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    quiz_id BIGINT UNSIGNED NOT NULL,
    selected_answer INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_attempted_at (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 6.3 `wp_learning_progress` (学习进度)

```sql
CREATE TABLE wp_learning_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    path_id BIGINT UNSIGNED NOT NULL,
    step_index INT NOT NULL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME DEFAULT NULL,
    UNIQUE KEY uk_user_path (user_id, path_id),
    INDEX idx_user_id (user_id),
    INDEX idx_path_id (path_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 6.4 `wp_reactions` (文章 Reaction)

```sql
CREATE TABLE wp_reactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED DEFAULT NULL,
    reaction_type VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_post_id (post_id),
    INDEX idx_reaction_type (reaction_type),
    UNIQUE KEY uk_post_user_type (post_id, user_id, reaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 6.5 `wp_user_points` (用户积分)

```sql
CREATE TABLE wp_user_points (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    points INT DEFAULT 0,
    points_type VARCHAR(50) NOT NULL,
    source_id BIGINT UNSIGNED DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_points_type (points_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 7. 索引设计

### 7.1 索引策略

| 表 | 列 | 索引类型 | 理由 |
|----|----|---------|------|
| wp_posts | post_type + post_status | 复合索引 | 内容列表查询 |
| wp_posts | post_author | 普通索引 | 作者关联查询 |
| wp_postmeta | post_id + meta_key | 复合索引 | ACF 字段查询 |
| wp_term_relationships | object_id + term_taxonomy_id | 复合索引(主键) | 分类关联查询 |
| wp_case_applications | case_id + status | 复合索引 | 案件投递状态查询 |
| wp_quiz_attempts | user_id + attempted_at | 复合索引 | 用户答题历史 |
| wp_learning_progress | user_id + path_id | 唯一索引 | 学习进度查询 |

### 7.2 查询优化建议

| 场景 | 优化策略 |
|------|---------|
| 文章列表筛选 | 使用 WP_Query + tax_query + meta_query 组合 |
| 热门文章排行 | Post Views Counter 插件 + meta_value_num 排序 |
| 案件匹配 | 先筛选 taxonomy，再按 urgency 排序 |
| 每日一题 | 按日期 offset (day mod count) 选取 |
| 用户投递历史 | 按 user_id 索引 + 分页 |

---

> **文档变更记录**
>
> | 版本 | 日期 | 变更内容 | 负责人 |
> |------|------|---------|-------|
> | v1.0 | 2026-06-09 | 初版创建 | PM |
