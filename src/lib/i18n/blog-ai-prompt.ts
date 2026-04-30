import type { Locale } from "@/lib/i18n/config";

type BlogAiPromptInput = {
  title: string;
  description: string;
};

export function buildBlogAiPrompt(locale: Locale, input: BlogAiPromptInput) {
  if (locale === "zh-CN") {
    return `我刚读完一篇孕期营养文章，标题是《${input.title}》，摘要是：${input.description}。请你把这篇内容翻译成更实际的下一步建议：1）这篇文章最值得我立刻应用的 3 个点是什么；2）如果我要把它和我的热量目标、饮食节奏或体重变化结合起来看，应该怎么理解；3）什么情况下我应该进一步问医生或营养师。`;
  }

  if (locale === "es") {
    return `Acabo de leer una guia de nutricion en el embarazo titulada "${input.title}" y su resumen es: ${input.description}. Traducela en siguientes pasos practicos: 1) cuales son los 3 puntos mas utiles para aplicar ahora; 2) como deberia combinar esta guia con mi objetivo calorico, mi ritmo de comidas o mis cambios de peso; 3) en que casos deberia consultar a una clinica o dietista prenatal.`;
  }

  return `I just read a pregnancy nutrition guide titled "${input.title}" and the summary is: ${input.description}. Turn it into practical next steps for me: 1) the 3 most useful points to apply right now; 2) how I should combine this with my calorie target, meal rhythm, or weight changes; 3) what should make me ask a clinician or prenatal dietitian for more help.`;
}
