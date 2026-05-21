// Vercel Serverless Function for real AI pregnancy guidance.
// Keep API keys on the server only. Never place OpenAI or Claude keys in index.html.

const COMMON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

const SUPPORTED_LANGUAGES = {
  en: { name: "English", locale: "en-US" },
  es: { name: "Spanish", locale: "es" },
  fr: { name: "French", locale: "fr" },
  de: { name: "German", locale: "de" },
  pt: { name: "Portuguese", locale: "pt" },
  it: { name: "Italian", locale: "it" },
  ru: { name: "Russian", locale: "ru" },
  ar: { name: "Arabic", locale: "ar" },
  ja: { name: "Japanese", locale: "ja" },
  ko: { name: "Korean", locale: "ko" }
};

function send(response, statusCode, body) {
  response.statusCode = statusCode;
  Object.entries(COMMON_HEADERS).forEach(([key, value]) => response.setHeader(key, value));
  response.end(JSON.stringify(body));
}

function normalizeLanguage(value) {
  const code = String(value || "en").toLowerCase().split("-")[0];
  return Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, code) ? code : "";
}

function getPayloadLanguage(payload) {
  return normalizeLanguage(
    payload && (payload.lang || payload.language || payload.locale || (payload.inputs && payload.inputs.lang))
  );
}

function getDetectedCurrency(request) {
  const country = String(
    request.headers["x-vercel-ip-country"] ||
    request.headers["cf-ipcountry"] ||
    ""
  ).toUpperCase();
  const euCountries = new Set([
    "AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT",
    "LU", "MT", "NL", "PT", "SK", "SI", "ES", "HR"
  ]);
  let currency = "USD";
  if (country === "GB") currency = "GBP";
  else if (country === "CA") currency = "CAD";
  else if (country === "AU") currency = "AUD";
  else if (euCountries.has(country)) currency = "EUR";
  return { country: country || "US", currency };
}

async function getExchangeRates() {
  const fallbackRates = { USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.37, AUD: 1.52 };
  try {
    const upstream = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await upstream.json();
    if (!upstream.ok || data.result === "error" || !data.rates) throw new Error(data["error-type"] || "Exchange rate API unavailable");
    return {
      base: "USD",
      provider: "open.er-api.com",
      updated: data.time_last_update_utc || null,
      rates: {
        USD: 1,
        EUR: Number(data.rates.EUR) || fallbackRates.EUR,
        GBP: Number(data.rates.GBP) || fallbackRates.GBP,
        CAD: Number(data.rates.CAD) || fallbackRates.CAD,
        AUD: Number(data.rates.AUD) || fallbackRates.AUD
      }
    };
  } catch (error) {
    return { base: "USD", provider: "fallback", updated: null, rates: fallbackRates };
  }
}

function buildSystemPrompt(lang) {
  const language = SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES.en;
  return [
    "You are a US registered obstetric dietitian and pregnancy exercise guide with 10+ years of clinical experience.",
    "Follow ACOG and IOM pregnancy nutrition, physical activity, energy, and weight gain principles.",
    "This is educational and informational support only, not medical advice.",
    `Write every user-visible JSON string 100% in ${language.name}.`,
    `Do not mix languages. Do not reuse English text unless the requested language is English.`,
    "Use a warm, practical, positive, non-anxious tone.",
    "Avoid alarmist, absolute, shame-based, diagnostic, treatment, prevention, or cure claims.",
    "Use gentle wording such as recommend, suggest, choose, prioritize, pause, and check in.",
    "Every bullet must clearly use at least two of the user's six core parameters: age, pre-pregnancy BMI, gestational age, fetus count, activity level with coefficient, and daily recommended calories.",
    "Do not write generic wellness advice or bullets that could apply to any pregnancy.",
    "Return valid JSON only. No markdown. No extra text.",
    "JSON shape: {\"diet\":[\"...\"],\"exercise\":[\"...\"],\"tips\":[\"...\"]}.",
    "diet must contain exactly 9 short actionable bullets for the module titled Personalized Daily Diet Plan.",
    "exercise must contain exactly 6 short actionable bullets for the module titled Safe & Suitable Exercise Guide.",
    "tips must contain exactly 3 short actionable bullets."
  ].join(" ");
}

