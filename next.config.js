/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PWA配置
  // 如果需要静态导出（用于Capacitor），取消下面的注释
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
  async headers() {
    return [
      {
        // 匹配所有 API 路由
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
}

module.exports = nextConfig

