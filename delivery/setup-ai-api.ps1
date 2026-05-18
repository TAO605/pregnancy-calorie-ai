param(
  [ValidateSet("openai", "anthropic")]
  [string]$Provider = "openai",
  [switch]$LocalOnly
)

$ErrorActionPreference = "Stop"

function ConvertTo-PlainText {
  param([Security.SecureString]$Secure)
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
  try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

Set-Location -LiteralPath $PSScriptRoot

Write-Host "AI API setup for pregnancy-guidance proxy"
Write-Host "Keys are written to .env.local and, unless -LocalOnly is used, uploaded to Vercel env."

$secureKey = Read-Host "Paste your $Provider API key" -AsSecureString
$apiKey = ConvertTo-PlainText $secureKey

if ([string]::IsNullOrWhiteSpace($apiKey)) {
  throw "API key cannot be empty."
}

$envLines = @()

if ($Provider -eq "openai") {
  $model = Read-Host "OpenAI model (press Enter for gpt-4o-mini)"
  if ([string]::IsNullOrWhiteSpace($model)) { $model = "gpt-4o-mini" }
  $baseUrl = Read-Host "OpenAI-compatible base URL (press Enter for official OpenAI)"
  $envLines += "OPENAI_API_KEY=$apiKey"
  $envLines += "OPENAI_MODEL=$model"
  if (-not [string]::IsNullOrWhiteSpace($baseUrl)) {
    $envLines += "OPENAI_BASE_URL=$baseUrl"
  }
} else {
  $model = Read-Host "Anthropic model (press Enter for claude-3-5-haiku-latest)"
  if ([string]::IsNullOrWhiteSpace($model)) { $model = "claude-3-5-haiku-latest" }
  $envLines += "ANTHROPIC_API_KEY=$apiKey"
  $envLines += "ANTHROPIC_MODEL=$model"
}

Set-Content -LiteralPath ".env.local" -Value $envLines -Encoding UTF8
Write-Host "Wrote local env file: $PSScriptRoot\.env.local"

if ($LocalOnly) {
  Write-Host "LocalOnly selected. Skipping Vercel env upload."
  exit 0
}

$vercelCommand = "vercel"
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) {
  $npx = Get-Command npx -ErrorAction SilentlyContinue
  if ($npx) {
    $vercelCommand = "npx vercel"
    Write-Host "Global Vercel CLI was not found. Falling back to: npx vercel"
  } else {
    Write-Host "Vercel CLI and npx were not found. Copy .env.local values into this project manually:"
    Write-Host "https://vercel.com/xutaos-projects-04f1c683/delivery/settings/environment-variables"
    exit 0
  }
}

function Add-VercelEnv {
  param(
    [string]$Name,
    [string]$Value
  )
  $tmp = New-TemporaryFile
  try {
    Set-Content -LiteralPath $tmp.FullName -Value $Value -NoNewline -Encoding UTF8
    foreach ($target in @("production", "preview", "development")) {
      cmd /c "$vercelCommand env rm $Name $target -y >nul 2>nul"
      cmd /c "$vercelCommand env add $Name $target < `"$($tmp.FullName)`""
      if ($LASTEXITCODE -ne 0) {
        throw "Vercel env add failed for $Name $target. Run 'npx vercel login' and try again, or set it manually at https://vercel.com/xutaos-projects-04f1c683/delivery/settings/environment-variables"
      }
    }
  } finally {
    Remove-Item -LiteralPath $tmp.FullName -Force -ErrorAction SilentlyContinue
  }
}

foreach ($line in $envLines) {
  $parts = $line.Split("=", 2)
  Add-VercelEnv -Name $parts[0] -Value $parts[1]
}

Write-Host "Vercel env variables added for production, preview, and development."
Write-Host "Redeploy the delivery project, then open /api/pregnancy-guidance and confirm configured=true."
