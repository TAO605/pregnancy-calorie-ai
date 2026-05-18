# 推广前期准备问题日志

## 2026-05-14 第一批次：关键词挖掘

### 问题 2：Semrush 镜像平台需要登录，无法自动获取真实关键词数据

- 任务阶段：第一批次关键词挖掘
- 目标工具：`https://dash.3ue.com/zh-Hans/#/page/m/home`
- 执行时间：2026-05-14
- 前置状态：Chrome CDP 已连接成功
- 实际访问结果：页面自动跳转到 `https://dash.3ue.com/zh-Hans/#/login`
- 页面可见内容：`登录`、`用户名`、`密码`、`没有账号,去注册`、`客服 V: payseen`
- 无法继续的原因：需要用户提供账号登录权限或在 Chrome 中手动完成登录。该步骤涉及个人账号信息，触发人工介入规则。
- 已执行动作：关闭 Agent 创建的后台标签页，未读取、未输入、未保存任何账号信息。
- 数据状态：关键词、搜索量、KD、地区筛选结果均为“数据不可得”。
- 处理决定：停止关键词挖掘，不生成、不估算、不编造任何关键词数据。
- 需要用户操作：请在自己的 Chrome 中登录 `dash.3ue.com`，确认可进入 Semrush 后台和“关键词魔法工具”，然后告知“已登录，继续关键词挖掘”。
- 当前状态：Blocked

### 自检记录

- 验证标准 1：有效关键词总数 ≥500 个。结果：未执行，数据不可得。
- 验证标准 2：所有关键词搜索量 10-1000、KD≤30。结果：未执行，数据不可得。
- 验证标准 3：信息型≥70%、交易型≥20%。结果：未执行，数据不可得。
- 验证标准 4：无重复、无无关关键词。结果：未执行，数据不可得。
- 验证标准 5：前100个黄金关键词。结果：未执行，数据不可得。

### 问题 1：Chrome CDP 远程调试未连接

- 任务阶段：第一批次关键词挖掘
- 目标工具：`https://dash.3ue.com/zh-Hans/#/page/m/home`
- 需要获取的数据：关键词、搜索量、KD、地区、语言筛选后的真实 Semrush 镜像数据
- 执行检查：运行 `web-access` 前置依赖检查
- 检查结果：Node.js 正常，Chrome 未连接 CDP
- 原始错误：`chrome: not connected — 请确保 Chrome 已打开，然后访问 chrome://inspect/#remote-debugging 并勾选 Allow remote debugging`
- 影响：无法进入用户真实 Chrome 环境操作第三方 Semrush 镜像平台；无法确认登录状态、节点、语言、筛选器和真实数据结果。
- 处理决定：停止第一批关键词挖掘，不生成、不估算、不编造任何搜索量、KD 或关键词表。
- 需要用户操作：打开 Chrome，访问 `chrome://inspect/#remote-debugging`，勾选 `Allow remote debugging for this browser instance`，然后告知可以继续。
- 当前状态：Blocked

### 自检记录

- 验证标准 1：有效关键词总数 ≥500 个。结果：未执行，数据不可得。
- 验证标准 2：所有关键词搜索量 10-1000、KD≤30。结果：未执行，数据不可得。
- 验证标准 3：信息型≥70%、交易型≥20%。结果：未执行，数据不可得。
- 验证标准 4：无重复、无无关关键词。结果：未执行，数据不可得。
- 验证标准 5：前100个黄金关键词。结果：未执行，数据不可得。

### 问题 3：Semrush 镜像大量关键词 KD 显示“不可用”，无法满足 500+ 有效低 KD 关键词标准
- 任务阶段：第一批次关键词挖掘
- 执行时间：2026-05-14
- 已完成操作：在已登录 Chrome 中进入 Semrush 镜像 Keyword Magic Tool，按 US、CA、UK、AU 四个数据库分别查询 10 个种子关键词。
- 真实采集结果：原始记录 833 条；清洗后相关去重关键词 178 条；其中有真实数字 KD 且 KD≤30 的有效关键词 9 条。
- 问题表现：大量长尾关键词只有搜索量，KD/意图显示“不可用”或需刷新指标。
- 数据处理规则：所有 KD 不可用的关键词均标注为“数据不可得”，不纳入 KD≤30 或黄金关键词统计；没有编造或估算任何 KD。
- 交付文件：`seo-keyword-research-batch1.md`、`seo-keyword-research-batch1.csv`、`keyword_research_raw.json`。
- 自检结果：未生成博客内容；所有搜索量和 KD 来自真实工具页面；未达成 500+ 有效关键词和前 100 黄金关键词数量标准，原因已明确记录。
- 当前状态：Completed with data limitation

