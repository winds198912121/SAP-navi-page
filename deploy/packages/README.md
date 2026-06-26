# SAP Panda Academy — WordPress 部署包

## 文件说明

| 文件 | 大小 | 说明 |
|------|------|------|
| `sap-panda-theme.zip` | 3.0 MB | WordPress 主题（React SPA 前端） |
| `sap-panda-api.zip` | 96 KB | WordPress 插件（REST API + 自定义文章类型） |

---

## 安装步骤

### 前提条件

- WordPress 6.0+
- PHP 7.4+（推荐 8.0+）
- MySQL 8.0+
- 已安装并启用插件：
  - Advanced Custom Fields (ACF)
  - Custom Post Type UI
  - JWT Authentication for WP REST API

### 1. 安装插件

1. WordPress 管理后台 → **插件** → **安装插件** → **上传插件**
2. 选择 `sap-panda-api.zip` → **立即安装**
3. 安装完成后点击 **启用插件**

或手动安装：
```bash
# 解压到 WordPress 插件目录
unzip sap-panda-api.zip -d /path/to/wordpress/wp-content/plugins/
```

### 2. 安装主题

1. WordPress 管理后台 → **外观** → **主题** → **安装主题** → **上传主题**
2. 选择 `sap-panda-theme.zip` → **立即安装**
3. 安装完成后点击 **启用**（SAP Panda Academy）

或手动安装：
```bash
# 解压到 WordPress 主题目录
unzip sap-panda-theme.zip -d /path/to/wordpress/wp-content/themes/
```

### 3. 配置

#### JWT 认证

在 `wp-config.php` 中添加：

```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
```

#### WordPress 地址

```php
define('WP_HOME', 'https://your-domain.com');
define('WP_SITEURL', 'https://your-domain.com');
```

### 4. 导入种子数据（可选）

插件启用后，访问以下 URL 导入示例数据：

```
https://your-domain.com/wp-admin/admin.php?page=sap-panda-seed
```

---

## URL 结构

| 路径 | 说明 |
|------|------|
| `/` | React SPA 前端 |
| `/wp-admin/` | WordPress 管理后台 |
| `/wp-json/sap/v1/` | REST API |

---

## REST API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/wp-json/sap/v1/courses` | 课程列表 |
| GET | `/wp-json/sap/v1/courses/{id}` | 课程详情 |
| GET | `/wp-json/sap/v1/teachers` | 讲师列表 |
| GET | `/wp-json/sap/v1/exams` | 考试列表 |
| GET | `/wp-json/sap/v1/topics` | 话题列表 |
| POST | `/wp-json/sap/v1/auth/login` | 用户登录 |
| GET | `/wp-json/sap/v1/user/me` | 当前用户信息 |

---

## Nginx 配置参考

部署到生产服务器时，参考以下 Nginx 配置要点：

```nginx
# React SPA 路由回退
location / {
    try_files $uri $uri/ /index.html;
}

# API 反向代理到 PHP-FPM
location /wp-json/ {
    proxy_pass http://wordpress_php;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

详细配置见 `deploy/nginx/` 目录。

---

## 目录结构（主题）

```
sap-panda/
├── assets/
│   ├── index-{hash}.js      # React 主程序
│   └── index-{hash}.css     # React 样式
├── functions.php             # 主题函数（加载 JS/CSS）
├── index.html                # SPA 入口
├── index.php                 # WordPress 模板
├── style.css                 # 主题信息
├── robots.txt                # 搜索引擎配置
└── sitemap.xml               # 站点地图
```

---

## 常见问题

**Q: 页面空白 / 404？**
- 确认主题已启用
- 检查 Nginx 配置是否有 SPA 路由回退 (`try_files $uri $uri/ /index.html;`)
- 检查浏览器控制台是否有 API 请求错误

**Q: API 返回 401？**
- JWT 密钥未配置，检查 `wp-config.php` 中 `JWT_AUTH_SECRET_KEY`
- 确认 JWT 认证插件已启用

**Q: 上传文件大小限制？**
- 在 `php.ini` 中修改：`upload_max_filesize = 64M`、`post_max_size = 128M`
