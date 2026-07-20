# SAP Panda Academy — Deploy Packages

本目录包含部署到生产环境的软件包。

## 可用包

| 包 | 说明 | 版本 |
|----|------|------|
| [admin-react](./admin-react/) | React 管理后台前端 (SPA + SSR) | 1.0.0 |
| ~sap-panda-academy~ | _(已迁移至 deploy/packages/ 外部)_ | - |
| ~aladdin-theme~ | _(已迁移至 deploy/packages/ 外部)_ | - |

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
# 部署 admin-react
bash packages/admin-react/deploy.sh

# 部署到远程服务器
bash packages/admin-react/deploy.sh --server user@your-server.com
```
