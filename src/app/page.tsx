import type { Metadata } from "next";

import { PregnancyCalorieStudio } from "@/components/rebuild/pregnancy-calorie-studio";

export const metadata: Metadata = {
  title: "AI孕期热量计算器｜每日热量与营养建议",
  description:
    "重新设计的 AI 孕期热量计算器，输入年龄、身高、体重、孕周和活动水平，快速获得每日热量范围、蛋白质和饮水参考。",
};

export default function HomePage() {
  return <PregnancyCalorieStudio />;
}
