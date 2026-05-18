import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

const promptFiles = [
  "src/lib/i18n/contextual-ai-prompts.ts",
  "src/lib/i18n/dashboard-weekly-checkin-prompt.ts",
  "src/lib/i18n/meal-weekly-review-prompt.ts",
  "src/lib/i18n/weight-weekly-review-prompt.ts",
  "src/lib/i18n/weight-ai-prompt.ts",
  "src/lib/i18n/blog-ai-prompt.ts",
];

const nonAsciiPattern = /[^\x00-\x7F]/;
const unicodeChineseEscapePattern =
  /\\u(?:4[\da-f]{3}|5[\da-f]{3}|6[\da-f]{3}|7[\da-f]{3}|8[\da-f]{3}|9[\da-f]{3})/i;
const mojibakeOutputPattern = /[\u93b4\u7487\u7ed7\u4fd9\u951b\u9286\u95b9\ufffd]/;

function loadPromptModule(file) {
  const absolutePath = path.join(rootDir, file);
  const source = readFileSync(absolutePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: absolutePath,
  }).outputText;
  const context = {
    exports: {},
    module: { exports: {} },
    require,
  };

  vm.runInNewContext(output, context, {
    filename: absolutePath,
  });

  return {
    ...context.exports,
    ...context.module.exports,
  };
}

function assertReadableChinesePrompt(label, value, expectedParts) {
  if (typeof value !== "string" || value.length < 20) {
    throw new Error(`${label} did not return a useful prompt string.`);
  }

  if (mojibakeOutputPattern.test(value)) {
    throw new Error(`${label} returned likely mojibake output.`);
  }

  for (const part of expectedParts) {
    if (!value.includes(part)) {
      throw new Error(`${label} output is missing expected Chinese text: ${part}`);
    }
  }
}

for (const file of promptFiles) {
  const absolutePath = path.join(rootDir, file);
  const source = readFileSync(absolutePath, "utf8");

  if (nonAsciiPattern.test(source)) {
    throw new Error(
      `${file} contains non-ASCII prompt text. Use Unicode escapes for localized prompt strings.`,
    );
  }

  if (!unicodeChineseEscapePattern.test(source)) {
    throw new Error(`${file} does not contain escaped readable Chinese prompt text.`);
  }
}

const contextualPrompts = loadPromptModule("src/lib/i18n/contextual-ai-prompts.ts");
assertReadableChinesePrompt(
  "buildOverviewAiPrompt zh-CN",
  contextualPrompts.buildOverviewAiPrompt("zh-CN", {
    targetCalories: 2200,
    loggedCalories: 1400,
    remainingCalories: 800,
  }),
  ["\u6211\u4eca\u5929\u7684\u76ee\u6807", "\u52a0\u9910", "\u66f4\u7a33\u59a5"],
);
assertReadableChinesePrompt(
  "buildMealsAiPrompt zh-CN",
  contextualPrompts.buildMealsAiPrompt("zh-CN", {
    targetCalories: 2200,
    loggedCalories: 1400,
    remainingCalories: 800,
  }),
  ["\u65e9\u9910", "\u665a\u9910", "\u996e\u98df"],
);
assertReadableChinesePrompt(
  "buildResultAiPrompt zh-CN",
  contextualPrompts.buildResultAiPrompt("zh-CN", {
    recommendedCalories: 2200,
    source: "ACOG",
  }),
  ["\u8ba1\u7b97\u7ed3\u679c", "\u4e09\u9910", "\u6bcf\u9910"],
);

const dashboardPrompt = loadPromptModule(
  "src/lib/i18n/dashboard-weekly-checkin-prompt.ts",
);
assertReadableChinesePrompt(
  "buildDashboardWeeklyCheckInPrompt zh-CN",
  dashboardPrompt.buildDashboardWeeklyCheckInPrompt("zh-CN", {
    targetCalories: 2200,
    trackedMealDays: 5,
    averageLoggedCalories: 1900,
    latestWeightKg: 63,
    weightTrendDeltaKg: 0.4,
    gestationalWeek: 22,
    guidelineSource: "ACOG",
  }),
  ["\u5b55\u671f\u8bb0\u5f55", "\u8fd9\u4e00\u5468", "\u533b\u751f"],
);

const mealPrompt = loadPromptModule("src/lib/i18n/meal-weekly-review-prompt.ts");
assertReadableChinesePrompt(
  "buildMealWeeklyReviewPrompt zh-CN",
  mealPrompt.buildMealWeeklyReviewPrompt("zh-CN", {
    targetCalories: 2200,
    trackedDays: 5,
    averageLoggedCalories: 1900,
    topMealTypeLabel: "\u5348\u9910",
    totalEntries: 12,
    gestationalWeek: 22,
    guidelineSource: "ACOG",
  }),
  ["\u996e\u98df\u8bb0\u5f55", "\u9910\u6b21\u7ed3\u6784", "\u63a5\u4e0b\u6765 3 \u5929"],
);

const weightPrompt = loadPromptModule("src/lib/i18n/weight-weekly-review-prompt.ts");
assertReadableChinesePrompt(
  "buildWeightWeeklyReviewPrompt zh-CN",
  weightPrompt.buildWeightWeeklyReviewPrompt("zh-CN", {
    targetCalories: 2200,
    trackedEntries: 4,
    latestWeightKg: 63,
    weeklyDeltaKg: 0.4,
    weeklyMinKg: 62.6,
    weeklyMaxKg: 63,
    gestationalWeek: 22,
    guidelineSource: "ACOG",
  }),
  ["\u4f53\u91cd\u8bb0\u5f55", "\u8fd9\u7ec4\u8d8b\u52bf", "\u8425\u517b\u5e08"],
);

const weightSummaryPrompt = loadPromptModule("src/lib/i18n/weight-ai-prompt.ts");
assertReadableChinesePrompt(
  "buildWeightAiPrompt zh-CN",
  weightSummaryPrompt.buildWeightAiPrompt("zh-CN", {
    summary: {
      currentWeightKg: 63,
      recentWeightCount: 4,
      recentTrendDeltaKg: 0.6,
      prePregnancyWeightKg: 60,
      prePregnancyDeltaKg: 3,
      gestationalWeek: 22,
    },
    targetCalories: 2200,
  }),
  ["\u4f53\u91cd\u5927\u7ea6", "\u70ed\u91cf\u76ee\u6807", "\u4e0b\u4e00\u6b65"],
);

const blogPrompt = loadPromptModule("src/lib/i18n/blog-ai-prompt.ts");
assertReadableChinesePrompt(
  "buildBlogAiPrompt zh-CN",
  blogPrompt.buildBlogAiPrompt("zh-CN", {
    title: "\u5b55\u671f\u7ea4\u7ef4\u548c\u8865\u6c34\u6307\u5357",
    description: "\u5982\u4f55\u66f4\u7a33\u59a5\u5730\u5b89\u6392\u996e\u98df\u8282\u594f\u3002",
  }),
  ["\u5b55\u671f\u8425\u517b\u6587\u7ae0", "\u4e0b\u4e00\u6b65\u5efa\u8bae", "\u533b\u751f"],
);

console.log("Prompt encoding check passed.");
