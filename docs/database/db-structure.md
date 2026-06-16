# SAP Panda Academy — 数据库表结构

> **生成日期：** 2026-06-13  
> **数据库：** MySQL 8  
> **表前缀：** `wp_`（可配置）  
> **说明：** ✅ = WordPress 默认表 | 🔴 = 自定义表（非 WordPress 标准）

---

## 一、表清单总览

| # | 表名 | 类型 | 用途 | 数据量 (估算) |
|:--:|------|:----:|------|:------------:|
| 1 | `wp_posts` | ✅ 默认 | 所有内容（文章/CPT/页面/附件） | 核心表 |
| 2 | `wp_postmeta` | ✅ 默认 | 文章自定义字段 / ACF 字段值 | 核心表 |
| 3 | `wp_terms` | ✅ 默认 | 分类术语 | 核心表 |
| 4 | `wp_term_taxonomy` | ✅ 默认 | 分类法定义 | 核心表 |
| 5 | `wp_term_relationships` | ✅ 默认 | 文章-分类关联 | 核心表 |
| 6 | `wp_termmeta` | ✅ 默认 | 分类法元数据 | 核心表 |
| 7 | `wp_users` | ✅ 默认 | 用户账号 | 核心表 |
| 8 | `wp_usermeta` | ✅ 默认 | 用户自定义字段 | 核心表 |
| 9 | `wp_options` | ✅ 默认 | 站点设置 / 插件配置 | 核心表 |
| 10 | `wp_comments` | ✅ 默认 | 文章评论 | 核心表 |
| 11 | `wp_commentmeta` | ✅ 默认 | 评论元数据 | 核心表 |
| 12 | `wp_links` | ✅ 默认 | 链接管理（旧功能） | 少量 |
| — | **以下为自定义表** | | | |
| 13 | `wp_user_points` | 🔴 **自定义** | 用户积分系统 | 动态 |
| 14 | `wp_quiz_attempts` | 🔴 **自定义** | 答题记录 | 动态 |
| 15 | `wp_case_applications` | 🔴 **自定义** | 案件投递 | 动态 |
| 16 | `wp_reactions` | 🔴 **自定义** | 文章 Reaction | 动态 |
| 17 | `wp_learning_progress` | 🔴 **自定义** | 学习进度 | 动态 |

---

## 二、WordPress 默认表（✅）

### 2.1 `wp_posts` — 文章/内容主表

| 字段 | 类型 | 说明 |
|------|------|------|
| `ID` | bigint(20) unsigned | 主键 |
| `post_author` | bigint(20) unsigned | 作者 ID → `wp_users.ID` |
| `post_date` | datetime | 创建时间 |
| `post_date_gmt` | datetime | GMT 创建时间 |
| `post_content` | longtext | 正文内容 |
| `post_title` | text | 标题 |
| `post_excerpt` | text | 摘要 |
| `post_status` | varchar(20) | `publish`/`draft`/`pending`/`private`/`trash` |
| `comment_status` | varchar(20) | `open`/`closed` |
| `ping_status` | varchar(20) | `open`/`closed` |
| `post_password` | varchar(255) | 文章密码 |
| `post_name` | varchar(200) | slug (URL 友好名) |
| `to_ping` | text | Ping 地址 |
| `pinged` | text | 已 Ping |
| `post_modified` | datetime | 修改时间 |
| `post_modified_gmt` | datetime | GMT 修改时间 |
| `post_content_filtered` | longtext | 过滤后内容 |
| `post_parent` | bigint(20) unsigned | 父级 ID |
| `guid` | varchar(255) | 全局唯一标识 |
| `menu_order` | int(11) | 排序 |
| `post_type` | varchar(20) | **✅ post / page / attachment / revision / nav_menu_item**<br>**🔴 course / teacher / exam / knowledge / daily_quiz / learning_path / path_step / lesson / sap_case / video / member_plan** |
| `post_mime_type` | varchar(100) | MIME 类型（附件） |
| `comment_count` | bigint(20) | 评论数 |

### 2.2 `wp_postmeta` — 文章自定义字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `meta_id` | bigint(20) unsigned | 主键 |
| `post_id` | bigint(20) unsigned | FK → `wp_posts.ID` |
| `meta_key` | varchar(255) | 字段名（索引） |
| `meta_value` | longtext | 字段值 |

**该表存储所有 ACF 字段值和自定义 meta**，包括文章阅读时间、课程价格、案件字段等（详见第六节）。

### 2.3 `wp_terms` — 分类术语

