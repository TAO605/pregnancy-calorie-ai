const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const deliveryDir = path.join(root, "delivery");

function loadProductionEnv() {
  const file = path.join(root, ".env.production");
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equals = trimmed.indexOf("=");
    if (equals < 0) continue;
    const key = trimmed.slice(0, equals).trim();
    const value = trimmed.slice(equals + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function listHtmlFiles(dir) {
  const output = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".next") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...listHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      output.push(fullPath);
    }
  }
  return output;
}

function injectHtmlFlag(html, enabled) {
  const value = enabled ? "true" : "false";
  if (/<html\b[^>]*\bdata-all-features-free="/i.test(html)) {
    return html.replace(/\bdata-all-features-free="[^"]*"/i, `data-all-features-free="${value}"`);
  }
  return html.replace(/<html\b([^>]*)>/i, `<html$1 data-all-features-free="${value}">`);
}

function paidRouteDestination(pathname) {
  const normalized = pathname.replace(/\\/g, "/").toLowerCase();
  const match = normalized.match(/(?:^|\/)(es|fr|de|pt|it|ru|ar|ja|ko)\/(?:pricing|premium|refund-policy|billing|subscription-success|subscription-canceled|checkout)(?:\/|\/index\.html|$)/);
  if (match) return `/${match[1]}/`;
  if (/(?:^|\/)(pricing|premium|refund-policy|billing|subscription-success|subscription-canceled|checkout)(?:\.html|\/index\.html|\/|$)/.test(normalized)) return "/";
  return null;
}