function buildQaSystemPrompt(lang) {
  const language = SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES.en;
  return [
    "You are a pregnancy nutrition Q&A assistant for a global pregnancy calorie calculator.",
    "Base answers on IOM 2009 pregnancy weight gain and energy principles, WHO antenatal nutrition guidance, and current mainstream nutrition research consensus.",
    "Answer only nutrition, food, hydration, caffeine, supplement-food, and meal-pattern questions.",
    "Do not diagnose, prescribe, treat, cure, order tests, recommend medication, or replace a clinician.",
    "Avoid vague phrases like it depends unless followed by a clear practical condition.",
    `Write all three answer strings 100% in ${language.name} with a warm, calm tone.`,
    `Do not mix languages. Do not reuse English text unless the requested language is English.`,
    "Return valid JSON only with this exact shape: {\"answer\":[\"direct answer\",\"reason\",\"action\"]}.",
    "The answer array must contain exactly 3 short sentences.",
    "Sentence 1: direct answer.",
    "Sentence 2: explain why using the user's week, BMI category, calorie target, pregnancy type, or diet preferences.",
    "Sentence 3: one practical action the user can do today.",
    "Keep the total answer under 80 words."
  ].join(" ");
}

function sanitizePayload(payload) {
  const inputs = payload && payload.inputs ? payload.inputs : {};
  const result = payload && payload.result ? payload.result : {};
  return {
    lang: getPayloadLanguage(payload),
    age: Number(inputs.age),
    heightValue: Number(inputs.heightValue),
    heightUnit: String(inputs.heightUnit || ""),
    weightValue: Number(inputs.weightValue),
    weightUnit: String(inputs.weightUnit || ""),
    week: Number(inputs.week),
    pregnancyType: String(inputs.pregnancyType || ""),
    activity: Number(inputs.activity),
    customNeeds: Array.isArray(inputs.customNeeds) ? inputs.customNeeds.slice(0, 3).map(String) : [],
    caloriesLow: Number(result.low),
    caloriesHigh: Number(result.high),
    caloriesTarget: Number(result.target),
    bmiValue: Number(result.bmiValue),
    bmiCategory: String(result.bmiCategory || ""),
    weightGain: String(result.weightGain || ""),
    protein: Number(result.protein),
    carbs: Number(result.carbs),
    fat: Number(result.fat),
    mealSplit: result.mealSplit || null
  };
}

function sanitizeQaPayload(payload) {
  const inputs = payload && payload.inputs ? payload.inputs : {};
  const result = payload && payload.result ? payload.result : {};
  const clean = (value, maxLength) => String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
  return {
    lang: getPayloadLanguage(payload),
    question: clean(payload && payload.question, 280),
    age: Number(inputs.age),
    week: Number(inputs.week),
    pregnancyType: clean(inputs.pregnancyType, 40),
    activity: clean(inputs.activity, 60),
    mealDietType: clean(inputs.mealDietType, 40),
    mealAllergies: Array.isArray(inputs.mealAllergies) ? inputs.mealAllergies.slice(0, 6).map((item) => clean(item, 30)) : [],
    mealBudget: clean(inputs.mealBudget, 30),
    mealDifficulty: clean(inputs.mealDifficulty, 30),
    mealCulture: clean(inputs.mealCulture, 40),
    target: Number(result.target),
    bmiValue: Number(result.bmiValue),
    bmiCategory: clean(result.bmiCategory, 80),
    protein: Number(result.protein),
    carbs: Number(result.carbs),
    fat: Number(result.fat),
    weightGain: clean(result.weightGain, 120)
  };
}

