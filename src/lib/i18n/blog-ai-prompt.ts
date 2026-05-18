import type { Locale } from "@/lib/i18n/config";

type BlogAiPromptInput = {
  title: string;
  description: string;
};

export function buildBlogAiPrompt(locale: Locale, input: BlogAiPromptInput) {
  if (locale === "zh-CN") {
    return `\u6211\u521a\u8bfb\u5b8c\u4e00\u7bc7\u5b55\u671f\u8425\u517b\u6587\u7ae0\uff0c\u6807\u9898\u662f\u300a${input.title}\u300b\uff0c\u6458\u8981\u662f\uff1a${input.description}\u3002\u8bf7\u4f60\u628a\u8fd9\u7bc7\u5185\u5bb9\u8f6c\u6210\u66f4\u5b9e\u9645\u7684\u4e0b\u4e00\u6b65\u5efa\u8bae\uff1a1\uff09\u8fd9\u7bc7\u6587\u7ae0\u6700\u503c\u5f97\u6211\u7acb\u523b\u5e94\u7528\u7684 3 \u4e2a\u70b9\u662f\u4ec0\u4e48\uff1b2\uff09\u5982\u679c\u6211\u8981\u628a\u5b83\u548c\u6211\u7684\u70ed\u91cf\u76ee\u6807\u3001\u996e\u98df\u8282\u594f\u6216\u4f53\u91cd\u53d8\u5316\u7ed3\u5408\u8d77\u6765\u770b\uff0c\u5e94\u8be5\u600e\u4e48\u7406\u89e3\uff1b3\uff09\u4ec0\u4e48\u60c5\u51b5\u4e0b\u6211\u5e94\u8be5\u8fdb\u4e00\u6b65\u95ee\u533b\u751f\u6216\u8425\u517b\u5e08\u3002`;
  }

  if (locale === "es") {
    return `Acabo de leer una guia de nutricion en el embarazo titulada "${input.title}" y su resumen es: ${input.description}. Traducela en siguientes pasos practicos: 1) cuales son los 3 puntos mas utiles para aplicar ahora; 2) como deberia combinar esta guia con mi objetivo calorico, mi ritmo de comidas o mis cambios de peso; 3) en que casos deberia consultar a una clinica o dietista prenatal.`;
  }

  return `I just read a pregnancy nutrition guide titled "${input.title}" and the summary is: ${input.description}. Turn it into practical next steps for me: 1) the 3 most useful points to apply right now; 2) how I should combine this with my calorie target, meal rhythm, or weight changes; 3) what should make me ask a clinician or prenatal dietitian for more help.`;
}