| 字段 | 类型 | 说明 |
|------|------|------|
| `term_id` | bigint(20) unsigned | 主键 |
| `name` | varchar(200) | 术语名称 |
| `slug` | varchar(200) | 术语 slug |
| `term_group` | bigint(10) | 分组 |

### 2.4 `wp_term_taxonomy` — 分类法定义

| 字段 | 类型 | 说明 |
|------|------|------|
| `term_taxonomy_id` | bigint(20) unsigned | 主键 |
| `term_id` | bigint(20) unsigned | FK → `wp_terms.term_id` |
| `taxonomy` | varchar(32) | **✅ category / post_tag / nav_menu / post_format**<br>**🔴 sap_module / difficulty / topic** |
| `description` | longtext | 描述 |
| `parent` | bigint(20) unsigned | 父级 |
| `count` | bigint(20) | 计数 |

### 2.5 `wp_term_relationships` — 文章-分类关联

| 字段 | 类型 | 说明 |
|------|------|------|
| `object_id` | bigint(20) unsigned | FK → `wp_posts.ID` |
| `term_taxonomy_id` | bigint(20) unsigned | FK → `wp_term_taxonomy.term_taxonomy_id` |
| `term_order` | int(11) | 排序 |

### 2.6 `wp_termmeta` — 分类元数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `meta_id` | bigint(20) unsigned | 主键 |
| `term_id` | bigint(20) unsigned | FK → `wp_terms.term_id` |
| `meta_key` | varchar(255) | 字段名 |
| `meta_value` | longtext | 字段值 |

### 2.7 `wp_users` — 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| `ID` | bigint(20) unsigned | 主键 |
| `user_login` | varchar(60) | 登录名 |
| `user_pass` | varchar(255) | 密码哈希 |
| `user_nicename` | varchar(50) | 友好名 |
| `user_email` | varchar(100) | 邮箱 |
| `user_url` | varchar(100) | 网址 |
| `user_registered` | datetime | 注册时间 |
| `user_activation_key` | varchar(255) | 激活密钥 |
| `user_status` | int(11) | 状态 |
| `display_name` | varchar(250) | 显示名 |

### 2.8 `wp_usermeta` — 用户元数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `umeta_id` | bigint(20) unsigned | 主键 |
| `user_id` | bigint(20) unsigned | FK → `wp_users.ID` |
| `meta_key` | varchar(255) | 字段名 |
| `meta_value` | longtext | 字段值 |

### 2.9 `wp_options` — 站点设置

| 字段 | 类型 | 说明 |
|------|------|------|
| `option_id` | bigint(20) unsigned | 主键 |
| `option_name` | varchar(191) | 键名（唯一索引） |
| `option_value` | longtext | 键值 |
| `autoload` | varchar(20) | `yes`/`no` |

### 2.10 `wp_comments` — 评论表

| 字段 | 类型 | 说明 |
|------|------|------|
| `comment_ID` | bigint(20) unsigned | 主键 |
| `comment_post_ID` | bigint(20) unsigned | FK → `wp_posts.ID` |
| `comment_author` | tinytext | 作者 |
| `comment_author_email` | varchar(100) | 邮箱 |
| `comment_author_url` | varchar(200) | 网址 |
| `comment_author_IP` | varchar(100) | IP 地址 |
| `comment_date` | datetime | 时间 |
| `comment_date_gmt` | datetime | GMT 时间 |
| `comment_content` | text | 内容 |
| `comment_karma` | int(11) | Karma |
| `comment_approved` | varchar(20) | `1`/`0`/`spam`/`trash` |
| `comment_agent` | varchar(255) | 用户代理 |
| `comment_type` | varchar(20) | 类型 |
| `comment_parent` | bigint(20) unsigned | 父评论 |
| `user_id` | bigint(20) unsigned | FK → `wp_users.ID` |

### 2.11 `wp_commentmeta` — 评论元数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `meta_id` | bigint(20) unsigned | 主键 |
| `comment_id` | bigint(20) unsigned | FK → `wp_comments.comment_ID` |
| `meta_key` | varchar(255) | 字段名 |
| `meta_value` | longtext | 字段值 |

### 2.12 `wp_links` — 链接管理

| 字段 | 类型 | 说明 |
|------|------|------|
| `link_id` | bigint(20) unsigned | 主键 |
| `link_url` | varchar(255) | URL |
| `link_name` | varchar(255) | 名称 |
| `link_image` | varchar(255) | 图片 |
| `link_target` | varchar(25) | 目标 |
| ... | ... | (其余标准字段) |

---

