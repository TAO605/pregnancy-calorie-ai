# Stage 9 Production Validation

Generated: 2026-05-21T01:39:53.257Z

Site: https://aipregnancycaloriecalculator.online
Deployment: https://delivery-5gevlw9hp-xutaos-projects-04f1c683.vercel.app
Vercel deployment id: dpl_4odVBTYab5gsVh3sLPStvpr1o96Q

Summary: 109/109 HTTP/deployment checks passed, 0 failed.
Browser summary: 2/2 passed, 0 failed.

## Key Results
- Production custom domain returns 200 for all 10 configured language homepages and 7 public page groups.
- Free mode is embedded in production HTML and enabled in Vercel Production environment variables.
- Paid routes return 301 redirects to the correct homepage or localized homepage.
- Payment APIs return 403 with `Payment system is temporarily disabled` in free mode.
- `/sitemap.xml` contains 70 public localized URLs and 0 paid URLs.
- `/robots.txt` allows crawling and points to the production sitemap.
- `/api/pregnancy-guidance` is configured for OpenAI-compatible `gpt-5.5` via `https://rkapi.com/v1`.
- Browser validation passed in Chromium for English and Arabic calculator/result flows with no console warnings/errors, no visible paid links, no blank buttons, and Arabic `dir=rtl`.

## Note
- Direct `*.vercel.app` fetches time out from this local network, but `vercel inspect` reports the deployment Ready and the aliased production custom domain passes all user-facing checks.
- Codex in-app browser plugin failed to start app-server on this machine; Playwright Chromium was used for equivalent browser validation.

