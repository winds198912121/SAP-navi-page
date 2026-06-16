# SAP Panda Academy — 完整 WBS (工作分解结构)

> **项目经理：** PM Agent
> **版本：** v1.0
> **日期：** 2026-06-09

---

## 1. WBS 概览

```
SAP Panda Academy
│
├── Epic 1  项目基础架构
├── Epic 2  用户系统
├── Epic 3  内容管理系统
├── Epic 4  学习系统
├── Epic 5  案件系统
├── Epic 6  AI 问答系统
├── Epic 7  管理后台
├── Epic 8  前端用户体验
├── Epic 9  测试与部署
│
└── 总计: 9 Epics · 29 Features · 55 Stories · 94 Tasks
```

---

## 2. 完整 WBS 表格

---

### Epic 1: 项目基础架构

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F1.1 Docker 环境 | S1.1.1 Docker Compose 配置 | T1.1.1.1 | 编写 docker-compose.yml | 创建 WordPress + MySQL + Nginx + React 的容器编排文件 | 项目目录结构文档 | docker-compose.yml | 1. `docker-compose up -d` 启动全部服务 2. 容器间网络互通 3. 数据卷持久化 | - | 2 |
| | | T1.1.1.2 | 编写 Nginx 配置 | 配置反向代理、gzip、缓存、安全头、HTTPS 支持 | docker-compose.yml | deploy/nginx/default.conf | 1. 静态资源 30d 缓存 2. gzip 压缩开启 3. XSS/CSRF 安全头 4. PHP-FPM 代理 | T1.1.1.1 | 2 |
| | | T1.1.1.3 | 编写 Dockerfile(React) | 多阶段构建 React 应用，Nginx 托管静态文件 | package.json, vite.config.ts | admin-react/Dockerfile | 1. build 阶段产出 dist/ 2. 运行时镜像 < 50MB 3. 支持环境变量注入 | - | 1.5 |
| | S1.1.2 环境变量配置 | T1.1.2.1 | 创建 .env.example 和 .env | 定义全部环境变量模板，区分开发/生产环境 | 项目配置需求文档 | .env.example, deploy/scripts/env-setup.sh | 1. 涵盖 DB/JWT/AI/缓存 全部变量 2. 生产环境密钥占位符 3. 注释完整 | - | 1 |
| F1.2 WordPress 基础 | S1.2.1 核心安装配置 | T1.2.1.1 | 编写 wp-config.php 模板 | 数据库连接、JWT 密钥、调试模式、Redis 缓存配置 | 环境变量文档 | wordpress/wp-config.php | 1. DB_HOST 使用容器服务名 2. JWT_SECRET 从环境变量读取 3. 生产禁止 Debug | T1.1.1.1 | 1.5 |
| | | T1.2.1.2 | 编写 init.sh 初始化脚本 | WP-CLI 自动化安装、激活插件、设置永久链接、创建管理员 | wp-config.php 模板 | wordpress/scripts/init.sh | 1. 自动检测是否已安装 2. 设置 /%postname%/ 永久链接 3. 安装 Kadence 主题 4. 创建示例文章 | T1.2.1.1 | 2 |
| | S1.2.2 自定义插件骨架 | T1.2.2.1 | 创建 sap-panda-api 插件主文件 | 插件头、常量定义、自动加载、钩子注册 | 无 | wordpress/wp-content/plugins/sap-panda-api/sap-panda-api.php | 1. 插件激活/停用钩子 2. PSR-4 自动加载 3. 版本常量定义 4. ABSPATH 安全检查 | - | 1.5 |
| | | T1.2.2.2 | 实现 ACF Polyfill 兼容层 | 当 ACF Pro 未安装时，用 get_post_meta 模拟 get_field | plugin 主文件 | sap-panda-api.php (polyfill 部分) | 1. get_field() 可用 2. the_field() 可用 3. 无 ACF 时不报错 | T1.2.2.1 | 2 |
| F1.3 React 基础 | S1.3.1 项目脚手架 | T1.3.1.1 | 初始化 Vite + React + TypeScript 项目 | 创建 package.json、vite.config.ts、tsconfig.json、目录结构 | 项目需求文档 | admin-react/ 完整骨架 | 1. `npm run dev` 正常启动 2. `npm run build` 成功 3. TypeScript strict 模式 4. 路径别名 @/ 配置 | - | 1.5 |
| | | T1.3.1.2 | 编写 API 代理配置 | Vite proxy 将 /wp-json 代理到 WordPress 后端 | vite.config.ts | vite.config.ts (proxy 配置) | 1. 开发环境跨域代理 2. 生产环境 Nginx 同域 | T1.3.1.1 | 0.5 |
| | | T1.3.1.3 | 创建目录结构和 Router | pages/components/services/hooks/types 目录 + React Router 路由 | 无 | src/ 目录结构 + App.tsx | 1. 路由覆盖 / /article/:slug /category/:module /admin/* 2. 404 页面 3. 懒加载 | T1.3.1.1 | 1.5 |

**Epic 1 小计：9 Tasks / 13.5h**

---

### Epic 2: 用户系统

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F2.1 JWT 认证 | S2.1.1 后端认证 | T2.1.1.1 | 实现 JWT 令牌生成 | HMAC-SHA256 签名、7天过期、payload 含 user_id | WordPress wp_salt | includes/class-auth.php (generate_token) | 1. Token 含 iss/iat/exp/data 2. 7 天有效期 3. HMAC 验证通过 | T1.2.2.1 | 2 |
| | | T2.1.1.2 | 实现 JWT 令牌验证中间件 | 从 Authorization Header 解析、验签、返回 user_id | generate_token | includes/class-auth.php (validate_token + get_user_id_from_request) | 1. Bearer 格式解析 2. 过期返回 false 3. 签名不匹配返回 false 4. 支持 Apache 环境 | T2.1.1.1 | 2 |
| | | T2.1.1.3 | 实现登录端点 | 邮箱+密码认证, 返回 token + user 信息 | validate_token | includes/class-rest.php (auth_login) | 1. 成功返回 token 和 user 2. 失败返回 401 3. 空字段返回 400 | T2.1.1.2 | 1.5 |
| | | T2.1.1.4 | 实现注册端点 | 邮箱+密码创建用户, 自动发送验证邮件 | wp_create_user | includes/class-rest.php (auth_register) | 1. 重名邮箱返回 409 2. 密码强度校验 3. 返回 user_id 4. 201 状态码 | T2.1.1.1 | 2 |
| | S2.1.2 前端认证 | T2.1.2.1 | 实现 axios 拦截器 + Token 存储 | 请求自动附加 JWT, 响应 401 自动清除 Token | class-auth.php | services/api.ts (拦截器) | 1. 请求拦截附加 Authorization 2. 响应 401 清 localStorage 3. Token 持久化 | T2.1.1.1 | 1.5 |
| | | T2.1.2.2 | 实现登录页面 | 邮箱+密码表单, Token 保存, 跳转首页 | api.ts | pages/Login.tsx | 1. 表单验证 2. 错误提示 3. 登录成功跳转 4. loading 状态 | T2.1.2.1 | 2.5 |
| | | T2.1.2.3 | 实现注册页面 | 注册表单, 验证邮件提示, 自动登录 | api.ts | pages/Register.tsx | 1. 密码确认 2. 邮箱格式验证 3. 注册成功通知 4. 错误处理 | T2.1.2.1 | 2 |
| F2.2 用户资料 | S2.2.1 后端接口 | T2.2.1.1 | 实现 GET /users/me | 返回当前用户信息, 含学习统计 | JWT 验证 | includes/class-rest.php (user_me GET) | 1. 返回 id/email/display_name/avatar 2. 返回学习统计 3. 无 Token 返回 401 | T2.1.1.3 | 1.5 |
| | | T2.2.1.2 | 实现 PUT /users/me | 更新显示名, 头像 URL | wp_update_user | includes/class-rest.php (user_me PUT) | 1. 仅可更新白名单字段 2. 更新后返回新数据 | T2.2.1.1 | 1 |
| | S2.2.2 前端页面 | T2.2.2.1 | 实现个人资料页面 | 头像, 显示名编辑, 学习统计展示 | api.getMe() | pages/Profile.tsx | 1. 显示用户信息 2. 可编辑显示名 3. 展示学习进度 4. 退出登录按钮 | T2.1.2.1 | 3 |
| F2.3 积分系统 | S2.3.1 后端 | T2.3.1.1 | 创建积分数据表 + 自定义表注册 | wp_user_points 表结构, 建表脚本 | 无 | includes/class-db.php | 1. 包含 user_id/points/type/source_id/created_at 2. 索引优化 3. 积分类型枚举 | T1.2.2.1 | 1.5 |
| | | T2.3.1.2 | 实现积分 API 端点 | GET /points, POST /points/daily 每日签到 | class-db.php | includes/class-rest.php (积分部分) | 1. 返回积分总和 2. 返回历史明细 3. 每日限领一次 4. 同一天返回 409 | T2.3.1.1 | 2 |
| | S2.3.2 前端 | T2.3.2.1 | 实现积分展示组件 | 积分总览, 积分历史列表, 每日签到按钮 | api.getPoints() | components/user/PointsCard.tsx | 1. 显示总积分 2. 积分明细列表 3. 签到按钮(已领取灰色) | T2.3.1.2 | 2 |
| F2.4 会员订阅 | S2.4.1 Stripe 集成 | T2.4.1.1 | 实现会员等级 CPT + Stripe 支付端点 | 会员方案管理, Stripe Checkout Session 创建 | Stripe API Key | includes/class-subscription.php | 1. 会员 CPT 注册 2. Stripe Webhook 处理 3. 支付成功回调 4. 会员状态更新 | T1.2.2.1 | 4 |
| | S2.4.2 前端会员 | T2.4.2.1 | 实现会员订阅页面 | 套餐对比, Stripe Checkout 跳转, 会员状态显示 | subscription API | pages/Membership.tsx | 1. 显示套餐卡片 2. 点击跳转 Stripe 3. 显示会员权益 4. 当前方案高亮 | T2.4.1.1 | 3 |

**Epic 2 小计：15 Tasks / 29h**

---

### Epic 3: 内容管理系统

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F3.1 自定义文章类型 | S3.1.1 CPT 注册 | T3.1.1.1 | 注册 course CPT | 课程类型, 支持标题/编辑器/缩略图/摘要 | CPT UI 规范 | includes/class-cpt.php (course) | 1. slug: sap/course 2. show_in_rest: true 3. 菜单图标 dashicons-welcome-learn-more 4. 支持分类法 | T1.2.2.1 | 1 |
| | | T3.1.1.2 | 注册 teacher/exam/knowledge CPT | 讲师/考试/知识库三种类型 | CPT 规范 | includes/class-cpt.php (teacher/exam/knowledge) | 1. teacher: 公开 2. exam: 后台仅 3. knowledge: 公开 + 存档 | T1.2.2.1 | 1 |
| | | T3.1.1.3 | 注册 daily_quiz/learning_path/sap_case CPT | 每日一题/学习路径/案件类型 | 数据模型文档 | includes/class-cpt.php (daily_quiz/learning_path/sap_case) | 1. daily_quiz: show_ui true 2. learning_path: 公开 3. sap_case: 后台仅 | T1.2.2.1 | 1 |
| F3.2 自定义分类法 | S3.2.1 Taxonomy 注册 | T3.2.1.1 | 注册 sap_module 分类法 | 9 大 SAP 模块, 预置种子数据 | 业务需求 | includes/class-taxonomies.php (sap_module) | 1. 9 个预置项: FI/CO/MM/SD/PP/HR/ABAP/Basis/S4 2. 关联 post/course/exam/knowledge/case | T1.2.2.1 | 1.5 |
| | | T3.2.1.2 | 注册 difficulty/topic 分类法 | 难度(初/中/上), 主题(基本/マスタ/トランザクション/業務) | 业务流程 | includes/class-taxonomies.php (difficulty/topic) | 1. difficulty: 3 级 2. topic: 4 类 3. show_admin_column true | T1.2.2.1 | 1 |
| F3.3 ACF 字段 | S3.3.1 字段组 | T3.3.1.1 | 创建文章/课程 ACF 字段组 | reading_time(数字), cover_type(选择), course_price(数字) | 数据模型 | includes/class-acf.php (文章/课程字段) | 1. 位置规则正确 2. 字段名前缀: article_/course_ 3. 默认值设置 | T1.2.2.2 | 1.5 |
| | | T3.3.1.2 | 创建 Quiz/Path/Case ACF 字段组 | quiz_options(repeater), path_steps(repeater), case 全部字段 | 数据模型文档 | includes/class-acf.php (quiz/path/case 字段) | 1. Repeater 字段 min/max 限制 2. true/false UI 开关 3. 条件逻辑 | T1.2.2.2 | 2.5 |
| | S3.3.2 ACF Blocks | T3.3.2.1 | 实现 Panda Dialog 和 Student Dialog Block | ACF Block 注册 + 渲染回调: 熊猫气泡对话 | ACF Block API | includes/class-acf.php (panda_dialog + student_dialog) | 1. mood select 控制表情 2. 渲染说话泡泡 HTML 3. 后台预览可用 | T3.3.1.1 | 2 |
| | | T3.3.2.2 | 实现 Callout Box 和 Learning Path Card Block | 提示框 + 学习路径卡片 Block | ACF Block API | includes/class-acf.php (callout_box + learning_path_card) | 1. info/warn 两种类型 2. 学习路径支持重复步骤 3. 区块图标 | T3.3.1.1 | 2 |
| F3.4 REST API | S3.4.1 文章 API | T3.4.1.1 | 实现文章列表/详情 API | GET /articles 带筛选分页, GET /articles/{id} 带浏览量 | WP_Query | includes/class-rest.php (get_articles + get_article) | 1. 支持 module/difficulty/topic 筛选 2. 分页返回 total/page/total_pages 3. 浏览量自增 4. 返回关联文章 | T3.4.1.1 | 2.5 |
| | | T3.4.1.2 | 实现热门文章/搜索 API | GET /articles/popular, GET /articles/search | 文章元数据 | includes/class-rest.php (popular + search) | 1. 热门按 views 降序 2. 搜索按 title/content 全文搜索 3. 返回格式统一 | T3.4.1.1 | 1.5 |
| | S3.4.2 模块 API | T3.4.2.1 | 实现模块列表和模块文章 API | GET /modules 返回全部模块, GET /modules/{slug}/articles | Taxonomy Query | includes/class-rest.php (modules + module_articles) | 1. 模块列表含文章数统计 2. 模块文章复用餐筛选逻辑 | T3.4.1.1 | 1.5 |

**Epic 3 小计：14 Tasks / 22h**

---

### Epic 4: 学习系统

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F4.1 每日一题 | S4.1.1 Quiz 后端 | T4.1.1.1 | 实现每日一题逻辑 | 按日期取模选取题目, 返回不含答案 | daily_quiz CPT | includes/class-rest.php (get_today_quiz) | 1. 日期取模算法 2. 不暴露 correct 字段 3. 无题目返回 404 友好提示 | T3.1.1.3 | 1.5 |
| | | T4.1.1.2 | 实现提交答案 + 记录 | POST /quizzes/{id}/answer, 记录到自定义表 | JWT, quiz_attempts 表 | includes/class-rest.php (submit_quiz_answer) | 1. 返回正误 2. 返回正确答案索引 3. 已登录记录答题历史 | T4.1.1.1 | 2 |
| | | T4.1.1.3 | 实现答题统计端点 | GET /quizzes/stats 返回总答题数/正确率/连胜 | quiz_attempts 表 | includes/class-rest.php (get_quiz_stats) | 1. 需认证 2. 返回 total/correct/accuracy 3. accuracy 四舍五入一位 | T4.1.1.2 | 1.5 |
| | S4.1.2 Quiz 前端 | T4.1.2.1 | 实现 Quiz 交互组件 | 显示问题, 点击选项, 即时反馈, 解析展示 | QUIZ_DATA | components/quiz/QuizCard.tsx | 1. 4 选项按钮 2. 选中变色(绿/红) 3. 显示熊猫解析 4. 下一题按钮 5. 键盘快捷键 1-4 | T4.1.1.1 | 3 |
| F4.2 学习路径 | S4.2.1 路径后端 | T4.2.1.1 | 实现学习路径 API | GET /learning-paths, GET /learning-paths/{id} | learning_path CPT + ACF | includes/class-rest.php (learning_paths) | 1. 返回路径列表 2. 返回路径详情含步骤 3. 关联文章数 4. 按顺序排序 | T3.1.1.3 | 1.5 |
| | S4.2.2 路径前端 | T4.2.2.1 | 实现学习路径卡片组件 | 3 列网格, 步骤列表, 进度指示, CTA 按钮 | LEARNING_PATHS 数据 | components/paths/PathCard.tsx | 1. 3 个路径卡片 2. 不同颜色区分 3. 步骤编号 4. 悬停动画 | - | 2 |
| F4.3 学习进度 | S4.3.1 进度后端 | T4.3.1.1 | 创建学习进度自定义表 | wp_learning_progress 表: user_id/path_id/step/completed | 表设计 | includes/class-db.php (learning_progress) | 1. 用户-路径唯一约束 2. completed_at 时间戳 3. 索引优化 | T1.2.2.1 | 1 |
| | S4.3.2 进度前端 | T4.3.2.1 | 实现学习进度可视化组件 | 进度百分比, 当前步骤高亮, 完成打勾 | api 进度数据 | components/paths/ProgressBar.tsx | 1. 圆形/条形进度 2. 已完成步骤绿色 3. 当前步骤蓝色 4. 动画过渡 | T4.3.1.1 | 2.5 |
| F4.4 修了证书 | S4.4.1 证书生成 | T4.4.1.1 | 实现 PDF 证书生成 | 路径完成后生成 PDF, 含姓名/路径名/日期/熊猫图章 | TCPDF/FPDF | includes/class-certificate.php | 1. A4 纵向排版 2. 路径完成验证 3. 含水印和唯一编号 4. 中文/日文支持 | T4.3.1.1 | 4 |

**Epic 4 小计：9 Tasks / 19h**

---

### Epic 5: 案件系统

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F5.1 案件管理 | S5.1.1 案件后端 | T5.1.1.1 | 实现案件列表/详情 API | GET /cases 支持模块筛选/紧急筛选, GET /cases/{id} | sap_case CPT + ACF | includes/class-rest.php (get_cases + get_case) | 1. 支持 modules 逗号分隔筛选 2. urgent 布尔筛选 3. 按日期降序 4. 返回格式完整 | T3.1.1.3 | 2 |
| | | T5.1.1.2 | 实现案件投递 API | POST /cases/{id}/apply, 含文件上传, 写入 case_applications 表 | JWT, FormData | includes/class-rest.php (apply_case) | 1. 需认证 2. 存储姓名/邮箱/电话/简历 3. 必填字段验证 4. 返回投递 ID | T5.1.1.1 | 2.5 |
| | S5.1.2 案件前端 | T5.1.2.1 | 实现案件跑马灯组件 | 横滚动显示最新案件, 悬停暂停 | CASE_DATA | components/cases/CaseTicker.tsx | 1. 无限滚动动画 2. 鼠标悬停暂停 3. 紧急标签彩色 4. 点击跳转 | - | 2.5 |
| | | T5.1.2.2 | 实现案件卡片网格组件 | 2 列卡片, 模块标签/薪资/期間/勤務地/技能 | CaseCard | components/cases/CaseCard.tsx | 1. 模块颜色标签 2. 高单价值徽章 3. 急募/残仅标识 4. 悬停阴影 5. 点击打开详情 | T5.1.1.1 | 2.5 |
| | | T5.1.2.3 | 实现案件详情模态框 | 模态框展示所有字段, 熊猫先生推荐语 | CaseCard data | components/cases/CaseDetailModal.tsx | 1. 动画进入 2. 技能标签 3. 熊猫推荐语 4. 应募/返回按钮 | T5.1.2.2 | 2 |
| | | T5.1.2.4 | 实现案件投递表单 | 响应式表单含技能选择/简历上传/同意条款 | CaseDetailModal | components/cases/ApplyForm.tsx | 1. 两列布局 2. 模块技能多选 3. 文件上传(拖拽) 4. 同意复选框 5. 提交成功页 | T5.1.1.2 | 3 |
| F5.2 技能匹配 | S5.2.1 匹配逻辑 | T5.2.1.1 | 实现模块技能匹配筛选 | 用户点击模块, 自动筛选匹配案件, 匹配优先排序 | CASE_DATA | components/cases/SkillMatchBar.tsx | 1. 9 个模块按钮 2. 多选 3. 匹配数实时更新 4. 匹配案件置顶 | T5.1.2.2 | 1.5 |

**Epic 5 小计：7 Tasks / 15.5h**

---

### Epic 6: AI 问答系统

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F6.1 AI 基础 | S6.1.1 OpenAI 集成 | T6.1.1.1 | 实现 OpenAI API 调用封装 | GPT-4o 调用, 流式输出, 错误重试, Token 计数 | OpenAI API Key | includes/class-ai.php | 1. 支持流式 SSE 2. 超时 30s 处理 3. 重试 3 次 4. Token 用量追踪 | T1.2.2.1 | 3 |
| | | T6.1.1.2 | 实现 AI 问答 REST 端点 | POST /ai/ask, 接收问题, 流式返回 SSE 流 | class-ai.php | includes/class-rest.php (ai_ask) | 1. 需认证(会员) 2. 上下文关联 3. 流式响应 4. 问题长度限制 | T6.1.1.1 | 2.5 |
| | S6.1.2 前端 AI 助手 | T6.1.2.1 | 实现 AI 问答聊天组件 | 聊天界面, 消息气泡, 流式打字效果, 历史记录 | AI API | components/ai/ChatPanel.tsx | 1. 消息列表 2. 输入框+发送 3. 打字机逐字效果 4. 聊天历史 5. 清空对话 | T6.1.1.2 | 4 |
| F6.2 SAP 知识 | S6.2.1 事务码查询 | T6.2.1.1 | 实现事务码查询功能 | 输入 t-code, 返回事务码说明/模块/事务码类型 | knowledge CPT | includes/class-ai.php (tcode_lookup) | 1. 精确匹配 2. 模糊搜索 3. 返回事务码详情 4. 关联课程链接 | T6.1.1.1 | 2 |
| | S6.2.2 RAG 知识库 | T6.2.2.1 | 实现向量数据库集成 | 文章向量化, Pinecone/Qdrant 存储, 语义检索 | OpenAI Embeddings API | includes/class-rag.php | 1. 文章分块 2. Embedding 生成 3. 相似度检索 4. 上下文填充 | T6.1.1.1 | 4 |

**Epic 6 小计：5 Tasks / 15.5h**

---

### Epic 7: 管理后台

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F7.1 仪表盘 | S7.1.1 统计概览 | T7.1.1.1 | 实现管理后台布局 | 侧边栏导航, 顶部栏, 内容区域, 响应式 | Ant Design/自定义 | admin-react/src/admin/Layout.tsx | 1. 折叠侧边栏 2. 面包屑 3. 用户头像菜单 4. 适配移动端 | T1.3.1.3 | 3 |
| | | T7.1.1.2 | 实现统计概览页面 | 文章数/用户数/案件数/积分的总览卡片和图 | REST API | admin-react/src/admin/Dashboard.tsx | 1. 4 个统计卡片 2. 折线图(近 7 天) 3. 热门文章排行 4. 最近注册用户 | T7.1.1.1 | 3 |
| F7.2 内容管理 | S7.2.1 文章管理 | T7.2.1.1 | 实现文章列表管理页 | 文章表格, 筛选/搜索/排序/批量操作, 快速编辑 | REST API | admin-react/src/admin/ArticlesList.tsx | 1. 分页表格 2. 按模块/难度筛选 3. 搜索 4. 批量删除 5. 状态切换 | T7.1.1.1 | 3 |
| | | T7.2.1.2 | 实现文章编辑页面 | Gutenberg iframe 嵌入/自定义编辑器, ACF 字段编辑 | REST API | admin-react/src/admin/ArticleEdit.tsx | 1. 标题编辑 2. 分类选择 3. ACF 字段表单 4. 保存/发布按钮 | T7.2.1.1 | 4 |
| | S7.2.2 案件管理 | T7.2.2.1 | 实现案件管理页面 | 案件 CRUD, 投递状态管理, 一键标记急募 | REST API | admin-react/src/admin/CasesManager.tsx | 1. 案件列表 2. 投递记录查看 3. 紧急标记 4. 状态变更 | T7.1.1.1 | 3 |
| F7.3 用户管理 | S7.3.1 用户管理 | T7.3.1.1 | 实现用户管理页面 | 用户列表, 角色筛选, 积分手动调整 | REST API | admin-react/src/admin/UsersManager.tsx | 1. 用户表格 2. 角色筛选 3. 积分调整表单 4. 禁用账号 5. 搜索 | T7.1.1.1 | 3 |

**Epic 7 小计：6 Tasks / 19h**

---

### Epic 8: 前端用户体验

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F8.1 首页 | S8.1.1 首页渲染 | T8.1.1.1 | 实现 Header 组件 | Sticky, 导航链接, 搜索框, 注册 CTA, 移动端汉堡菜单 | NAV_LINKS | components/layout/Header.tsx | 1. 滚动 backdrop-filter 2. 当前页高亮 3. 搜索框 ⌘K 4. 移动端 汉堡菜单 | - | 2.5 |
| | | T8.1.1.2 | 实现 Hero 区域组件 | 标题文案, CTA 双按钮, 统计数据, 熊猫场景 SVG | 无 | components/home/Hero.tsx | 1. 响应式布局 2. 熊猫 SVG 动画 3. 浮动标签 4. 统计数字 | - | 3 |
| | | T8.1.1.3 | 实现模块 9 卡片网格 | 3x3 网格, 模块颜色编码, 难度标签, 悬停动画 | SAP_MODULES | components/home/ModulesGrid.tsx | 1. 9 个模块 2. 不同颜色 3. 难度标签 4. 悬停上抬 4px 5. 文章计数 | - | 2.5 |
| | | T8.1.1.4 | 实现文章列表 + TOP10 区域 | 左侧文章行, 右侧排行榜, 排序 | ARTICLE_DATA, TOP10 | components/home/ArticlesSection.tsx | 1. 文章缩略图 2. 模块标签彩色 3. 阅读时长 4. TOP10 渐变序号 5. 查看更多 | F8.1.1.1 | 2.5 |
| | S8.1.2 首页区块 | T8.1.2.1 | 实现 YouTube 视频区域 | 暗色背景, 视频卡片 2x2, 频道统计 | 视频数据 | components/home/YouTubeSection.tsx | 1. 暗色渐变背景 2. 播放按钮 3. 频道统计 4. 登録 CTA | - | 2 |
| | | T8.1.2.2 | 实现 Newsletter 订阅区域 | 熊猫头像, 文案, 邮件输入框+提交按钮 | 无 | components/home/NewsletterSection.tsx | 1. 三栏布局 2. 邮件验证 3. 提交成功提示 | - | 1.5 |
| | | T8.1.2.3 | 实现 Footer 组件 | 4 列网格: 品牌/模块/コンテンツ/About | - | components/layout/Footer.tsx | 1. 4 列响应式 2. SNS 图标 3. 版权信息 4. 深色背景 | - | 1.5 |
| | | T8.1.2.4 | 实现 Reveal 滚动动画组件 | IntersectionObserver, fade-in + translateY | 无 | components/ui/Reveal.tsx | 1. 可见时触发 2. 可配置延迟 3. 优雅退场 4. 兼容性回退 | - | 1 |
| F8.2 文章详情 | S8.2.1 文章页 | T8.2.1.1 | 实现文章详情页面 | Hero, 面包屑, 元数据, 内容, Reaction, 相关文章 | ARTICLE_DATA | pages/Article.tsx | 1. 封面图 2. 作者行 3. 目录高亮 4. 对话框 5. Callout 6. Reaction 按钮 | - | 3 |
| | | T8.2.1.2 | 实现 Sticky TOC 侧边栏 | 自动提取 h2/h3, 滚动高亮, 平滑跳转 | 文章内容 | components/article/TableOfContents.tsx | 1. 自动目录 2. 当前章节高亮 3. 点击平滑滚动 4. 移动端隐藏 | T8.2.1.1 | 2 |
| | | T8.2.1.3 | 实现 Related Articles 组件 | 按同模块推荐 4 篇, 卡片样式 | 文章数据 | components/article/RelatedArticles.tsx | 1. 同模块推荐 2. 4 卡片 3. 缩略图+标签 4. 阅读时长 | T8.2.1.1 | 1.5 |
| F8.3 模块分类 | S8.3.1 分类页 | T8.3.1.1 | 实现分类页面 | Hero, 筛选器, 卡片网格, 排序, 分页 | CATEGORY_DATA | pages/Category.tsx | 1. 模块 Hero 2. 侧边栏筛选 3. 2 列卡片 4. 3 种排序 5. 分页按钮 | - | 3 |
| | | T8.3.1.2 | 实现分类筛选器组件 | 难度/主题筛选项, 计数, 活性状态 | - | components/category/FilterSidebar.tsx | 1. 难度筛选 2. 主题筛选 3. 学习路径推荐 4. Sticky 定位 | T8.3.1.1 | 2 |
| F8.4 体验增强 | S8.4.1 主题系统 | T8.4.1.1 | 实现 3 套配色主题系统 | 竹林/温暖/清新, CSS 变量切换, localStorage 持久 | 配色方案 | src/hooks/useTheme.ts + CSS | 1. 切换仅变 CSS 变量 2. localStorage 持久 3. 无闪烁 4. 默认竹林 | - | 2.5 |
| | | T8.4.1.2 | 实现 Tweaks 控制面板 | 主题切换, 字号滑块, 动画强度, 浮动熊猫开关 | useTheme | components/ui/TweaksPanel.tsx | 1. 主题 3 选 1 2. 字号 0.85-1.25 3. 动画 off/light/medium 4. 浮动熊猫 toggle | T8.4.1.1 | 2 |
| | S8.4.2 熊猫动画 | T8.4.2.1 | 实现熊猫 SVG 动画系统 | 眨眼/耳朵摇动/浮动/挥手, 纯 CSS @keyframes | SVG 设计 | src/styles/index.css (动画部分) | 1. 眨眼 4s 周期 2. 耳朵摇动 6s 3. 浮动 5s 4. transform-only 5. prefers-reduced-motion | - | 2.5 |
| | | T8.4.2.2 | 实现浮动熊猫助手 | 右下角浮窗, 点击展开气泡, 关键词标签 | Panda SVG | components/layout/FloatingPanda.tsx | 1. 固定定位 2. 悬停放大 3. 气泡关键词 4. 消息提示点 | T8.4.2.1 | 1.5 |
| | S8.4.3 响应式 | T8.4.3.1 | 实现全部组件的移动端适配 | 4 断点, 导航折叠, 卡片单列, 隐藏次要元素 | CSS 媒体查询 | src/styles/index.css (响应式部分) | 1. ≤639 单列 2. 640-1023 2 列 3. 导航自动折叠 4. 表格滚动 | T8.1 ~ T8.3 全部 | 3 |

**Epic 8 小计：17 Tasks / 36h**

---

### Epic 9: 测试与部署

| Feature | Story | Task ID | Task Name | Description | Input | Output | Acceptance Criteria | Dependency | 工时(h) |
|---------|-------|---------|-----------|-------------|-------|--------|-------------------|------------|---------|
| F9.1 单元测试 | S9.1.1 后端 | T9.1.1.1 | 编写 CPT/Taxonomy 注册测试 | 验证 8 个 CPT 和 3 个 Taxonomy 注册成功 | PHPUnit | tests/phpunit/test-cpt.php + test-taxonomies.php | 1. post_type_exists 断言 2. taxonomy_exists 断言 3. 种子数据验证 | T3.1.1.3, T3.2.1.2 | 1.5 |
| | | T9.1.1.2 | 编写 JWT 认证测试 | 登录/注册/验证/过期 全路径覆盖 | PHPUnit | tests/phpunit/test-auth.php | 1. 有效凭据返回 token 2. 无效凭据 401 3. 重复注册 409 4. Token 验证通过 | T2.1.1.3, T2.1.1.4 | 2 |
| | | T9.1.1.3 | 编写 REST API 集成测试 | 文章/模块/案件/Quiz 14 个端点覆盖 | PHPUnit | tests/phpunit/test-rest.php | 1. 路由注册验证 2. 返回格式验证 3. 404 处理 4. 搜索功能 5. 筛选参数 | T3.4.1.2, T3.4.2.1 | 3 |
| | S9.1.2 前端 | T9.1.2.1 | 编写数据模型测试 | SAP_MODULES/LEARNING_PATHS/QUIZ_DATA 结构验证 | Vitest | src/test/types.test.ts | 1. 模块 9 个 2. 路径 3 条 3. Quiz 选项 4 个 | - | 0.5 |
| | | T9.1.2.2 | 编写 API 服务测试 | 方法清单, Token 管理, 登录, 登出 | Vitest | src/test/api.test.ts | 1. 全部方法存在 2. 登录保存 token 3. 登出清除 4. 拦截器生效 | T2.1.2.1 | 1 |
| | | T9.1.2.3 | 编写 Theme Hook 测试 | 默认值/切换/持久化/更新 | Vitest | src/test/theme.test.ts | 1. 默认 bamboo 2. 切换更新 DOM 3. localStorage 同步 4. 多属性独立 | T8.4.1.1 | 1 |
| F9.2 E2E 测试 | S9.2.1 Playwright | T9.2.1.1 | 编写首页 E2E 测试 | 导航/模块网格/学习路径/Quiz/响应式 | Playwright | tests/e2e/homepage.spec.ts | 1. Header 可见 2. 9 个模块 3. 滚动可见 4. 移动端导航隐藏 | T8.1.1.4, T8.1.2.3 | 2 |
| | | T9.2.1.2 | 编写文章/分类 E2E 测试 | 文章 TOC, 分类筛选, 分页 | Playwright | tests/e2e/content.spec.ts | 1. 文章渲染 2. TOC 可见 3. 分类筛选 4. 排序切换 | T8.2.1.1, T8.3.1.1 | 2 |
| F9.3 部署 | S9.3.1 CI/CD | T9.3.1.1 | 编写 GitHub Actions CI 配置 | Push/PR 触发: 前端构建+测试, 后端测试 | .github 文档 | .github/workflows/ci.yml | 1. frontend job 2. backend job 3. lint job 4. 并行执行 | T9.1.1.3, T9.1.2.3 | 1.5 |
| | | T9.3.1.2 | 编写部署脚本 | 生产环境 docker-compose, SSL 证书, 备份策略 | docker-compose.yml | deploy/scripts/deploy.sh | 1. 零停机部署 2. 数据库自动备份 3. SSL 自动续签 4. 回滚支持 | T1.1.1.2 | 2.5 |
| | S9.3.2 性能优化 | T9.3.2.1 | 实现缓存策略 | WP Rocket 配置, Redis 对象缓存, 浏览器缓存头 | WP Rocket | deploy/scripts/cache-setup.sh | 1. 页面静态化 2. Redis 缓存 3. 过期时间配置 4. 缓存消除 | T1.1.1.2 | 2 |
| | | T9.3.2.2 | 实现 Lighthouse 优化 | WebP, 懒加载, CSS 合并, JS 异步, 字体优化 | WebPageTest | 优化报告 | 1. LCP < 2.5s 2. FCP < 1.5s 3. Lighthouse > 90 | T9.3.2.1 | 2.5 |

**Epic 9 小计：12 Tasks / 21.5h**

---

## 3. 工作量汇总

| Epic | Features | Stories | Tasks | 预估工时(h) | 占比 |
|------|:--------:|:-------:|:-----:|:-----------:|:----:|
| **Epic 1** 项目基础架构 | 3 | 4 | 9 | 13.5 | 7.3% |
| **Epic 2** 用户系统 | 4 | 8 | 15 | 29.0 | 15.7% |
| **Epic 3** 内容管理系统 | 4 | 8 | 14 | 22.0 | 11.9% |
| **Epic 4** 学习系统 | 4 | 6 | 9 | 19.0 | 10.3% |
| **Epic 5** 案件系统 | 2 | 4 | 7 | 15.5 | 8.4% |
| **Epic 6** AI 问答系统 | 2 | 4 | 5 | 15.5 | 8.4% |
| **Epic 7** 管理后台 | 3 | 4 | 6 | 19.0 | 10.3% |
| **Epic 8** 前端用户体验 | 4 | 11 | 17 | 36.0 | 19.5% |
| **Epic 9** 测试与部署 | 3 | 6 | 12 | 21.5 | 11.6% |
| **合计** | **29** | **55** | **94** | **185h** | **100%** |

---

## 4. 关键指标

| 指标 | 数值 |
|------|:----:|
| **Epics** | 9 |
| **Features** | 29 |
| **Stories** | 55 |
| **Tasks** | **94** |
| **单 Task 最大工时** | 4h (符合要求) |
| **单 Task 最大代码量** | ≤ 300 行 (符合要求) |
| **总预估工时** | **185 人时** |
| **单人开发** | **~23 工作日 (约 5 周)** |
| **2 人团队** | **~12 工作日 (约 2.5 周)** |

---

## 5. 关键路径

```
T1.1.1.1 Docker → T1.2.1.1 wp-config → T1.2.1.2 Init 脚本
                              ↓
T1.2.2.1 插件骨架 → T2.1.1.1 JWT 生成 → T2.1.1.3 登录端点
         ↓                    ↓
    T3.1.1.1~3 CPT       T2.1.2.1 前端拦截器 → 全部前端
         ↓
    T3.2.1.1~2 Taxonomy
         ↓
    T3.4.1.1 API → 全部前端页面依赖
```

> **关键路径长度：** T1.1.1.1 → T3.4.1.1 → T8.1... = **约 40h (5 天)**

---

## 6. Sprint 建议

```
Sprint 1 (Week 1-2):  Epic 1 + Epic 2 + Epic 3  → 基础设施 + 内容系统 (64.5h)
Sprint 2 (Week 3):    Epic 4 + Epic 8 (部分)     → 学习系统 + 首页 (55h)
Sprint 3 (Week 4):    Epic 5 + Epic 8 (剩余)     → 案件系统 + 文章/分类页 (51.5h)
Sprint 4 (Week 5):    Epic 6 + Epic 7 + Epic 9   → AI + 后台 + 测试 (56h)
```

---

## 7. 风险说明

| 风险 | 影响范围 | 缓解措施 |
|------|----------|---------|
| ACF Pro 未安装 | T3.3.1.1 ~ T3.3.2.2 | ✅ 已实现 Polyfill 兼容层 |
| OpenAI API Key 未配置 | T6.1.1.1 ~ T6.2.2.1 | 降级为固定问答库 / 本地模型 |
| Kadence 主题版本兼容 | T8.1.1.1, T8.1.1.4 | CSS 变量隔离 + 子主题保护 |
| Docker 环境缺失 | T1.1.1.1 ~ T1.1.1.3 | 已使用 brew 本地方案替代运行 |