### 问题 4：第二批竞争对手分析中 Google 本地 Chrome 访问超时
- 任务阶段：第二批次竞争对手分析
- 执行时间：2026-05-14
- 目标关键词：`pregnancy calorie calculator`
- 问题表现：通过本地 Chrome CDP 打开 Google 搜索页时出现 `ERR_CONNECTION_TIMED_OUT`。
- 影响：无法完全依赖本地 Chrome 页面提取 Google 搜索结果。
- 处理方式：改用可用联网搜索工具获取自然搜索结果，并继续使用 Semrush 镜像域名概览补充真实指标。
- 当前状态：Resolved

### 问题 5：DR 指标不可得，不能用 Semrush Authority Score 替代
- 任务阶段：第二批次竞争对手分析
- 执行时间：2026-05-14
- 问题表现：当前可访问真实工具为 Semrush 镜像域名概览，提供 Authority Score、自然流量、付费流量、引荐域名、反向链接，但不提供 Ahrefs DR。
- 数据真实性处理：DR 统一标注为“数据不可得”；报告中只使用真实可见的 Semrush Authority Score 和链接指标。
- 当前状态：Resolved

### 问题 6：部分竞争对手页面或指标不可访问
- 任务阶段：第二批次竞争对手分析
- 执行时间：2026-05-14
- 问题表现：MiniWebTool、CalculatorCorp、Milkology 等页面在本地抓取中出现 403 或连接中断；svelta.ai、kaloria.io 等域名在 Semrush 中显示指标不可用。
- 处理方式：不推测不可访问页面细节，不估算不可用指标；报告中明确标注数据不可得或不可用。
- 当前状态：Resolved with data limitation

### 问题 7：第三批外链建设中 DR 免费核实额度不足
- 任务阶段：第三批次高权重外链建设清单
- 执行时间：2026-05-14
- 目标：整理 50+ 条 DR≥80 免费外链资源
- 使用工具：dachecker.io Bulk Ahrefs DR Checker
- 真实限制：免费未登录状态每次最多 3 个域名，总共 9 个域名；登录后 12 小时可查 30 个域名，升级后每月 3000 个。
- 已核实结果：Facebook DR100、Instagram DR100、LinkedIn DR99、X/Twitter DR98、YouTube DR99、Pinterest DR97、Medium DR94、Reddit DR95、GitHub DR97。
- 处理方式：其余候选平台不填写虚假 DR，统一标注为“数据不可得”，等待后续登录 Ahrefs/dachecker 或同等真实工具继续核实。
- 当前状态：Completed with data limitation

### 问题 8：第四批社区回复模板需要兼顾自然语气和关系披露
- 任务阶段：第四批次社区软植入推广模板
- 执行时间：2026-05-14
- 涉及社区：Quora、Reddit r/pregnancy、BabyCenter、What to Expect
- 问题表现：用户要求以真实用户身份自然回复，但社区规则和合规推广要求通常需要披露与工具的关系。
- 处理方式：模板采用真实、友好、先帮助后提及工具的语气，同时在每条包含工具链接的回复中加入 disclosure 句子。
- 当前状态：Resolved

### 问题 9：孕期营养属于 YMYL 敏感话题
- 任务阶段：第四批次社区软植入推广模板
- 执行时间：2026-05-14
- 风险点：社区回复不能给出诊断、治疗、用药或替代医生建议。
- 处理方式：所有模板均限定为 general nutrition guidance，并建议有特殊情况时咨询 OB、midwife、clinician 或 registered dietitian。
- 当前状态：Resolved
