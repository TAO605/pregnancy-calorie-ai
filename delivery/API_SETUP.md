# AI API Setup

The static page never stores API keys in `index.html`. It calls the same-domain serverless proxy:

```text
POST /api/pregnancy-guidance
```

## Easiest Setup

Run the local setup script from PowerShell:

```powershell
cd D:\pregnancy-calorie-ai\delivery
powershell -ExecutionPolicy Bypass -File .\setup-ai-api.ps1 -Provider openai
```

For Claude:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup-ai-api.ps1 -Provider anthropic
```

The script writes `.env.local` and, if Vercel CLI is installed and logged in, uploads the variables to Vercel production, preview, and development environments.

This project is linked to:

```text
https://vercel.com/xutaos-projects-04f1c683/delivery
```

Manual environment variable page:

```text
https://vercel.com/xutaos-projects-04f1c683/delivery/settings/environment-variables
```

If global `vercel` is not installed, the script will try `npx vercel` automatically.

## Health Check

Open this URL after deployment:

```text
https://your-domain.com/api/pregnancy-guidance
```

Expected configured response:

```json
{
  "ok": true,
  "configured": true,
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

If `configured` is `false`, add one provider key in Vercel environment variables.

## Vercel Environment Variables

OpenAI:

```text
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

OpenAI-compatible gateway:

```text
OPENAI_API_KEY=your_gateway_key
OPENAI_BASE_URL=https://api.your-provider.com/v1
OPENAI_MODEL=your_model_name
```

RKAPI example:

```text
OPENAI_API_KEY=your_rkapi_token
OPENAI_BASE_URL=https://rkapi.com/v1
OPENAI_MODEL=gpt-5.5
```

Anthropic:

```text
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-haiku-latest
```

## Request Contract

```json
{
  "prompt": "optional front-end prompt",
  "inputs": {
    "age": 30,
    "week": 20,
    "pregnancyType": "singleton",
    "activity": 1.375,
    "customNeeds": ["nausea"]
  },
  "result": {
    "target": 2160,
    "low": 2060,
    "high": 2260,
    "bmiValue": 22,
    "bmiCategory": "BMI 18.5-24.9",
    "weightGain": "25-35 lb (11.5-16 kg)",
    "protein": 108,
    "carbs": 270,
    "fat": 72
  }
}
```

## Response Contract

```json
{
  "source": "openai",
  "diet": ["..."],
  "exercise": ["..."],
  "tips": ["..."]
}
```

The production page requires live AI by default. If the API is not configured, the AI modules show a setup message instead of pretending local text is live AI.

For internal demos only, you can set this before the main script:

```html
<script>window.PREGNANCY_AI_REQUIRE_LIVE = false;</script>
```
