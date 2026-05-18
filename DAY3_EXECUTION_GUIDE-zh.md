# Day 3 执行手册：产品和开发者平台实体链接

> 💡 使用说明：每个平台下的文本框内容可直接复制粘贴。本节包含 3 个开发者平台 + 5 个产品平台。

---

## ⚠️ 执行前准备

Day 3 需要上传代码到开发者平台（GitLab、CodePen）。代码作品已备好：

| 文件 | 路径 | 说明 |
|---|---|---|
| 独立计算器 Demo | `delivery/demo/index.html` | 精简版计算器，Mifflin-St Jeor BMR + IOM 孕期热量公式，有深色模式 |
| README | `delivery/demo/README.md` | 项目说明文档，含公式说明、技术栈、免责声明 |

**你需要做的**：把这两个文件下载到本地，上传到 GitLab 仓库和 CodePen。

---

## 统一品牌信息（复制粘贴用）

| 字段 | 内容 |
|---|---|
| 品牌名称 | `AI Pregnancy Calorie Calculator` |
| 官网 | `https://aipregnancycaloriecalculator.online` |
| 定价页 | `https://aipregnancycaloriecalculator.online/pricing.html` |
| 简介（英文） | `AI-powered pregnancy calorie calculator with personalized nutrition guidance, meal planning, and progress tracking.` |
| 联系邮箱 | `support@aipregnancycaloriecalculator.online` |
| 创始人名 | `Tao Xu` |
| 公司类型 | 个人独立项目 / Self-Employed / Sole Proprietor |
| 价格 | 免费使用。Premium 订阅：$7.99/月 或 $79.99/年 |

---

## 第一部分：开发者平台

---

### 1. GitLab

> 🔗 注册地址：https://gitlab.com/users/sign_up
> 🎯 目标：创建资料页 + 公开仓库，README 带官网链接

**操作步骤：**

#### 第一步：注册 GitLab 账号

1. 用品牌邮箱注册 GitLab（可选 GitHub 登录）
2. 完善资料：

**Username（用户名）：**
建议 `aipregnancycaloriecalculator`

**Full name（全名）：**
```
AI Pregnancy Calorie Calculator
```

**Website（个人网站）：**
```
https://aipregnancycaloriecalculator.online
```

**Bio（简介）：**
```
Developer of AI Pregnancy Calorie Calculator — a free online tool for expecting mothers to estimate daily pregnancy calorie needs.
```

#### 第二步：创建公开仓库

1. 点击 New project → Create blank project
2. 填写：

**Project name：**
```
pregnancy-calorie-calculator
```

**Visibility Level：** 选 **Public**

**Project description：**
```
Standalone demo of the pregnancy calorie formula used by AI Pregnancy Calorie Calculator. Mifflin-St Jeor BMR + IOM trimester-based pregnancy calorie guidelines.
```

#### 第三步：上传代码

1. 创建仓库后，把 `delivery/demo/index.html` 和 `delivery/demo/README.md` 上传到仓库根目录
2. 确保 README.md 在仓库首页正常显示（GitLab 会自动渲染）

✅ 完成标准：仓库 URL 像 `https://gitlab.com/你的用户名/pregnancy-calorie-calculator`，README 中能看到官网链接。

---

### 2. CodePen

> 🔗 注册地址：https://codepen.io/signup
> 🎯 目标：完善资料页放网站链接 + 可选上传一个计算器 demo pen

**操作步骤：**

#### 第一步：注册 CodePen 账号

1. 用品牌邮箱注册（可选 GitHub/Google 登录）

**Username（用户名）：**
建议 `aipregnancycaloriecalc`

**Full Name（全名）：**
```
AI Pregnancy Calorie Calculator
```

**Website（网站链接——在 Settings → Profile 中填写）：**
```
https://aipregnancycaloriecalculator.online
```

**Bio / About（简介）：**
```
Developer of a free AI-powered pregnancy calorie calculator. aipregnancycaloriecalculator.online
```

2. 上传头像：右键保存 `https://aipregnancycaloriecalculator.online/logo-square.webp`，上传到 CodePen

#### 第二步（可选，强烈推荐）：创建一个计算器 Demo Pen

1. 点击左上角 Pen → New Pen
2. 把 `delivery/demo/index.html` 里的 HTML 部分粘贴到 HTML 面板
3. 把 `<style>` 标签里的 CSS 粘贴到 CSS 面板
4. 把 `<script>` 标签里的 JS 粘贴到 JS 面板

**Pen Title（标题）：**
```
Pregnancy Calorie Calculator — Mifflin-St Jeor + IOM Demo
```

