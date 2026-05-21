# 付费系统恢复操作手册

本文档用于在收款问题解决后，快速恢复 Stripe 付费系统。

## 当前状态

- 免费模式当前开启：
  - `.env.production`: `NEXT_PUBLIC_ALL_FEATURES_FREE=true`
  - `.env.development`: `NEXT_PUBLIC_ALL_FEATURES_FREE=true`
- 付费系统代码没有删除，只是被全局免费开关隐藏或禁用。
- Stripe checkout、客户门户、webhook、订阅状态、定价页、Premium UI 都保留在代码中。
- 免费期间注册的早期用户通过 `pcc_users.is_early_user` 持久化标记，未来恢复付费后仍可永久免费。

## 5 分钟恢复步骤

1. 确认 Stripe 配置已经准备好：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - 月付和年付 Stripe Price ID
   - Stripe 生产 webhook endpoint 已注册

2. 修改两个环境文件：

   ```env
   NEXT_PUBLIC_ALL_FEATURES_FREE=false
   ```

   需要修改：
   - `.env.production`
   - `.env.development`

3. 重新生成静态 delivery 页面：

   ```bash
   npm run localize:delivery
   ```

   这一步不能省。当前生产可见的 `delivery` 静态页会把免费开关写入 HTML 和 JavaScript，如果不重新生成，页面仍会隐藏付费入口。

4. 构建并验证：

   ```bash
   npm run build
   npm run quality:gate
   npm run test:subscription
   ```

5. 手动检查付费恢复效果：

   - `/pricing` 正常打开，不再跳转首页。
   - `/premium` 正常打开，不再跳转首页。
   - `/checkout` 不再因为免费模式返回 403。
   - 未登录用户点击购买时会先要求登录。
   - 已登录普通用户可以进入 Stripe checkout。
   - 早期用户仍显示 Premium 权限，不需要付款。

6. 提交并推送：

   ```bash
   git add .env.production .env.development delivery public next-sitemap.config.js next.config.ts
   git commit -m "Restore paid system"
   git push origin localization-formatting-b
   ```

7. Vercel 自动部署完成后：

   - 在 Google Search Console 重新提交 `https://aipregnancycaloriecalculator.online/sitemap.xml`。
   - 检查 sitemap 中是否恢复了需要被索引的付费页面。
   - 给所有早期用户发送邮件，告知他们已获得永久免费 Premium 权限。

## 早期用户邮件模板

主题：你的 AI Pregnancy Calorie Calculator Premium 权限已永久免费

你好，

感谢你在 AI Pregnancy Calorie Calculator 全功能免费期间支持我们。

我们现在已经恢复 Premium 付费计划，但你的账号已被标记为早期支持用户。因此，你将永久保留 Premium 权限，无需订阅或付款。

你可以继续免费使用计算器、饮食计划、每周报告、进度追踪和营养问答功能。

再次感谢你的早期支持。

AI Pregnancy Calorie Calculator

## 回滚步骤

如果恢复付费后出现 checkout、登录、路由或订阅问题：

1. 把两个环境文件改回：

   ```env
   NEXT_PUBLIC_ALL_FEATURES_FREE=true
   ```

2. 重新生成并验证：

   ```bash
   npm run localize:delivery
   npm run build
   npm run quality:gate
   ```

3. 提交并重新部署。

## 涉及文件

- `.env.production` 和 `.env.development`：全局免费开关。
- `delivery/api/subscription/_free-mode.js`：免费模式判断 helper。
- `delivery/api/subscription/_store.js`：订阅权限入口和早期用户永久免费逻辑。
- `delivery/api/auth/_auth.js`：注册时写入 `is_early_user`。
- `next.config.ts`：免费模式下付费路由 301 重定向。
- `next-sitemap.config.js`：免费模式下从 sitemap 排除付费页面。
- `delivery/api/subscription/create-checkout-session.js`：Stripe checkout API 免费模式保护。
- `delivery/api/subscription/create-portal-session.js`：Stripe 客户门户 API 免费模式保护。
- `delivery/api/subscription/webhook.js`：Stripe webhook 免费模式保护。
- `scripts/apply-delivery-free-mode.cjs`：静态 delivery 页面免费开关和付费入口显示控制。
