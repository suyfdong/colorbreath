# ColorBreath

## 项目定位
正念涂色平台，面向 25-45 岁女性。品牌调性：Calm × Aesop — 安静、高级、有温度。
域名：colorbreath.com | Tagline："Breathe. Color. Be."

## 技术栈
- Next.js 16 (App Router) + Tailwind v4 + TypeScript
- 部署：Cloudflare Pages（已上线 colorbreath.com）
- 构建：`output: 'export'` 纯静态导出，不支持 SSR/API routes/middleware
- 支付：Creem（Phase 2）
- 数据：JSON 文件驱动，无数据库
- 图片/音频：本地 `public/` 托管，零外部依赖
- 分析：Google Analytics GA4 (G-5611PQK6GF)
- SEO：Google Search Console 已验证，sitemap 已提交

## 设计原则
- **深色暖调**主题（烛光感，非科技冷感）
- 琥珀/蜂蜜色强调，4 种情绪各有主题色（Calm 淡紫 / Sleep 靛蓝 / Energy 琥珀 / Comfort 薄荷绿）
- 字体：Playfair Display（标题）、Outfit（正文）、Cormorant Garamond（引导语斜体）
- 动画节奏慢（800ms+），滚动触发渐入
- 自定义白色箭头鼠标（CSS `cursor:none` + SVG），Paint 页用原生 crosshair
- 大量留白，低内容密度

## 核心约束（不可违反）
- **无广告**，即使免费层也没有
- **无时间压力**，不加倒计时/催促元素，用户掌控节奏
- 不自建社区，引导分享到 Instagram
- 涂色线稿是白底黑线，利用深色背景的自然发光效果
- **线稿内容方向：室内温馨生活场景**（窗边、壁炉、卧室、厨房等），不做纯户外风景（草/树/岩石容易变成密集阴影线，不适合涂色）
- 线稿风格：干净轮廓线 + 大面积白色填充区，像彩色玻璃只留铅线。涂完是一幅完整的画
- 线稿生成：Replicate Flux 1.1 Pro，脚本 `scripts/generate-ai-coloring.mjs`

## 页面架构
```
/                         首页（已完成）
/today                    今日涂色推荐
/explore                  浏览所有涂色页（按情绪筛选）
/explore/[mood]           情绪 SEO 落地页（calm/sleep/energy/comfort，独立 metadata）
/explore?mood=[mood]      情绪筛选（客户端，canonical 指向 /explore）
/coloring/[slug]          涂色页详情（预览+下载+音频+引导）
/coloring/[slug]/paint    在线涂色全屏体验（Canvas）
/favorites                推荐好物（Coming Soon，待申请 Affiliate）
/about                    关于页
```

## 详细方案
见上层目录 `../plan.md` 和 `../progress.md`。
