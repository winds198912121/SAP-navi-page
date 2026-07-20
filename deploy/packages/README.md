# SAP Panda Academy — Deploy Packages

本目录包含部署到生产环境的软件包。

## 可用包

| 包 | 说明 | 版本 | 大小 |
|----|------|------|------|
| [admin-react](./admin-react/) | React 管理后台前端 (SPA + SSR) | 1.0.0 | - |
| [sap-panda-theme.zip](./sap-panda-theme.zip) | WordPress 管理 SPA 主题（React 构建产物） | 1.0.0 | 1.7 MB |
| [sap-panda-api.zip](./sap-panda-api.zip) | WordPress REST API 插件 | 1.0.0 | 153 KB |

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
# 1. 安装插件
WordPress 管理画面 → プラグイン → 新規追加 → プラグインのアップロード
  → sap-panda-api.zip をアップロード → 有効化

# 2. 有効化テーマ
WordPress 管理画面 → 外観 → テーマ → SAP Panda Academy を有効化

# 3. React 管理画面をビルド
#    テーマ内 assets/ はビルド済み。再ビルドする場合:
cd admin-react
npm ci
npm run build
cp -R dist/client/assets/* ../wordpress/wp-content/themes/sap-panda/assets/

# 4. 管理画面にアクセス
https://your-site.com/wp-admin/
```
