# ColorBreath

## 项目定位
正念涂色平台，面向 25-45 岁女性。品牌调性：Calm × Aesop — 安静、高级、有温度。
域名：colorbreath.com | Tagline："Breathe. Color. Be."

## 技术栈
- Next.js 16 (App Router) + Tailwind v4 + TypeScript
- 部署：Cloudflare Pages
- 支付：Creem（Phase 2）
- 数据：JSON 文件驱动，无数据库
- 图片/音频：CDN 托管，构建时离线生成

## 设计原则
- **深色暖调**主题（烛光感，非科技冷感）
- 琥珀/蜂蜜色强调，4 种情绪各有主题色（Calm 淡紫 / Sleep 靛蓝 / Energy 琥珀 / Comfort 薄荷绿）
- 字体：Playfair Display（标题）、Outfit（正文）、Cormorant Garamond（引导语斜体）
- 动画节奏慢（800ms+），滚动触发渐入
- 自定义花朵鼠标 + 手电筒光圈效果
- 大量留白，低内容密度

## 核心约束（不可违反）
- **无广告**，即使免费层也没有
- **无时间压力**，不加倒计时/催促元素，用户掌控节奏
- 不自建社区，引导分享到 Instagram
- 涂色线稿是白底黑线，利用深色背景的自然发光效果

## 页面架构
```
/                         首页（已完成）
/today                    今日涂色推荐
/explore                  浏览所有涂色页（按情绪筛选）
/explore?mood=[mood]      情绪筛选
/coloring/[slug]          涂色页详情（预览+下载+音频+引导）
/coloring/[slug]/paint    在线涂色全屏体验（Canvas）
/favorites                推荐好物（Affiliate）
/about                    关于页
```

## 详细方案
见上层目录 `../plan.md` 和 `../progress.md`。