## 三、自定义表（🔴 非 WordPress 标准）

### 3.1 `wp_user_points` — 用户积分

**来源：** `sap-panda-api.php` → `sap_panda_create_tables()`

| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| `id` | bigint(20) unsigned | PK AUTO_INCREMENT | 主键 |
| `user_id` | bigint(20) unsigned | INDEX, NOT NULL | 用户 ID |
| `points` | int(11) | DEFAULT 0 | 积分值 |
| `points_type` | varchar(50) | INDEX, NOT NULL | 积分类型（枚举：`daily_login` / `quiz` / `read_article` / ...） |
| `source_id` | bigint(20) unsigned | DEFAULT NULL | 来源 ID（如文章 ID、Quiz ID） |
| `description` | varchar(255) | DEFAULT NULL | 积分说明 |
| `created_at` | datetime | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：** `idx_user_id` (`user_id`), `idx_points_type` (`points_type`)

---

### 3.2 `wp_quiz_attempts` — 答题记录

**来源：** `sap-panda-api.php` → `sap_panda_create_tables()`

| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| `id` | bigint(20) unsigned | PK AUTO_INCREMENT | 主键 |
| `user_id` | bigint(20) unsigned | INDEX, NOT NULL | 用户 ID |
| `quiz_id` | bigint(20) unsigned | INDEX, NOT NULL | 题目 ID |
| `selected_answer` | int(11) | NOT NULL | 选择的选项索引 (0-3) |
| `is_correct` | boolean | NOT NULL | 是否正确 |
| `attempted_at` | datetime | DEFAULT CURRENT_TIMESTAMP | 答题时间 |

**索引：** `idx_user_id` (`user_id`), `idx_quiz_id` (`quiz_id`)

---

### 3.3 `wp_case_applications` — 案件投递

**来源：** `sap-panda-api.php` → `sap_panda_create_tables()`

| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| `id` | bigint(20) unsigned | PK AUTO_INCREMENT | 主键 |
| `case_id` | bigint(20) unsigned | INDEX, NOT NULL | 案件 ID |
| `user_id` | bigint(20) unsigned | INDEX, DEFAULT NULL | 用户 ID（未登录可 NULL） |
| `applicant_name` | varchar(100) | NOT NULL | 申请人姓名 |
| `applicant_email` | varchar(100) | NOT NULL | 申请人邮箱 |
| `applicant_phone` | varchar(20) | DEFAULT NULL | 电话 |
| `expected_rate` | varchar(50) | DEFAULT NULL | 希望单价 |
| `experience_years` | varchar(20) | DEFAULT NULL | 经验年数 |
| `skill_modules` | text | DEFAULT NULL | 技能模块（逗号分隔） |
| `self_pr` | text | DEFAULT NULL | 自我 PR |
| `resume_file` | varchar(255) | DEFAULT NULL | 简历文件路径 |
| `status` | varchar(20) | DEFAULT 'pending' | 状态：`pending` / `reviewed` / `accepted` / `rejected` |
| `created_at` | datetime | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | datetime | ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：** `idx_case_id` (`case_id`), `idx_user_id` (`user_id`)

---

### 3.4 `wp_reactions` — 文章 Reaction

**来源：** `sap-panda-api.php` → `sap_panda_create_tables()`

| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| `id` | bigint(20) unsigned | PK AUTO_INCREMENT | 主键 |
| `post_id` | bigint(20) unsigned | INDEX, NOT NULL | 文章 ID |
| `user_id` | bigint(20) unsigned | DEFAULT NULL | 用户 ID |
| `reaction_type` | varchar(10) | NOT NULL | Reaction 类型：👍 / ❤ / 🎋 / 🙏 |
| `created_at` | datetime | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：** `idx_post_id` (`post_id`)  
**唯一约束：** `uk_post_user_type` (`post_id`, `user_id`, `reaction_type`)

---

### 3.5 `wp_learning_progress` — 学习进度

**来源：** `sap-panda-api.php` → `sap_panda_create_tables()`

| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| `id` | bigint(20) unsigned | PK AUTO_INCREMENT | 主键 |
| `user_id` | bigint(20) unsigned | NOT NULL | 用户 ID |
| `path_id` | bigint(20) unsigned | NOT NULL | 学习路径 ID |
| `step_index` | int(11) | DEFAULT 0 | 当前步骤索引 |
| `completed` | boolean | DEFAULT FALSE | 是否完成 |
| `started_at` | datetime | DEFAULT CURRENT_TIMESTAMP | 开始时间 |
| `completed_at` | datetime | DEFAULT NULL | 完成时间 |