## HTTP Checks
- PASS page:/: {"status":200,"bytes":470100}
- PASS free-flag:en: {"lang":"en"}
- PASS no-tailwind-cdn:en: {"lang":"en"}
- PASS page:/about: {"status":200,"bytes":17592}
- PASS page:/contact: {"status":200,"bytes":15674}
- PASS page:/medical-disclaimer: {"status":200,"bytes":16732}
- PASS page:/privacy-policy: {"status":200,"bytes":17421}
- PASS page:/terms-of-service: {"status":200,"bytes":17713}
- PASS page:/cookie-policy: {"status":200,"bytes":14352}
- PASS page:/es: {"status":200,"bytes":504961}
- PASS free-flag:es: {"lang":"es"}
- PASS no-tailwind-cdn:es: {"lang":"es"}
- PASS page:/es/about: {"status":200,"bytes":19005}
- PASS page:/es/contact: {"status":200,"bytes":16743}
- PASS page:/es/medical-disclaimer: {"status":200,"bytes":18078}
- PASS page:/es/privacy-policy: {"status":200,"bytes":19046}
- PASS page:/es/terms-of-service: {"status":200,"bytes":19253}
- PASS page:/es/cookie-policy: {"status":200,"bytes":15303}
- PASS page:/fr: {"status":200,"bytes":508188}
- PASS free-flag:fr: {"lang":"fr"}
- PASS no-tailwind-cdn:fr: {"lang":"fr"}
- PASS page:/fr/about: {"status":200,"bytes":19183}
- PASS page:/fr/contact: {"status":200,"bytes":16836}
- PASS page:/fr/medical-disclaimer: {"status":200,"bytes":18390}
- PASS page:/fr/privacy-policy: {"status":200,"bytes":19556}
- PASS page:/fr/terms-of-service: {"status":200,"bytes":19455}
- PASS page:/fr/cookie-policy: {"status":200,"bytes":15489}
- PASS page:/de: {"status":200,"bytes":505821}
- PASS free-flag:de: {"lang":"de"}
- PASS no-tailwind-cdn:de: {"lang":"de"}
- PASS page:/de/about: {"status":200,"bytes":18908}
- PASS page:/de/contact: {"status":200,"bytes":16443}
- PASS page:/de/medical-disclaimer: {"status":200,"bytes":18039}
- PASS page:/de/privacy-policy: {"status":200,"bytes":18664}
- PASS page:/de/terms-of-service: {"status":200,"bytes":19236}
- PASS page:/de/cookie-policy: {"status":200,"bytes":15088}
- PASS page:/pt: {"status":200,"bytes":504690}
- PASS free-flag:pt: {"lang":"pt"}
- PASS no-tailwind-cdn:pt: {"lang":"pt"}
- PASS page:/pt/about: {"status":200,"bytes":18576}
- PASS page:/pt/contact: {"status":200,"bytes":16243}
- PASS page:/pt/medical-disclaimer: {"status":200,"bytes":17657}
- PASS page:/pt/privacy-policy: {"status":200,"bytes":18523}
- PASS page:/pt/terms-of-service: {"status":200,"bytes":18767}
- PASS page:/pt/cookie-policy: {"status":200,"bytes":15051}
- PASS page:/it: {"status":200,"bytes":506777}
- PASS free-flag:it: {"lang":"it"}
- PASS no-tailwind-cdn:it: {"lang":"it"}
- PASS page:/it/about: {"status":200,"bytes":19083}
- PASS page:/it/contact: {"status":200,"bytes":16710}
- PASS page:/it/medical-disclaimer: {"status":200,"bytes":18130}
- PASS page:/it/privacy-policy: {"status":200,"bytes":18906}
- PASS page:/it/terms-of-service: {"status":200,"bytes":19158}
- PASS page:/it/cookie-policy: {"status":200,"bytes":15446}
- PASS page:/ru: {"status":200,"bytes":505515}
- PASS free-flag:ru: {"lang":"ru"}
- PASS no-tailwind-cdn:ru: {"lang":"ru"}
- PASS page:/ru/about: {"status":200,"bytes":19132}
- PASS page:/ru/contact: {"status":200,"bytes":16612}
- PASS page:/ru/medical-disclaimer: {"status":200,"bytes":18176}
- PASS page:/ru/privacy-policy: {"status":200,"bytes":19084}
- PASS page:/ru/terms-of-service: {"status":200,"bytes":19386}
- PASS page:/ru/cookie-policy: {"status":200,"bytes":15351}
- PASS page:/ar: {"status":200,"bytes":500129}
- PASS free-flag:ar: {"lang":"ar"}
- PASS no-tailwind-cdn:ar: {"lang":"ar"}
- PASS arabic-rtl-html: {}
- PASS page:/ar/about: {"status":200,"bytes":17880}
- PASS page:/ar/contact: {"status":200,"bytes":15814}
- PASS page:/ar/medical-disclaimer: {"status":200,"bytes":17046}
- PASS page:/ar/privacy-policy: {"status":200,"bytes":17664}
- PASS page:/ar/terms-of-service: {"status":200,"bytes":17882}
- PASS page:/ar/cookie-policy: {"status":200,"bytes":14769}
- PASS page:/ja: {"status":200,"bytes":485405}
- PASS free-flag:ja: {"lang":"ja"}
- PASS no-tailwind-cdn:ja: {"lang":"ja"}
- PASS page:/ja/about: {"status":200,"bytes":15684}
- PASS page:/ja/contact: {"status":200,"bytes":14506}
- PASS page:/ja/medical-disclaimer: {"status":200,"bytes":14844}
- PASS page:/ja/privacy-policy: {"status":200,"bytes":15289}
- PASS page:/ja/terms-of-service: {"status":200,"bytes":15557}
- PASS page:/ja/cookie-policy: {"status":200,"bytes":13257}
- PASS page:/ko: {"status":200,"bytes":486542}
- PASS free-flag:ko: {"lang":"ko"}
- PASS no-tailwind-cdn:ko: {"lang":"ko"}
- PASS page:/ko/about: {"status":200,"bytes":15767}
- PASS page:/ko/contact: {"status":200,"bytes":14501}
- PASS page:/ko/medical-disclaimer: {"status":200,"bytes":15033}
- PASS page:/ko/privacy-policy: {"status":200,"bytes":15341}
- PASS page:/ko/terms-of-service: {"status":200,"bytes":15552}
- PASS page:/ko/cookie-policy: {"status":200,"bytes":13174}
- PASS paid-redirect:/pricing: {"status":301,"location":"/"}
- PASS paid-redirect:/premium: {"status":301,"location":"/"}
- PASS paid-redirect:/refund-policy: {"status":301,"location":"/"}
- PASS paid-redirect:/checkout/test: {"status":301,"location":"/"}
- PASS paid-redirect:/billing: {"status":301,"location":"/"}
- PASS paid-redirect:/subscription-success: {"status":301,"location":"/"}
- PASS paid-redirect:/subscription-canceled: {"status":301,"location":"/"}
- PASS paid-redirect:/ar/pricing: {"status":301,"location":"/ar/"}
- PASS paid-redirect:/ar/checkout/test: {"status":301,"location":"/ar/"}
- PASS paid-redirect:/es/billing: {"status":301,"location":"/es/"}
- PASS sitemap-public-urls: {"status":200,"locCount":70}
- PASS sitemap-no-paid-urls: {"paidCount":0,"paid":[]}
- PASS robots: {"status":200,"body":"User-agent: *\nAllow: /\nSitemap: https://aipregnancycaloriecalculator.online/sitemap.xml\n"}
- PASS pregnancy-guidance-api: {"status":200,"provider":"openai","model":"gpt-5.5","baseUrl":"https://rkapi.com/v1"}
- PASS payment-api-disabled:/api/subscription/create-checkout-session: {"status":403,"body":"{\"ok\":false,\"allFeaturesFree\":true,\"error\":\"Payment system is temporarily disabled\"}"}
- PASS payment-api-disabled:/api/subscription/create-portal-session: {"status":403,"body":"{\"ok\":false,\"allFeaturesFree\":true,\"error\":\"Payment system is temporarily disabled\"}"}
- PASS payment-api-disabled:/api/subscription/webhook: {"status":403,"body":"{\"ok\":false,\"allFeaturesFree\":true,\"error\":\"Payment system is temporarily disabled\"}"}
- PASS deployment-inspect-ready: {"deploymentId":"dpl_4odVBTYab5gsVh3sLPStvpr1o96Q","deploymentUrl":"https://delivery-5gevlw9hp-xutaos-projects-04f1c683.vercel.app","status":"Ready by Vercel inspect","aliases":["https://aipregnancycaloriecalculator.online","https://www.aipregnancycaloriecalculator.online","https://delivery-umber-psi.vercel.app"],"note":"Direct *.vercel.app HTTPS fetch times out from this local network, but Vercel inspect reports Ready and custom production domain passed HTTP validation."}

## Browser Checks
- PASS en: {"beforeCheck":{"dir":"ltr","lang":"en-US","allFeaturesFree":"true","buttonCount":25,"blankButtons":[],"paidLinks":[],"horizontalOverflow":false,"calculateText":"Calculate My Calories"},"resultCheck":{"resultVisible":true,"calorieText":"2,180 kcal","premiumVisible":false},"logs":[]}
- PASS ar: {"beforeCheck":{"dir":"rtl","lang":"ar","allFeaturesFree":"true","buttonCount":25,"blankButtons":[],"paidLinks":[],"horizontalOverflow":false,"calculateText":"احسبي سعراتك"},"resultCheck":{"resultVisible":true,"calorieText":"2,180 كيلو كالوري","premiumVisible":false},"logs":[]}