function buildUserPrompt(data) {
  return [
    "Generate personalized pregnancy nutrition and movement reference content for this user using only the parameters below.",
    "Core user parameters:",
    `Age: ${data.age}`,
    `Pre-pregnancy BMI: ${data.bmiValue} (${data.bmiCategory})`,
    `Current gestational age: Week ${data.week}`,
    `Fetus count: ${data.pregnancyType}`,
    `Daily activity level coefficient: ${data.activity}`,
    `Daily recommended calories: ${data.caloriesTarget} kcal (${data.caloriesLow}-${data.caloriesHigh} kcal reference range)`,
    `Optional user-selected context: ${data.customNeeds.length ? data.customNeeds.join(", ") : "none"}`,
    `Daily macro reference: protein ${data.protein}g, carbs ${data.carbs}g, fat ${data.fat}g`,
    `IOM weight gain reference: ${data.weightGain}`,
    "Personalized Daily Diet Plan rules:",
    "Start with a 3 meals + 2 snacks calorie split using the user's daily recommended calories. Give a calorie range for each meal/snack.",
    "Give daily gram ranges for five food groups: protein foods, carbohydrate foods, vegetables, fruits, and healthy fats. Use pregnancy nutrient-dense foods.",
    "Include a user-specific diet focus tied to gestational week, BMI, activity coefficient, fetus count, and optional context when present.",
    "Include exactly 3 simple food-choice reminders that match the user's BMI/activity/week/fetus count.",
    "Safe & Suitable Exercise Guide rules:",
    "Start with weekly total minutes and frequency matched to the user's gestational week, BMI, and activity coefficient.",
    "Recommend 3-4 suitable activity types with per-session duration and one practical note each.",
    "Include movement pause-and-contact-care-team wording using positive phrasing: pause the session and check in with the care team if new bleeding, fluid leakage, chest discomfort, dizziness, calf swelling, or regular painful contractions appear.",
    "Add one daily non-exercise activity suggestion matched to the user's activity level and optional context when present.",
    "Personalized Pregnancy Tips rules:",
    "Give exactly 3 short reminders tied to gestational week, BMI, and age. Use warm reassurance."
  ].join("\n");
}

function buildQaUserPrompt(data) {
  return [
    "User question:",
    data.question,
    "",
    "Personal context:",
    `Age: ${data.age}`,
    `Pregnancy week: ${data.week}`,
    `Pregnancy type: ${data.pregnancyType}`,
    `Activity: ${data.activity}`,
    `BMI: ${data.bmiValue} (${data.bmiCategory})`,
    `Daily calorie target: ${data.target} kcal`,
    `Macro targets: protein ${data.protein}g, carbs ${data.carbs}g, fat ${data.fat}g`,
    `IOM weight gain reference: ${data.weightGain}`,
    `Meal preferences: ${data.mealDietType}, ${data.mealBudget} budget, ${data.mealDifficulty} cooking, ${data.mealCulture} style`,
    `Allergies to respect: ${data.mealAllergies.length ? data.mealAllergies.join(", ") : "none selected"}`,
    "",
    "Answer structure:",
    "1. Direct answer.",
    "2. Reason.",
    "3. Practical suggestion.",
    "Do not include markdown, bullets, citations, diagnosis, medication, or treatment instructions."
  ].join("\n");
}

function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw error;
    return JSON.parse(match[0]);
  }
}

function isValidAIResponse(data) {
  return data
    && Array.isArray(data.diet)
    && Array.isArray(data.exercise)
    && Array.isArray(data.tips)
    && data.diet.length >= 9
    && data.exercise.length >= 6
    && data.tips.length >= 3;
}

function normalizeQaAnswer(data) {
  const answer = data && Array.isArray(data.answer) ? data.answer : [];
  return answer
    .map((item) => String(item || "").replace(/\s+/g, " ").trim().slice(0, 240))
    .filter(Boolean)
    .slice(0, 3);
}

function isValidQaResponse(data) {
  const answer = normalizeQaAnswer(data);
  return answer.length === 3
    && answer.join(" ").length <= 520
    && !/\bdiagnose\b|\btreat\b|\bcure\b|\bprescribe\b|\bmedication\b/i.test(answer.join(" "));
}