**唯一约束：** `uk_user_path` (`user_id`, `path_id`)

---

## 四、Custom Post Types（🔴 存储在 `wp_posts.post_type`）

以下 11 个 CPT 的数据全部存储在 `wp_posts`、`wp_postmeta`、`wp_term_relationships` 三张表中，通过 `post_type` 字段区分：

| # | post_type | 标签 | 公开 | REST | 支持 | Slug |
|:--:|-----------|------|:----:|:----:|------|------|
| 1 | `post` | ✅ 默认文章 | ✅ | ✅ | title/editor/thumbnail/excerpt | `/%postname%/` |
| 2 | `course` | 🔴 コース | ✅ | ✅ | title/editor/thumbnail/excerpt | `sap/course` |
| 3 | `teacher` | 🔴 講師 | ✅ | ✅ | title/editor/thumbnail | `sap/teacher` |
| 4 | `exam` | 🔴 試験 | ❌ | ✅ | title | `sap/exam` |
| 5 | `knowledge` | 🔴 ナレッジ | ✅ | ✅ | title/editor | `sap/knowledge` |
| 6 | `daily_quiz` | 🔴 每日一问 | ❌ | ✅ | title | `sap/daily-quiz` |
| 7 | `video` | 🔴 動画 | ✅ | ✅ | title/editor/thumbnail/excerpt | `sap/video` |
| 8 | `learning_path` | 🔴 学習パス | ✅ | ✅ | title/editor | `sap/learning-path` |
| 9 | `path_step` | 🔴 学習ステップ | ✅ | ✅ | title/editor/thumbnail/excerpt | `sap/step` |
| 10 | `lesson` | 🔴 レッスン | ✅ | ✅ | title/editor/thumbnail/excerpt | `sap/lesson` |
| 11 | `sap_case` | 🔴 案件 | ❌ | ✅ | title/editor | `sap/case` |
| 12 | `member_plan` | 🔴 会員プラン | ❌ | ✅ | title/editor | `sap/member-plan` |

**CPT 关联的自定义 meta 字段（存储在 `wp_postmeta`）：**

| post_type | meta_key | 类型 | 说明 |
|-----------|----------|:----:|------|
| `course` | `course_price` | number | 价格（0=免费） |
| `course` | `course_duration` | string | 时长 |
| `course` | `course_instructor` | string | 讲师 |
| `knowledge` | `knowledge_type` | string | 类型：`tcode`/`concept`/`best_practice`/`glossary` |
| `knowledge` | `knowledge_references` | string | 参考链接 |
| `lesson` | `lesson_course_id` | string | 所属课程 ID |
| `lesson` | `lesson_order` | string | 排序 |
| `lesson` | `lesson_time` | string | 时长 |
| `video` | `video_youtube_id` | string | YouTube ID |
| `video` | `video_duration` | string | 时长 |
| `video` | `video_views` | string | 播放量 |
| `video` | `video_thumbnail` | string | 缩略图 |
| `sap_case` | `case_rate_min` | string | 最低单价 |
| `sap_case` | `case_rate_max` | string | 最高单价 |
| `sap_case` | `case_period` | string | 合同期 |
| `sap_case` | `case_utilization` | string | 稼働率 |
| `sap_case` | `case_location` | string | 工作地点 |
| `sap_case` | `case_remote` | string | 远程可/否 |
| `sap_case` | `case_experience` | string | 经验要求 |
| `sap_case` | `case_seats` | string | 招聘人数 |
| `sap_case` | `case_urgent` | string | 紧急标志 |
| `sap_case` | `case_scarce` | string | 名额少标志 |
| `sap_case` | `case_blurb` | string | 介绍文 |
| `sap_case` | `case_company` | string | 公司名 |

---

## 五、分类法（🔴 存储在 `wp_term_taxonomy.taxonomy`）

| # | taxonomy | 关联 CPT | 术语数 | 术语列表 |
|:--:|----------|----------|:------:|----------|
| 1 | `sap_module` | post, course, exam, knowledge, sap_case, video, path_step | 9 | FI · 財務会計, CO · 管理会計, MM · 購買・在庫, SD · 販売管理, PP · 生産計画, HR · 人事管理, ABAP · 開発言語, Basis · 基盤管理, S/4 · S/4HANA |
| 2 | `difficulty` | post, course, exam | 3 | 初級 (beginner), 中級 (intermediate), 上級 (advanced) |
| 3 | `topic` | post | 4 | 基本概念 (basic), マスタ設計 (master), トランザクション (transaction), 業務プロセス (process) |
| 4 | ✅ `category` | post (默认) | — | WordPress 默认分类 |
| 5 | ✅ `post_tag` | post (默认) | — | WordPress 默认标签 |

