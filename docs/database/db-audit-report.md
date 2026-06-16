# 数据库审核报告

> **生成日期：** 2026-06-14
> **数据库：** MySQL 8 (InnoDB)
> **表前缀：** `wp_`

---

## 一、总览

| 项目 | 数值 |
|------|:----:|
| **总表数** | 17 |
| **WordPress 原生表** | 12 (✅) |
| **自定义表** | 5 (🔴) |
| **总数据量** | ~432 KB |
| **总索引量** | ~464 KB |
| **主要数据表** | `wp_posts` 2294 行 / `wp_postmeta` 5850 行 |

---

## 二、完整表清单

| # | 表名 | 类型 | 记录数 | 数据(KB) | 索引(KB) | 用途 |
|:--:|------|:----:|:------:|:--------:|:--------:|------|
| 1 | `wp_posts` | ✅ 原生 | 2,294 | 3,584 | 1,968 | 文章/CPT/页面/附件 |
| 2 | `wp_postmeta` | ✅ 原生 | 5,850 | 432 | 464 | 自定义字段 / ACF |
| 3 | `wp_options` | ✅ 原生 | 163 | 2,112 | 32 | 站点/插件配置 |
| 4 | `wp_term_relationships` | ✅ 原生 | 1,325 | 80 | 48 | 内容-分类关联 |
| 5 | `wp_usermeta` | ✅ 原生 | 94 | 16 | 32 | 用户元数据 |
| 6 | `wp_termmeta` | ✅ 原生 | 54 | 16 | 32 | 分类法元数据 |
| 7 | `wp_quiz_attempts` | 🔴 **自定义** | 31 | 16 | 32 | 答题记录 |
| 8 | `wp_terms` | ✅ 原生 | 18 | 16 | 32 | 分类术语 |
| 9 | `wp_term_taxonomy` | ✅ 原生 | 18 | 16 | 32 | 分类法定义 |
| 10 | `wp_users` | ✅ 原生 | 5 | 16 | 48 | 用户账号 |
| 11 | `wp_case_applications` | 🔴 **自定义** | 5 | 16 | 32 | 案件投递 |
| 12 | `wp_user_points` | 🔴 **自定义** | 3 | 16 | 32 | 用户积分 |
| 13 | `wp_comments` | ✅ 原生 | 1 | 16 | 80 | 评论 |
| 14 | `wp_commentmeta` | ✅ 原生 | 0 | 16 | 32 | 评论元数据 |
| 15 | `wp_links` | ✅ 原生 | 0 | 16 | 16 | 链接管理(旧) |
| 16 | `wp_learning_progress` | 🔴 **自定义** | 0 | 16 | 16 | 学习进度 |
| 17 | `wp_reactions` | 🔴 **自定义** | 0 | 16 | 32 | 文章Reaction |

---

## 三、WordPress 原生表（12 张 ✅）

### ✅ `wp_posts` — 核心内容表
| 字段 | 类型 | 说明 |
|------|------|------|
| ID | bigint(20) unsigned | 主键 |
| post_author | bigint(20) unsigned | 作者 |
| post_date / post_date_gmt | datetime | 时间 |
| post_content | longtext | 正文 |
| post_title | text | 标题 |
| post_status | varchar(20) | publish/draft/trash |
| post_type | varchar(20) | **post / page / attachment / course / knowledge / daily_quiz / sap_case / video / learning_path / lesson / contact_inquiry 等** |
| post_name | varchar(200) | URL slug |

**记录：** 2,294 行 · **数据：** 3,584 KB（最大表）

### ✅ `wp_postmeta` — 自定义字段表
| 字段 | 类型 | 说明 |
|------|------|------|
| meta_id | bigint(20) unsigned | 主键 |
| post_id | bigint(20) unsigned | 关联文章 |
| meta_key | varchar(255) | 字段名 |
| meta_value | longtext | 字段值 |

**记录：** 5,850 行 · **数据：** 432 KB  
**存储内容：** 所有 ACF 字段值 + 文章/课程/案件 自定义元数据

### ✅ `wp_options` — 配置表
| 字段 | 类型 | 说明 |
|------|------|------|
| option_id | bigint(20) unsigned | 主键 |
| option_name | varchar(191) | 键名 |
| option_value | longtext | 键值 |

**记录：** 163 行 · **数据：** 2,112 KB  
**自定义配置项：** `sap_panda_seo_settings`, `sap_panda_faq_schemas`, `sap_panda_seo_keywords` 等