function localQaAnswer(data) {
  const lower = String(data.question || "").toLowerCase();
  const pregnancyLabel = String(data.pregnancyType || "").toLowerCase().includes("multiple") ? "babies" : "baby";
  if (/ice cream|dessert|sweet|sugar|cake|cookie/.test(lower)) {
    return [
      `Yes, a small serving of ice cream can fit into your ${Math.round(data.target)} kcal/day plan at Week ${data.week}.`,
      `At Week ${data.week} with a ${data.bmiCategory} pattern and ${data.activity} routine, an occasional dessert works best when the rest of the day stays balanced with protein, fiber, and regular meals for you and your ${pregnancyLabel}.`,
      "Choose a small portion after lunch, and if you want a gentler swap, try yogurt with berries."
    ];
  }
  if (/coffee|caffeine|tea/.test(lower)) {
    return [
      `A small caffeine drink can fit for many pregnant people at Week ${data.week}.`,
      `With your ${Math.round(data.target)} kcal/day target and ${data.activity} routine, caffeine fits best as a small add-on rather than a meal replacement.`,
      "Keep it modest, and pair it with breakfast or a snack so it feels steadier."
    ];
  }
  return [
    `For Week ${data.week}, choose the option that helps you keep meals steady within your ${Math.round(data.target)} kcal/day target.`,
    `Your ${data.bmiCategory} pattern, pregnancy type, and meal preferences point toward balanced meals with protein, complex carbs, produce, and healthy fats.`,
    "Today, add one simple protein food to the meal you asked about and keep the portion comfortable."
  ];
}

function getProviderStatus() {
  if (process.env.OPENAI_API_KEY) {
    return {
      configured: true,
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      fallbackModel: process.env.OPENAI_FALLBACK_MODEL || "gpt-5.5",
      baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
    };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return {
      configured: true,
      provider: "anthropic",
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest"
    };
  }

  return {
    configured: false,
    provider: "none"
  };
}

function withSource(data, source, model) {
  return {
    source,
    model,
    diet: data.diet,
    exercise: data.exercise,
    tips: data.tips
  };
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  if (typeof request.body === "string") {
    return JSON.parse(request.body || "{}");
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function getOpenAIModels() {
  const primary = process.env.OPENAI_MODEL || "gpt-5.5";
  const fallback = process.env.OPENAI_FALLBACK_MODEL || primary;
  return Array.from(new Set([primary, fallback].filter(Boolean)));
}

function getOpenAIText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  if (data.output && Array.isArray(data.output)) {
    return data.output
      .flatMap((item) => Array.isArray(item.content) ? item.content : [])
      .map((part) => part.text || "")
      .join("\n")
      .trim();
  }
  return "";
}

function summarizeOpenAIResponse(data) {
  return JSON.stringify({
    status: data && data.status,
    error: data && data.error ? {
      code: data.error.code,
      type: data.error.type,
      message: data.error.message
    } : null,
    outputTypes: data && Array.isArray(data.output)
      ? data.output.map((item) => ({
        type: item.type,
        status: item.status,
        contentTypes: Array.isArray(item.content) ? item.content.map((part) => part.type) : []
      }))
      : []
  });
}

async function callOpenAIResponses(baseUrl, model, systemPrompt, userPrompt) {
  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      max_output_tokens: 2500,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "pregnancy_guidance",
          strict: true,
          schema: {
            type: "object",
            properties: {
              diet: {
                type: "array",
                items: { type: "string" }
              },
              exercise: {
                type: "array",
                items: { type: "string" }
              },
              tips: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["diet", "exercise", "tips"],
            additionalProperties: false
          }
        }
      }
    })
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`OpenAI Responses request failed with ${response.status}: ${text.slice(0, 300)}`);
  const data = JSON.parse(text);
  const outputText = getOpenAIText(data);
  if (!outputText) {
    throw new Error(`OpenAI Responses returned no output text: ${summarizeOpenAIResponse(data)}`);
  }
  try {
    return extractJson(outputText);
  } catch (error) {
    throw new Error(`OpenAI Responses returned non-JSON text: ${outputText.slice(0, 160)}`);
  }
}