**Pen Description（简介）：**
```
Demonstration of the pregnancy calorie formula used by AI Pregnancy Calorie Calculator. Enter age, height, weight, pregnancy week, pregnancy type, and activity level to see the daily calorie target with transparent formula breakdown.
Live tool at https://aipregnancycaloriecalculator.online
```

5. 把 Pen 设为 Public，保存

✅ 完成标准：资料页有网站链接；如果做了 demo pen，pen 的描述里有官网链接。

---

### 3. Dev.to

> 🔗 注册地址：https://dev.to/enter
> 🎯 目标：仅完善资料页放网站链接，**不发文章**。

**操作步骤：**

1. 用品牌邮箱或 GitHub 注册 Dev.to
2. 进入 Settings → Profile

**Name（显示名称）：**
```
AI Pregnancy Calorie Calculator
```

**Username（用户名）：**
建议 `aipregnancycaloriecalc`

**Website URL（网站链接）：**
```
https://aipregnancycaloriecalculator.online
```

**Bio / Summary（简介）：**
```
Free AI-powered pregnancy calorie calculator. Personalized daily calorie goals, macro targets, meal plans, and nutrition tips for every trimester.
```

3. 上传头像（和前面一样用 logo-square）

**⚠️ 不要发文章。Dev.to 只做资料页链接。**

✅ 完成标准：资料页 `https://dev.to/你的用户名` 有网站链接。

---

## 第二部分：产品平台

> ⚠️ 所有产品平台只填**可验证的真实信息**。绝不编造融资轮次、团队规模、用户数量、医疗资质。

---

### 4. Product Hunt

> 🔗 注册地址：https://www.producthunt.com/
> 🎯 目标：创建创始人资料页，放网站链接。**本次不发起产品上线（Launch）。**

**操作步骤：**

1. 用品牌邮箱或 X/Twitter 登录 Product Hunt
2. 完善 Profile：

**Name（名称）：**
```
Tao Xu
```

**Headline（头衔）：**
```
Founder of AI Pregnancy Calorie Calculator
```

**Website（网站——在 Profile settings 中填写）：**
```
https://aipregnancycaloriecalculator.online
```

**Bio（简介）：**
```
Building a free AI-powered pregnancy calorie calculator that helps expecting mothers understand their daily nutrition needs. Combines the Mifflin-St Jeor BMR equation with IOM pregnancy calorie guidelines to deliver personalized guidance.
```

3. 上传头像

**⚠️ 点击「Launch」之前必须满足以下条件（目前不满足，不要上线）：**
- 定价页和 Stripe 支付完整可用
- 隐私政策、服务条款、退款政策齐全
- 产品页成熟稳定

✅ 完成标准：个人资料页 `https://www.producthunt.com/@你的用户名` 有网站链接。

---

### 5. Indie Hackers

> 🔗 注册地址：https://www.indiehackers.com/
> 🎯 目标：创建创始人资料，如实描述产品。

**操作步骤：**

1. 用品牌邮箱注册 Indie Hackers
2. 完善资料：

**Name（名称）：**
```
Tao Xu
```

**Website（网站）：**
```
https://aipregnancycaloriecalculator.online
```

**Bio（简介）：**
```
Building AI Pregnancy Calorie Calculator — a free online tool for expecting mothers. Mifflin-St Jeor BMR + IOM pregnancy calorie guidelines. Currently live as a mobile-first web app.
```

**What are you working on?（在做什么？填入产品简介）：**
```
AI Pregnancy Calorie Calculator is a free tool that helps pregnant users estimate their daily calorie needs by entering age, height, weight, pregnancy week, pregnancy type, and activity level.

The tool shows the full calculation process (BMR → TDEE → pregnancy adjustment), personalized macro targets, AI-powered nutrition tips, meal plan examples, and a weekly weight gain tracker with IOM range comparison.

Free tier available. Premium plan at $7.99/month or $79.99/year for unlimited AI nutrition guidance and progress tracking.

Live at https://aipregnancycaloriecalculator.online
```

**⚠️ 不要编造 MRR、用户数、增长数据。留空即可。**

✅ 完成标准：资料页 `https://www.indiehackers.com/你的用户名` 有网站链接。

---

### 6. Crunchbase

> 🔗 注册地址：https://www.crunchbase.com/register
> 🎯 目标：创建组织资料，**只填能验证的信息**。

**操作步骤：**

1. 用品牌邮箱注册 Crunchbase
2. 创建 Organization Profile：

**Organization Name：**
```
AI Pregnancy Calorie Calculator
```

**Website：**
```
https://aipregnancycaloriecalculator.online
```

**Short description：**
```
Free AI-powered pregnancy calorie calculator with personalized nutrition guidance, meal planning, and progress tracking.
```

