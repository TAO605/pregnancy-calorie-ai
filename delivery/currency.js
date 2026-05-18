(function () {
  const COOKIE_NAME = "pcc_currency";
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
  const SUPPORTED = [
    { code: "USD", symbol: "$", label: "United States", locale: "en-US" },
    { code: "EUR", symbol: "€", label: "European Union", locale: "de-DE" },
    { code: "GBP", symbol: "£", label: "United Kingdom", locale: "en-GB" },
    { code: "CAD", symbol: "C$", label: "Canada", locale: "en-CA" },
    { code: "AUD", symbol: "A$", label: "Australia", locale: "en-AU" }
  ];
  const FALLBACK_RATES = { USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.37, AUD: 1.52 };
  const NOTE_TEXT = "Prices shown in local currency for reference only. You will be charged in USD.";

  let currentCurrency = "USD";
  let rates = { ...FALLBACK_RATES };

  function ensureCurrencyStyles() {
    if (document.getElementById("pccCurrencyStyles")) return;
    const style = document.createElement("style");
    style.id = "pccCurrencyStyles";
    style.textContent = `
      .currency-switcher{position:relative;display:inline-flex;align-items:center;justify-content:center;font-family:inherit}
      .currency-switcher-button{display:inline-flex;min-height:48px;align-items:center;justify-content:center;gap:8px;border:0;border-radius:0;background:transparent;color:#666666!important;font:inherit;font-size:14px;font-weight:900;line-height:1;padding:0;white-space:nowrap;box-shadow:none;transition:color 180ms ease,transform 180ms ease}
      .currency-switcher-button span[aria-hidden="true"]{display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center;color:currentColor;font-size:16px;line-height:1}
      .currency-switcher-button:hover,.currency-switcher-button:focus{color:#9d4edd!important;outline:none;transform:translateY(-1px)}
      .currency-switcher-menu{position:absolute;top:calc(100% + 10px);right:0;z-index:100;display:none;width:230px;border:1px solid var(--line,#e7d9e0);border-radius:18px;background:var(--surface,#fff);box-shadow:0 22px 60px rgba(47,41,45,.16);padding:8px}
      .currency-switcher.is-open .currency-switcher-menu{display:grid;gap:2px}
      .currency-option{display:flex;width:100%;min-height:40px;align-items:center;border:0;border-radius:12px;background:transparent;color:var(--text,#2f292d);font:inherit;font-size:14px;font-weight:850;text-align:left;padding:0 12px}
      .currency-option:hover,.currency-option:focus{background:var(--surface-soft,var(--soft,#fff7fa));outline:none}
      .currency-option.is-active{background:var(--primary-soft,var(--soft,#fff7fa));color:var(--primary-strong,var(--strong,#935473))}
      .currency-note{display:block;margin-top:8px;color:var(--muted,#6f636a);font-size:12px;font-weight:750;line-height:1.35}
      html[dir="rtl"] .currency-switcher-menu{right:auto;left:0}
      html[dir="rtl"] .currency-option{text-align:right}
    `;
    document.head.appendChild(style);
  }

  function readCookie(name) {
    return document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(name + "="))?.split("=")[1] || "";
  }

  function writeCookie(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value) + "; Max-Age=" + COOKIE_MAX_AGE + "; Path=/; SameSite=Lax";
  }

  function getCurrency(code) {
    return SUPPORTED.find((currency) => currency.code === code) || SUPPORTED[0];
  }

  function normalizeCurrency(code) {
    const normalized = String(code || "").toUpperCase();
    return SUPPORTED.some((currency) => currency.code === normalized) ? normalized : "USD";
  }

  function formatPrice(amountUsd, code) {
    const currency = getCurrency(code);
    const converted = Number(amountUsd) * (rates[code] || 1);
    return currency.symbol + converted.toLocaleString(currency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function updatePrices() {
    document.querySelectorAll("[data-price-usd]").forEach((node) => {
      const amount = Number(node.getAttribute("data-price-usd") || "0");
      const period = node.getAttribute("data-price-period") || "";
      node.textContent = formatPrice(amount, currentCurrency) + period;
    });
    document.querySelectorAll("[data-usd-charge-note]").forEach((node) => {
      node.textContent = NOTE_TEXT;
    });
    document.querySelectorAll("[data-currency-current]").forEach((node) => {
      node.textContent = currentCurrency;
    });
    document.querySelectorAll("[data-currency-option]").forEach((node) => {
      const active = node.getAttribute("data-currency-option") === currentCurrency;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-checked", String(active));
    });
  }

  function renderCurrencySwitchers() {
    document.querySelectorAll("[data-currency-switcher]").forEach((container) => {
      const id = "currencyMenu-" + (container.dataset.location || "site");
      const options = SUPPORTED.map((currency) => {
        const activeClass = currency.code === currentCurrency ? " is-active" : "";
        return "<button class=\"currency-option" + activeClass + "\" type=\"button\" role=\"menuitemradio\" aria-checked=\"" + (currency.code === currentCurrency ? "true" : "false") + "\" data-currency-option=\"" + currency.code + "\">" + currency.code + " " + currency.symbol + " - " + currency.label + "</button>";
      }).join("");
      container.innerHTML =
        "<button class=\"currency-switcher-button tap\" type=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\" aria-controls=\"" + id + "\">" +
        "<span aria-hidden=\"true\">$</span><span data-currency-current>" + currentCurrency + "</span>" +
        "</button><div id=\"" + id + "\" class=\"currency-switcher-menu\" role=\"menu\">" + options + "</div>";
    });
  }

  function closeCurrencySwitchers(exceptContainer) {
    document.querySelectorAll("[data-currency-switcher]").forEach((container) => {
      if (container === exceptContainer) return;
      container.classList.remove("is-open");
      const button = container.querySelector(".currency-switcher-button");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  async function loadRates() {
    try {
      const response = await fetch("/api/pregnancy-guidance?currency=rates", { credentials: "same-origin" });
      const data = await response.json();
      if (data && data.rates) rates = { ...FALLBACK_RATES, ...data.rates };
    } catch (error) {
      rates = { ...FALLBACK_RATES };
    }
  }

  async function detectCurrency() {
    const saved = normalizeCurrency(decodeURIComponent(readCookie(COOKIE_NAME) || ""));
    if (readCookie(COOKIE_NAME)) return saved;
    try {
      const response = await fetch("/api/pregnancy-guidance?currency=detect", { credentials: "same-origin" });
      const data = await response.json();
      return normalizeCurrency(data.currency || "USD");
    } catch (error) {
      return "USD";
    }
  }

  async function initCurrencySystem() {
    ensureCurrencyStyles();
    await loadRates();
    currentCurrency = await detectCurrency();
    writeCookie(COOKIE_NAME, currentCurrency);
    renderCurrencySwitchers();
    updatePrices();

    document.addEventListener("click", (event) => {
      const option = event.target.closest("[data-currency-option]");
      if (option) {
        currentCurrency = normalizeCurrency(option.getAttribute("data-currency-option"));
        writeCookie(COOKIE_NAME, currentCurrency);
        updatePrices();
        closeCurrencySwitchers();
        return;
      }

      const button = event.target.closest(".currency-switcher-button");
      const switcher = event.target.closest("[data-currency-switcher]");
      if (button && switcher) {
        event.preventDefault();
        const isOpen = switcher.classList.toggle("is-open");
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        closeCurrencySwitchers(switcher);
      } else if (!switcher) {
        closeCurrencySwitchers();
      }
    });
  }

  window.PregnancyCurrency = {
    init: initCurrencySystem,
    formatPrice,
    get current() {
      return currentCurrency;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCurrencySystem, { once: true });
  } else {
    initCurrencySystem();
  }
})();
