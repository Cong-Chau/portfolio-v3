/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://phancongchau.vercel.app", // đổi thành domain của bạn
  generateRobotsTxt: true, // tự động tạo robots.txt
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
};

module.exports = config;
