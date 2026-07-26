/** @type {import('next').NextConfig} */

// BUILD_MODE 环境变量控制构建模式：
//   'standalone'（默认）— output: 'standalone'，用于 SSR Node.js 独立服务
//   'export'            — output: 'export'，用于静态导出 → WordPress 模板
const buildMode = process.env.BUILD_MODE || 'standalone';
const isExport = buildMode === 'export';

const nextConfig = {
  output: isExport ? 'export' : 'standalone',
  // 静态导出时不需要 distDir 以外的特殊设置
  images: {
    unoptimized: isExport,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || '/wp-json/sap/v1',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  ...(isExport
    ? {}
    : {
        // standalone 模式才启用 rewrites（代理 WordPress API）
        async rewrites() {
          return [
            {
              source: '/wp-json/:path*',
              destination: `${process.env.NEXT_PUBLIC_WP_URL || 'http://localhost'}/wp-json/:path*`,
            },
          ];
        },
      }),
};

module.exports = nextConfig;
