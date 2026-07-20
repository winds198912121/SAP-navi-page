# SAP Panda Academy — Deploy Packages

本目录包含部署到生产环境的软件包。

## 可用包

| 包 | 说明 | 版本 |
|----|------|------|
| [admin-react](./admin-react/) | React 管理后台前端 (SPA + SSR) | 1.0.0 |
| [react_next-ssr](./react_next-ssr/) | Next.js SSR 版前端 | 1.0.0 |
| [sap-panda-theme.zip](./sap-panda-theme.zip) | WordPress 管理 SPA 主题（React 构建产物） | 1.0.0 |
| [sap-panda-api.zip](./sap-panda-api.zip) | WordPress REST API 插件 | 1.0.0 |

## 包结构约定

```
packages/<name>/
├── README.md            # 部署文档
├── deploy.sh            # 部署脚本
├── nginx.conf.example   # Nginx 配置示例
├── .env.example         # 环境变量模板
└── releases/            # 构建产物 (gitignored)
```

## 快速开始

```bash
# 构建 Next.js SSR 并打包
bash packages/react_next-ssr/deploy.sh

# Docker 部署
bash packages/react_next-ssr/deploy.sh --docker

# 远程部署
bash packages/react_next-ssr/deploy.sh --server user@your-server.com

# 构建 admin-react 并打包
bash packages/admin-react/deploy.sh
```
