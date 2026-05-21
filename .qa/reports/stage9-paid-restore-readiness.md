# 第九阶段付费系统恢复就绪报告

日期：2026-05-21

## 结论

PASS。

当前代码已经具备未来恢复付费系统所需的可逆开关、权限保护、早期用户永久权益和付费 API 恢复路径。

唯一需要特别注意的是：恢复付费时必须重新生成 `delivery` 静态页面，因为这些页面会把免费模式开关写入 HTML 和 JavaScript。

## 已验证的恢复开关

- `.env.production`: `NEXT_PUBLIC_ALL_FEATURES_FREE=true`
- `.env.development`: `NEXT_PUBLIC_ALL_FEATURES_FREE=true`
- 未来恢复付费时应改为：`NEXT_PUBLIC_ALL_FEATURES_FREE=false`

## 已验证的代码路径

### 权限入口

- 文件：`delivery/api/subscription/_store.js`
- 全局免费开关保持第一优先级。
- `is_early_user=true` 的用户在免费模式关闭后仍获得 Premium 权限。
- `EARLY_FREE_CUTOFF_DATE` 保留为历史用户兜底逻辑。

### 用户注册

- 文件：`delivery/api/auth/_auth.js`
- 免费模式期间注册的新用户会写入 `is_early_user=true`。
- 登录/session/password reset 查询会保留并返回早期用户字段。
- `publicUser(row)` 返回 `isEarlyUser`。

### 路由重定向

- 文件：`next.config.ts`
- 只有 `NEXT_PUBLIC_ALL_FEATURES_FREE === "true"` 时才启用付费路由 301。
- 未来改成 `false` 后，付费路由不会再被重定向。

### Sitemap

- 文件：`next-sitemap.config.js`
- 只有免费模式开启时才排除 `/pricing`、`/premium`、`/checkout`、`/billing` 等付费页面。
- 未来改成 `false` 后，付费页面可以重新进入 sitemap。

### 支付 API

- 文件：
  - `delivery/api/subscription/create-checkout-session.js`
  - `delivery/api/subscription/create-portal-session.js`
  - `delivery/api/subscription/webhook.js`
- 这些 API 只在 `isAllFeaturesFree()` 为 true 时返回免费模式 403。
- 未来改成 false 后，会继续执行原 Stripe 逻辑。

### 静态 delivery 页面

- 文件：`scripts/apply-delivery-free-mode.cjs`
- 负责写入：
  - `data-all-features-free`
  - `const ALL_FEATURES_FREE`
  - 免费模式付费入口隐藏样式
  - 免费模式付费页面跳转脚本
- 恢复付费时必须执行：

```bash
npm run localize:delivery
```

## 未来恢复付费必跑命令

```bash
npm run localize:delivery
npm run build
npm run quality:gate
npm run test:subscription
```

## 当前验证基线

最近一次完整验证结果：

- `npm run build`：通过
- `npm run quality:gate`：通过
- Jest：337/337 通过
- Cypress E2E：59/59 通过
- Visual：10/10 通过
- 第八阶段浏览器/HTTP 专项审计：通过

## 操作手册

详细恢复步骤见：

- `PAID_SYSTEM_RESTORE_MANUAL.md`
