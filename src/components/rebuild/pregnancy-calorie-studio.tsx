"use client";

import { useMemo, useState } from "react";

type ActivityLevel = "sedentary" | "light" | "moderate" | "active";
type Trimester = "first" | "second" | "third";

const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const trimesterExtraCalories: Record<Trimester, number> = {
  first: 0,
  second: 340,
  third: 450,
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "久坐",
  light: "轻度活动",
  moderate: "中等活动",
  active: "较高活动",
};

const trimesterLabels: Record<Trimester, string> = {
  first: "孕早期",
  second: "孕中期",
  third: "孕晚期",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function calculateBmr(weightKg: number, heightCm: number, age: number) {
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

function formatCalories(value: number) {
  return `${Math.round(value).toLocaleString("zh-CN")} kcal`;
}

export function PregnancyCalorieStudio() {
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(58);
  const [week, setWeek] = useState(22);
  const [activity, setActivity] = useState<ActivityLevel>("light");
  const [trimester, setTrimester] = useState<Trimester>("second");

  const result = useMemo(() => {
    const safeAge = clamp(age, 16, 55);
    const safeHeight = clamp(height, 130, 210);
    const safeWeight = clamp(weight, 35, 180);
    const bmr = calculateBmr(safeWeight, safeHeight, safeAge);
    const maintenance = bmr * activityFactors[activity];
    const extra = trimesterExtraCalories[trimester];
    const target = maintenance + extra;
    const lower = target - 120;
    const upper = target + 120;
    const proteinMin = safeWeight * 1.1;
    const waterMin = 1.8 + (activity === "active" ? 0.4 : 0);

    return {
      bmr,
      maintenance,
      extra,
      target,
      lower,
      upper,
      proteinMin,
      waterMin,
    };
  }, [activity, age, height, trimester, weight]);

  const aiInsight =
    trimester === "first"
      ? "孕早期通常不需要明显额外热量。更重要的是少量多餐、处理恶心和保证液体摄入。"
      : trimester === "second"
        ? "孕中期开始可增加约 340 kcal。优先把增量放在蛋白质、全谷物、奶类或豆制品上。"
        : "孕晚期能量需求更高，但胃部压迫也更明显。把目标拆成三餐加一到两次加餐更容易执行。";

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative px-5 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-black/10 bg-white/75 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-[#132018] text-sm font-bold text-white">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[-0.03em]">孕期热量计算器</p>
              <p className="text-xs text-muted">重新设计版 MVP</p>
            </div>
          </div>
          <a className="hidden rounded-full bg-[#132018] px-4 py-2 text-sm font-semibold text-white md:inline-flex" href="#calculator">
            开始计算
          </a>
        </div>
      </section>

      <section className="px-5 pb-12 pt-8 md:px-8 md:pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-[#d9cdb7] bg-[#fff9ec] px-4 py-2 text-sm font-semibold text-[#6b4f1f]">
              面向孕妈的 AI 工具站，不替代医生
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.09em] text-[#132018] md:text-7xl">
              30 秒算出孕期每日热量，再让 AI 解释怎么吃。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              输入年龄、身高、体重、孕周和活动水平，获得每日热量范围、孕期额外热量、蛋白质和饮水建议。结果会用非诊断语言解释，适合作为产检沟通前的准备。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="cta-primary bg-[#132018]" href="#calculator">
                免费计算
              </a>
              <a className="cta-secondary" href="#safety">
                看安全边界
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#e6f55c]/60 blur-2xl" />
            <div className="absolute -bottom-10 -right-8 h-44 w-44 rounded-full bg-[#ffb199]/50 blur-3xl" />
            <div className="relative rounded-[2.2rem] border border-black/10 bg-[#fffdf7]/90 p-6 shadow-[0_28px_90px_-48px_rgba(19,32,24,0.55)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                今日目标预览
              </p>
              <div className="mt-5 rounded-[1.7rem] bg-[#132018] p-6 text-white">
                <p className="text-sm text-white/70">推荐每日热量</p>
                <p className="mt-3 text-5xl font-semibold tracking-[-0.08em]">
                  {formatCalories(result.target)}
                </p>
                <p className="mt-3 text-sm text-white/70">
                  合理范围 {formatCalories(result.lower)} - {formatCalories(result.upper)}
                </p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.2rem] bg-white p-4 shadow-border">
                  <p className="text-xs text-muted">孕期阶段</p>
                  <p className="mt-2 font-semibold">{trimesterLabels[trimester]}</p>
                </div>
                <div className="rounded-[1.2rem] bg-white p-4 shadow-border">
                  <p className="text-xs text-muted">额外热量</p>
                  <p className="mt-2 font-semibold">+{result.extra} kcal</p>
                </div>
                <div className="rounded-[1.2rem] bg-white p-4 shadow-border">
                  <p className="text-xs text-muted">活动水平</p>
                  <p className="mt-2 font-semibold">{activityLabels[activity]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="px-5 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <form className="surface-card rounded-[2rem] p-6 md:p-8" onSubmit={(event) => event.preventDefault()}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              输入资料
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="field-label">年龄</span>
                <input className="field-input" min={16} max={55} type="number" value={age} onChange={(event) => setAge(Number(event.target.value))} />
              </label>
              <label className="grid gap-2">
                <span className="field-label">孕周</span>
                <input className="field-input" min={1} max={42} type="number" value={week} onChange={(event) => setWeek(Number(event.target.value))} />
              </label>
              <label className="grid gap-2">
                <span className="field-label">身高 cm</span>
                <input className="field-input" min={130} max={210} type="number" value={height} onChange={(event) => setHeight(Number(event.target.value))} />
              </label>
              <label className="grid gap-2">
                <span className="field-label">孕前或当前体重 kg</span>
                <input className="field-input" min={35} max={180} type="number" value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
              </label>
              <label className="grid gap-2">
                <span className="field-label">孕期阶段</span>
                <select className="field-input" value={trimester} onChange={(event) => setTrimester(event.target.value as Trimester)}>
                  <option value="first">孕早期</option>
                  <option value="second">孕中期</option>
                  <option value="third">孕晚期</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="field-label">活动水平</span>
                <select className="field-input" value={activity} onChange={(event) => setActivity(event.target.value as ActivityLevel)}>
                  <option value="sedentary">久坐</option>
                  <option value="light">轻度活动</option>
                  <option value="moderate">中等活动</option>
                  <option value="active">较高活动</option>
                </select>
              </label>
            </div>
          </form>

          <div className="grid gap-6">
            <article className="rounded-[2rem] bg-[#132018] p-6 text-white md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                计算结果
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <p className="text-sm text-white/65">每日目标热量</p>
                  <p className="mt-3 text-5xl font-semibold tracking-[-0.08em]">
                    {formatCalories(result.target)}
                  </p>
                  <p className="mt-3 text-white/70">
                    建议区间：{formatCalories(result.lower)} - {formatCalories(result.upper)}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-white/10 p-5">
                  <p className="text-sm text-white/65">孕周</p>
                  <p className="mt-2 text-3xl font-semibold">{week}</p>
                  <p className="mt-2 text-sm text-white/65">{trimesterLabels[trimester]}</p>
                </div>
              </div>
            </article>

            <article className="surface-card rounded-[2rem] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                AI 解读
              </p>
              <p className="mt-5 text-xl font-semibold tracking-[-0.05em] text-[#132018]">
                {aiInsight}
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.2rem] bg-[#f7ffe1] p-4 shadow-border">
                  <p className="text-xs text-muted">基础代谢估算</p>
                  <p className="mt-2 font-semibold">{formatCalories(result.bmr)}</p>
                </div>
                <div className="rounded-[1.2rem] bg-white p-4 shadow-border">
                  <p className="text-xs text-muted">蛋白质下限</p>
                  <p className="mt-2 font-semibold">{Math.round(result.proteinMin)} g/天</p>
                </div>
                <div className="rounded-[1.2rem] bg-white p-4 shadow-border">
                  <p className="text-xs text-muted">饮水参考</p>
                  <p className="mt-2 font-semibold">{result.waterMin.toFixed(1)} L+</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="safety" className="px-5 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {[
            ["不是诊断", "结果只用于营养沟通准备，不能替代产检医生、营养师或助产士建议。"],
            ["高风险提示", "如果出现出血、严重腹痛、持续呕吐、胎动异常等情况，应优先就医。"],
            ["适合工具站", "首版聚焦计算和解释，后续可接入登录、记录、AI 问答和内容 SEO。"],
          ].map(([title, body]) => (
            <article key={title} className="surface-card rounded-[1.8rem] p-7">
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">{title}</h2>
              <p className="mt-4 leading-7 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-12 md:px-8 md:pb-20">
        <div className="mx-auto max-w-7xl rounded-[2.2rem] bg-[#fff4df] p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#79551e]">
                下一步
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.08em] text-[#132018]">
                这个版本先把“算得清楚、解释得安全、页面能转化”做好。
              </h2>
            </div>
            <div className="grid gap-3">
              {[
                "第二阶段：接入真实 AI 对话，根据计算结果生成饮食建议。",
                "第三阶段：做用户保存和孕周追踪，提高复访。",
                "第四阶段：扩展 SEO 内容页，覆盖孕早中晚期热量问题。",
              ].map((item) => (
                <div key={item} className="rounded-[1.2rem] bg-white/80 p-4 shadow-border">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