### ✅ `wp_terms` · `wp_term_taxonomy` · `wp_term_relationships` — 分类系统
- 3 个自定义分类法：`sap_module` (9项), `difficulty` (3项), `topic` (4项)
- 2 个默认分类法：`category`, `post_tag`

### ✅ `wp_users` · `wp_usermeta` — 用户系统
- 5 个用户，94 条元数据

### ✅ `wp_comments` · `wp_commentmeta` — 评论
- 1 条评论（测试数据）

### ✅ `wp_links` — 链接（废弃功能）
- 0 条数据

---

## 四、自定义表（5 张 🔴）

### 🔴 `wp_quiz_attempts` — 答题记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint unsigned PK | 主键 |
| user_id | bigint unsigned | 用户 (INDEX) |
| quiz_id | bigint unsigned | 题目 (INDEX) |
| selected_answer | int | 选择的选项 |
| is_correct | boolean | 是否正确 |
| attempted_at | datetime | 答题时间 |

**记录：** 31 · **来源：** `sap_panda_create_tables()`

---

### 🔴 `wp_case_applications` — 案件投递

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint unsigned PK | 主键 |
| case_id | bigint unsigned INDEX | 案件 |
| user_id | bigint unsigned INDEX | 用户(可空) |
| applicant_name/email/phone | varchar | 联系方式 |
| expected_rate / experience_years | varchar | 薪资/经验 |
| skill_modules / self_pr / resume_file | text | 技能/PR/简历 |
| status | varchar(20) DEFAULT 'pending' | 状态 |
| created_at / updated_at | datetime | 时间戳 |

**记录：** 5 · **来源：** `sap_panda_create_tables()`

---

### 🔴 `wp_user_points` — 积分系统

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint unsigned PK | 主键 |
| user_id | bigint unsigned INDEX | 用户 |
| points | int DEFAULT 0 | 积分值 |
| points_type | varchar(50) INDEX | 类型(daily_login/quiz/read_article) |
| source_id | bigint unsigned | 来源ID |
| description | varchar(255) | 说明 |
| created_at | datetime | 时间 |

**记录：** 3 · **来源：** `sap_panda_create_tables()`

---

### 🔴 `wp_reactions` — 文章 Reaction

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint unsigned PK | 主键 |
| post_id | bigint unsigned INDEX | 文章 |
| user_id | bigint unsigned | 用户(可空) |
| reaction_type | varchar(10) | 👍❤🎋🙏 |
| created_at | datetime | 时间 |
| **UNIQUE KEY** | (post_id, user_id, reaction_type) | 防止重复 |

**记录：** 0 · **来源：** `sap_panda_create_tables()`

---

### 🔴 `wp_learning_progress` — 学习进度

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint unsigned PK | 主键 |
| user_id | bigint unsigned | 用户 |
| path_id | bigint unsigned | 路径 |
| step_index | int DEFAULT 0 | 当前步骤|
| completed | boolean DEFAULT FALSE | 完成 |
| started_at / completed_at | datetime | 时间 |
| **UNIQUE KEY** | (user_id, path_id) | 每人每路径一条 |

**记录：** 0 · **来源：** `sap_panda_create_tables()`

---

## 五、自定义表创建来源

所有 5 张自定义表都在插件的主文件中统一创建：

```
sap-panda-api.php → sap_panda_create_tables()
```

创建时机：**插件激活时** (`register_activation_hook`)

---

## 六、数据体积分析

```
wp_posts          ██████████████████████ 3,584 KB (57.4%)
wp_options        ████████████           2,112 KB (33.8%)
wp_postmeta       ██▌                      432 KB  (6.9%)
wp_term_relationships ▍                     80 KB  (1.3%)
残り 13 表        ▏                        136 KB  (0.6%)
──────────────────────────────────────────────────────
总量                     6,248 KB (~6.1 MB)
```

---

## 七、总结

| 表名 | 类型 | 数据量 | 活跃度 | 是否需要维护 |
|------|:----:|:------:|:------:|:----------:|
| wp_case_applications | 🔴 自定义 | 小 | 🟡 中 | 定期清理旧申请 |
| wp_learning_progress | 🔴 自定义 | 无 | 🟢 低 | 暂无数据 |
| wp_quiz_attempts | 🔴 自定义 | 中 | 🟡 中 | 保留学习记录 |
| wp_reactions | 🔴 自定义 | 无 | 🟢 低 | 暂无数据 |
| wp_user_points | 🔴 自定义 | 小 | 🟢 低 | 积分系统 |
| 其余 12 表 | ✅ 原生 | — | — | WordPress 标准维护 |