async function callOpenAIQaResponses(baseUrl, model, systemPrompt, userPrompt) {
  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      max_output_tokens: 500,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "pregnancy_nutrition_qa",
          strict: true,
          schema: {
            type: "object",
            properties: {
              answer: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: { type: "string" }
              }
            },
            required: ["answer"],
            additionalProperties: false
          }
        }
      }
    })
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`OpenAI QA Responses request failed with ${response.status}: ${text.slice(0, 300)}`);
  const data = JSON.parse(text);
  const outputText = getOpenAIText(data);
  if (!outputText) throw new Error("OpenAI QA Responses returned no output text");
  return extractJson(outputText);
}

async function callOpenAIChat(baseUrl, model, systemPrompt, userPrompt) {
  const body = {
    model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  };
  if (!/^gpt-5/.test(model)) {
    body.temperature = 0.4;
  }
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`OpenAI Chat request failed with ${response.status}: ${text.slice(0, 300)}`);
  const data = JSON.parse(text);
  const content = data
    && data.choices
    && data.choices[0]
    && data.choices[0].message
    && data.choices[0].message.content;
  if (!content) {
    throw new Error(`OpenAI Chat returned no message content: ${text.slice(0, 300)}`);
  }
  return extractJson(content);
}

async function callOpenAIQaChat(baseUrl, model, systemPrompt, userPrompt) {
  const body = {
    model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  };
  if (!/^gpt-5/.test(model)) body.temperature = 0.2;
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`OpenAI QA Chat request failed with ${response.status}: ${text.slice(0, 300)}`);
  const data = JSON.parse(text);
  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error("OpenAI QA Chat returned no content");
  return extractJson(content);
}

async function callOpenAI(systemPrompt, userPrompt) {
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const errors = [];

  for (const model of getOpenAIModels()) {
    try {
      return {
        model,
        data: await callOpenAIResponses(baseUrl, model, systemPrompt, userPrompt)
      };
    } catch (responsesError) {
      errors.push(`${model} responses: ${responsesError.message}`);
      try {
        return {
          model,
          data: await callOpenAIChat(baseUrl, model, systemPrompt, userPrompt)
        };
      } catch (chatError) {
        errors.push(`${model} chat: ${chatError.message}`);
      }
    }
  }

  throw new Error(errors.join(" | "));
}

async function callOpenAIQa(systemPrompt, userPrompt) {
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const errors = [];
  for (const model of getOpenAIModels()) {
    try {
      return { model, data: await callOpenAIQaResponses(baseUrl, model, systemPrompt, userPrompt) };
    } catch (responsesError) {
      errors.push(`${model} qa responses: ${responsesError.message}`);
      try {
        return { model, data: await callOpenAIQaChat(baseUrl, model, systemPrompt, userPrompt) };
      } catch (chatError) {
        errors.push(`${model} qa chat: ${chatError.message}`);
      }
    }
  }
  throw new Error(errors.join(" | "));
}

async function callAnthropic(systemPrompt, userPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
      max_tokens: 1200,
      temperature: 0.4,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt }
      ]
    })
  });
  if (!response.ok) throw new Error(`Anthropic request failed with ${response.status}`);
  const data = await response.json();
  const text = data.content.map((part) => part.text || "").join("\n");
  return extractJson(text);
}

