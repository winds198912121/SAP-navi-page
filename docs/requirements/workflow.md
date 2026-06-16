# SAP パンダ先生 — 工作流设计 (Workflow)

## 1. 内容生产工作流

```
① 主题规划 (PM)
   │
   ▼
② 文章撰写 (Author)
   │
   ▼
③ AI 辅助校对 (AI Tool)
   │
   ▼
④ 内容审核 (Reviewer)
   │
   ▼
⑤ 发布排期 (Editor)
   │
   ▼
⑥ 公开 (WordPress)
   │
   ▼
⑦ SEO 优化 (Yoast/Rank Math)
   │
   ▼
⑧ SNS 推广 (X/Twitter)
```

## 2. DevOps 工作流

```
① Code Push
   │
   ▼
② 自动测试 (PHPUnit / Vitest)
   │
   ▼
③ 构建 (Docker Image)
   │
   ▼
④ 部署 (Nginx + Docker)
   │
   ▼
⑤ 缓存 (WP Rocket)
   │
   ▼
⑥ 监控 (Error Log)
```

## 3. 用户运营工作流

```
用户注册
   │
   ▼
欢迎メール (Mailchimp)
   │
   ├── 浏览行为追跡
   │
   ├── 学习路径推荐
   │
   ├── 案件推荐 (基于模块偏好)
   │
   └── Newsletter (每周)
         │
         ▼
    Re-engagement (休眠用户)
```

## 4. Agent 开发工作流

```
PM Agent (需求分析)
   ↓
Architect Agent (技术架构)
   ↓
Database Agent (数据库设计)
   ↓
Backend Agent (WordPress 开发)
   ↓
Frontend Agent (React 组件)
   ↓
QA Agent (测试)
   ↓
Review Agent (代码审查)
   ↓
Deploy Agent (部署)
```

## 5. 案件匹配工作流

```
案件掲載 (Admin)
   │
   ▼
用户登録 (技能選択)
   │
   ▼
自動マッチング (Module 一致)
   │
   ▼
案件推薦 (メール / 画面)
   │
   ▼
応募 (応募フォーム)
   │
   ▼
エージェント確認
   │
   ▼
面談調整
```