---

## 六、ACF 字段组（存储在 `wp_postmeta`）

所有 ACF 字段值存储在 `wp_postmeta` 表中，`meta_key` 为字段的 `name`。

### 6.1 文章（post）

| meta_key | 类型 | 说明 |
|----------|:----:|------|
| `article_reading_time` | number | 阅读时间（分），默认 5 |
| `article_cover_type` | select | 封面类型：class / blackboard / learning / highfive |
| `article_featured_image` | (缩略图) | 特色图片（WP 原生 `_thumbnail_id`） |

### 6.2 每日一题（daily_quiz）

| meta_key | 类型 | 说明 |
|----------|:----:|------|
| `quiz_options` | repeater | 4 个选项：`option_text`（文本）+ `is_correct`（布尔） |
| `quiz_explanation` | textarea | 题目解析 |
| `quiz_difficulty` | text | 难度（通过代码设置） |
| `quiz_date` | text | 出题日期 |

### 6.3 学习路径（learning_path）

| meta_key | 类型 | 说明 |
|----------|:----:|------|
| `path_audience` | text | 目标人群 |
| `path_description` | textarea | 路径描述 |
| `path_steps` | repeater | 步骤列表：`step_title`（标题）+ `step_time`（时间） |
| `path_duration` | text | 总时长 |
| `path_accent` | text | 主题色（通过代码设置） |

### 6.4 案件（sap_case）

| meta_key | 类型 | 说明 |
|----------|:----:|------|
| `case_rate_min` | number | 最低单价（万円） |
| `case_rate_max` | number | 最高单价（万円） |
| `case_period` | text | 合同期限 |
| `case_location` | text | 工作地点 |
| `case_remote` | text | 远程 |
| `case_experience` | text | 经验要求 |
| `case_seats` | number | 人数 |
| `case_urgent` | true_false | 紧急标志 |
| `case_scarce` | true_false | 名额少标志 |
| `case_skills_must` | repeater | 必须技能：`skill` |
| `case_skills_want` | repeater | 欢迎技能：`skill` |
| `case_blurb` | textarea | 案件介绍 |
| `case_company` | text | 公司名（通过代码设置） |

### 6.5 会员计划（member_plan）

| meta_key | 类型 | 说明 |
|----------|:----:|------|
| `plan_price` | number | 价格（円） |
| `plan_interval` | select | 月额 / 年额 |
| `plan_features` | repeater | 特典列表：`feature` |
| `plan_popular` | true_false | 推荐标识 |

---

## 七、Entity-Relationship 概览

```
wp_users
  ├── wp_usermeta          (user_id → ID)
  ├── wp_posts             (post_author → ID)
  ├── wp_user_points       (user_id → ID)          🔴
  ├── wp_quiz_attempts     (user_id → ID)          🔴
  ├── wp_case_applications (user_id → ID)          🔴
  ├── wp_reactions         (user_id → ID)          🔴
  └── wp_learning_progress (user_id → ID)          🔴

wp_posts (含所有 CPT)
  ├── wp_postmeta          (post_id → ID)
  ├── wp_term_relationships (object_id → ID)
  │     └── wp_term_taxonomy (term_taxonomy_id)
  │           └── wp_terms (term_id)
  ├── wp_comments          (comment_post_ID → ID)
  ├── wp_reactions         (post_id → ID)          🔴
  ├── wp_quiz_attempts     (quiz_id → ID)          🔴
  └── wp_case_applications (case_id → ID)          🔴

wp_term_taxonomy
  └── wp_termmeta          (term_id → term_id)
```

---

## 八、图例

| 标记 | 含义 |
|:----:|------|
| ✅ | WordPress 核心表——安装时自动创建 |
| 🔴 | 自定义表——由 `sap-panda-api` 插件创建（非 WordPress 标准） |
| PK | 主键 |
| FK | 外键（逻辑关联，部分可能无物理约束） |
| INDEX | 索引 |
| UNIQUE | 唯一约束 |

---

> **文档版本：** v1.0  
> **生成方式：** 从代码定义重构（数据库未运行，基于 `sap-panda-api.php` / `class-cpt.php` / `class-taxonomies.php` / `class-acf.php` 反向生成）  
> **⚠️ 注意：** 实际表结构以 MySQL 建表结果为准，以上是根据代码推导的结构