**Full description：**
```
AI Pregnancy Calorie Calculator is a free online tool that helps expecting mothers estimate their daily pregnancy calorie needs. Users enter age, height, pre-pregnancy weight, pregnancy week, pregnancy type, and activity level to receive a personalized daily calorie range based on the Mifflin-St Jeor BMR equation and IOM pregnancy calorie guidelines.

The tool also provides macro targets, AI-powered nutrition tips, meal plan examples, and a weekly weight gain tracker.

Free tier available. Premium subscription at $7.99/month or $79.99/year.
```

**⚠️ 以下字段全部留空（不要填）：**
- Funding rounds / 融资轮次
- Revenue / 收入
- Employee count / 员工人数
- Founded date 填 `2026`（如果要求必填）

**类别 / Categories：**
Healthcare, Nutrition, Health & Wellness, Software

**总部 / Headquarters：**
留空（个人独立项目，无办公室）

✅ 完成标准：Crunchbase 资料页有网站链接，没有任何编造的数据。

---

### 7. Wellfound (原 AngelList)

> 🔗 注册地址：https://wellfound.com/
> 🎯 目标：创建创业资料，不编造任何数据。

**操作步骤：**

1. 用品牌邮箱注册 Wellfound
2. 创建 Company Profile：

**Company name：**
```
AI Pregnancy Calorie Calculator
```

**Website：**
```
https://aipregnancycaloriecalculator.online
```

**Tagline：**
```
Free AI-powered pregnancy calorie calculator for expecting mothers.
```

**Description：**
```
AI Pregnancy Calorie Calculator helps expecting mothers understand their daily calorie needs during pregnancy. Users enter their age, height, pre-pregnancy weight, pregnancy week, type, and activity level to get a personalized daily calorie target based on the Mifflin-St Jeor equation and IOM guidelines.

The tool is free to use. A Premium subscription at $7.99/month or $79.99/year unlocks unlimited AI nutrition guidance and progress tracking.
```

**⚠️ 以下字段全部留空：**
- Funding raised / 融资金额
- Team size / 团队人数
- Number of employees / 员工数
- Job listings / 招聘信息
- Office location / 办公地点

✅ 完成标准：Wellfound 公司资料页有网站链接。所有空字段如实空着，不造假。

---

### 8. AlternativeTo

> 🔗 注册地址：https://alternativeto.net/
> 🎯 目标：提交软件列表，说明产品类别。

**操作步骤：**

1. 用品牌邮箱注册 AlternativeTo
2. 点击 Submit Software / Add App

**App name：**
```
AI Pregnancy Calorie Calculator
```

**Website URL：**
```
https://aipregnancycaloriecalculator.online
```

**Description：**
```
Free online pregnancy calorie calculator that estimates daily calorie needs based on age, height, pre-pregnancy weight, pregnancy week, pregnancy type, and activity level. Uses the Mifflin-St Jeor BMR equation with IOM pregnancy calorie guidelines. Provides AI-powered nutrition tips, macro targets, meal plan examples, and a weekly weight gain tracker.
```

**Category / Tags：**
Health, Nutrition, Pregnancy, Calculator

**Platforms：** Web-based

**Pricing model：** Freemium (Free / $7.99/month Premium)

**Official / Alternative to：**
留空（没有要替换的竞品）

✅ 完成标准：提交成功后资料页有官网链接。

---

## ✅ Day 3 完成清单

| 平台 | 类型 | 状态 | 资料/仓库 URL |
|---|---|---|---|
| GitLab | 开发者 | ⬜ 待注册 | |
| CodePen | 开发者 | ⬜ 待注册 | |
| Dev.to | 开发者 | ⬜ 待注册 | |
| Product Hunt | 产品 | ⬜ 待注册 | |
| Indie Hackers | 产品 | ⬜ 待注册 | |
| Crunchbase | 产品 | ⬜ 待注册 | |
| Wellfound | 产品 | ⬜ 待注册 | |
| AlternativeTo | 产品 | ⬜ 待注册 | |

---

## ⚠️ 操作提醒

1. **先做开发者平台再做产品平台**：GitLab → CodePen → Dev.to 需要上传代码，先搞定；产品平台主要是填表。
2. **CodePen 的 demo pen 强烈建议做**：这可能是你在开发者圈子里最有说服力的一个链接触点。
3. **Crunchbase、Wellfound 的融资/团队/营收全部留空**：不造假是底线。
4. **Product Hunt 不要点 Launch**：产品还需要完善才能上线。
5. **每完成一个平台，把资料 URL 记下来告诉我**，我更新 `BACKLINK_BUILDING_PROGRESS_TABLE.md`。