module.exports = async function handler(request, response) {
  if (request.method === "OPTIONS") {
    return send(response, 204, {});
  }

  if (request.method === "GET") {
    const url = new URL(request.url || "/api/pregnancy-guidance", "https://aipregnancycaloriecalculator.online");
    if (url.searchParams.get("currency") === "detect") {
      return send(response, 200, { ok: true, ...getDetectedCurrency(request) });
    }
    if (url.searchParams.get("currency") === "rates") {
      return send(response, 200, { ok: true, ...(await getExchangeRates()) });
    }
    return send(response, 200, {
      ok: true,
      endpoint: "/api/pregnancy-guidance",
      supportedLanguages: Object.keys(SUPPORTED_LANGUAGES),
      contract: {
        method: "POST",
        request: "{ lang, prompt, inputs, result } or { lang, requestMode: 'nutrition-qa', question, inputs, result }",
        response: "{ source, diet: string[], exercise: string[], tips: string[] } or { source, answer: string[3] }"
      },
      ...getProviderStatus()
    });
  }

  if (request.method !== "POST") {
    return send(response, 405, { error: "Method not allowed" });
  }

  try {
    const payload = await readJsonBody(request);
    const payloadLanguage = getPayloadLanguage(payload);
    if (!payloadLanguage) {
      return send(response, 400, {
        error: "Unsupported language",
        supportedLanguages: Object.keys(SUPPORTED_LANGUAGES)
      });
    }

    if (payload && payload.requestMode === "nutrition-qa") {
      const safeQaData = sanitizeQaPayload(payload);
      if (!safeQaData.question) return send(response, 400, { error: "Question is required" });
      const qaSystemPrompt = buildQaSystemPrompt(safeQaData.lang);
      const qaUserPrompt = buildQaUserPrompt(safeQaData);
      let qaResponse;
      let qaSource;
      let qaModel;
      try {
        if (process.env.OPENAI_API_KEY) {
          const openAIResult = await callOpenAIQa(qaSystemPrompt, qaUserPrompt);
          qaResponse = openAIResult.data;
          qaSource = "openai";
          qaModel = openAIResult.model;
        } else if (process.env.ANTHROPIC_API_KEY) {
          qaResponse = await callAnthropic(qaSystemPrompt, qaUserPrompt);
          qaSource = "anthropic";
          qaModel = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
        } else {
          return send(response, 200, { source: "local", model: "fallback", answer: localQaAnswer(safeQaData) });
        }
      } catch (qaError) {
        console.error("Pregnancy nutrition Q&A live generation failed:", String(qaError && qaError.message ? qaError.message : qaError));
        return send(response, 200, { source: "local", model: "fallback", answer: localQaAnswer(safeQaData) });
      }
      if (!isValidQaResponse(qaResponse)) {
        return send(response, 200, { source: "local", model: "fallback", answer: localQaAnswer(safeQaData) });
      }
      return send(response, 200, { source: qaSource, model: qaModel, answer: normalizeQaAnswer(qaResponse) });
    }

    const safeData = sanitizePayload(payload);
    const systemPrompt = buildSystemPrompt(safeData.lang);
    const userPrompt = buildUserPrompt(safeData);

    let aiResponse;
    let source;
    let model;
    if (process.env.OPENAI_API_KEY) {
      const openAIResult = await callOpenAI(systemPrompt, userPrompt);
      aiResponse = openAIResult.data;
      source = "openai";
      model = openAIResult.model;
    } else if (process.env.ANTHROPIC_API_KEY) {
      aiResponse = await callAnthropic(systemPrompt, userPrompt);
      source = "anthropic";
      model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
    } else {
      return send(response, 503, {
        error: "AI provider is not configured",
        help: "Set OPENAI_API_KEY or ANTHROPIC_API_KEY in Vercel environment variables. For OpenAI-compatible gateways, also set OPENAI_BASE_URL."
      });
    }

    if (!isValidAIResponse(aiResponse)) {
      return send(response, 502, { error: "AI response did not match the expected format" });
    }

    return send(response, 200, withSource(aiResponse, source, model));
  } catch (error) {
    console.error("Pregnancy guidance generation failed:", String(error && error.message ? error.message : error));
    return send(response, 500, {
      error: "AI guidance could not be generated",
      detail: process.env.NODE_ENV === "production" ? undefined : String(error && error.message ? error.message : error)
    });
  }
};
