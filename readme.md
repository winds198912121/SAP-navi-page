# SAP パンダ先生 🐼

> **SAPの世界を、もっと身近に。**
>
> 治愈系 SAP 知识培训与求职平台

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite |
| 后端 | WordPress 6 + PHP 8.3+ |
| 数据库 | MySQL 8 |
| CMS | Kadence Theme + ACF Pro + CPT UI |
| 认证 | JWT (自定义实现) |
| 容器 | Docker + Docker Compose |
| AI | OpenAI API (规划中) |

## 项目结构

```
project/
│
├── docs/
│   ├── requirements/
│   │   ├── prd.md              # 产品需求文档
│   │   ├── usecase.md          # 用户流程图
│   │   ├── workflow.md         # 工作流设计
│   │   └── feature-list.md     # 功能清单 (64项)
│   └── architecture/
│       ├── system-design.md    # 系统架构设计
│       ├── db-design.md        # 数据库设计
│       └── api-design.md       # API 设计
│
├── admin-react/                # React 前端 SPA
│   ├── src/
│   │   ├── pages/              # 页面组件
│   │   ├── components/         # 公共组件
│   │   ├── services/           # API 服务
│   │   ├── hooks/              # 自定义 Hooks
│   │   ├── types/              # TypeScript 类型
│   │   └── styles/             # CSS 样式
│   ├── package.json
│   └── vite.config.ts
│
├── wordpress/                  # WordPress 后端
│   ├── wp-content/
│   │   ├── themes/panda-sensei-child/
│   │   └── plugins/sap-panda-api/
│   ├── docker-compose.yml
│   └── nginx/default.conf
│
├── tests/
│   ├── phpunit/
│   ├── vitest/
│   └── e2e/
│
├── deploy/
│   ├── nginx/
│   ├── ssl/
│   └── scripts/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── .claude/
    ├── agents/
    ├── commands/
    └── CLAUDE.md
```
# SAP-navi-page