function injectGuard(html, filePath) {
  const redirectTarget = paidRouteDestination(path.relative(deliveryDir, filePath));
  const guard = `<style id="all-features-free-guard">
html[data-all-features-free="true"] .subscription-teaser,
html[data-all-features-free="true"] .premium-result-card,
html[data-all-features-free="true"] .premium-account-badge,
html[data-all-features-free="true"] .premium-upgrade-button,
html[data-all-features-free="true"] .premium-manage-button,
html[data-all-features-free="true"] .plan-card,
html[data-all-features-free="true"] .pricing-grid,
html[data-all-features-free="true"] .pricing-currency-row,
html[data-all-features-free="true"] .guarantee,
html[data-all-features-free="true"] .guarantee-note,
html[data-all-features-free="true"] [data-usd-charge-note],
html[data-all-features-free="true"] [data-checkout-plan],
html[data-all-features-free="true"] a[href*="/pricing"],
html[data-all-features-free="true"] a[href*="pricing.html"],
html[data-all-features-free="true"] a[href*="/premium"],
html[data-all-features-free="true"] a[href*="premium.html"],
html[data-all-features-free="true"] a[href*="/refund-policy"],
html[data-all-features-free="true"] a[href*="refund-policy.html"],
html[data-all-features-free="true"] a[href*="/checkout"],
html[data-all-features-free="true"] a[href*="/billing"],
html[data-all-features-free="true"] a[href*="/subscription-success"],
html[data-all-features-free="true"] a[href*="/subscription-canceled"] {
  display: none !important;
}
</style>`;
  const copyGuard = `<script id="all-features-free-paid-copy-guard">
(function(){
  if (document.documentElement.dataset.allFeaturesFree !== "true") return;
  function prunePaidCopy(){
    var paidPattern = /\\b(Pricing|Premium|Subscribe|subscription|checkout|Unlock|Upgrade|Buy Now|Start Free Trial|Stripe|billing|payment|paid|price|prices|refund|money-back|charged in USD)\\b|\\$7\\.99|\\$79\\.99|\\b(Precios?|suscripci[oó]n|facturaci[oó]n|pago|reembolso)\\b|\\b(Prix|abonnement|facturation|paiement|remboursement)\\b|\\b(Preis|Preise|Abonnement|Zahlung|R[üu]ckerstattung|Erstattung)\\b|\\b(Pre[cç]os?|assinatura|faturamento|pagamento|reembolso)\\b|\\b(Prezzi?|abbonamento|fatturazione|pagamento|rimborso)\\b|подпис|оплат|плат[её]ж|возврат|премиум|цены|الأسعار|الاشتراك|الدفع|الفواتير|استرداد|返金|価格|料金|支払い|サブスクリプション|プレミアム|환불|가격|요금|결제|구독|프리미엄/i;
    var selectors = [
      "p",
      "li",
      "a",
      "button",
      "h2",
      "h3",
      "small",
      ".currency-note",
      ".support-card",
      ".guarantee",
      ".guarantee-note",
      ".premium-result-card",
      ".subscription-teaser",
      ".premium-account-badge",
      ".premium-upgrade-button",
      ".premium-manage-button"
    ].join(",");
    document.querySelectorAll(selectors).forEach(function(element){
      var text = (element.innerText || element.textContent || "").trim();
      if (text && paidPattern.test(text)) element.hidden = true;
    });
    document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(function(element){
      var placeholder = element.getAttribute("placeholder") || "";
      if (!paidPattern.test(placeholder)) return;
      element.setAttribute("placeholder", placeholder.replace(/\\bBilling,?\\s*/i, "").replace(/\\bsubscription,?\\s*/i, "").replace(/\\bpayment,?\\s*/i, "").replace(/\\s{2,}/g, " ").replace(/^,\\s*/, "").trim());
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", prunePaidCopy, { once: true });
  else prunePaidCopy();
}());
</script>`;
  const redirect = redirectTarget
    ? `<script id="all-features-free-paid-route-redirect">(function(){if(document.documentElement.dataset.allFeaturesFree==="true"){window.location.replace("${redirectTarget}");}}());</script>`
    : "";
  const block = `${guard}${copyGuard}${redirect}`;

  if (html.includes('id="all-features-free-guard"')) {
    html = html.replace(/<style id="all-features-free-guard">[\s\S]*?<\/style>/, guard);
  } else {
    html = html.replace("</head>", `${block}\n</head>`);
  }

  if (html.includes('id="all-features-free-paid-copy-guard"')) {
    html = html.replace(/<script id="all-features-free-paid-copy-guard">[\s\S]*?<\/script>/, copyGuard);
  } else {
    html = html.replace("</head>", `${copyGuard}\n</head>`);
  }

  if (redirect && html.includes('id="all-features-free-paid-route-redirect"')) {
    html = html.replace(/<script id="all-features-free-paid-route-redirect">[\s\S]*?<\/script>/, redirect);
  } else if (redirect) {
    html = html.replace("</head>", `${redirect}\n</head>`);
  }

  if (!redirect) {
    html = html.replace(/<script id="all-features-free-paid-route-redirect">[\s\S]*?<\/script>/, "");
  }

  return html;
}

function injectRuntimeFlag(html, enabled) {
  const value = enabled ? "true" : "false";
  return html.replace(/\bconst ALL_FEATURES_FREE = (?:true|false);/g, `const ALL_FEATURES_FREE = ${value};`);
}

loadProductionEnv();

const enabled = process.env.NEXT_PUBLIC_ALL_FEATURES_FREE === "true";
let changed = 0;

for (const file of listHtmlFiles(deliveryDir)) {
  const before = fs.readFileSync(file, "utf8");
  let after = injectHtmlFlag(before, enabled);
  after = injectRuntimeFlag(after, enabled);
  after = injectGuard(after, file);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed += 1;
  }
}

const sitemapFile = path.join(deliveryDir, "sitemap.xml");
if (enabled && fs.existsSync(sitemapFile)) {
  const before = fs.readFileSync(sitemapFile, "utf8");
  const after = before.replace(/\s*<url>[\s\S]*?<loc>[^<]*(?:\/pricing|\/premium|\/refund-policy|\/checkout|\/billing|\/subscription-success|\/subscription-canceled)[^<]*<\/loc>[\s\S]*?<\/url>/gi, "");
  if (after !== before) {
    fs.writeFileSync(sitemapFile, after, "utf8");
    changed += 1;
  }
}

console.log(`Applied delivery free-mode guard to ${changed} HTML file(s). allFeaturesFree=${enabled}`);
