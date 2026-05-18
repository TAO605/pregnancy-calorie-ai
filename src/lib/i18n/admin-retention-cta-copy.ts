import type { Locale } from "@/lib/i18n/config";
import type {
  AnalyticsRetentionPromptDestinationBreakdownKey,
  AnalyticsRetentionPromptStateBreakdownKey,
  AnalyticsRetentionPromptSurfaceBreakdownKey,
} from "@/types/content";

type AdminRetentionCtaCopy = {
  metric: {
    label: string;
    detail: string;
  };
  title: string;
  body: string;
  empty: string;
  stateTitle: string;
  destinationTitle: string;
  clicksLabel: string;
  guestClicksLabel: string;
  memberClicksLabel: string;
  shareLabel: string;
  shareEmpty: string;
  surfaceLabels: Record<AnalyticsRetentionPromptSurfaceBreakdownKey, string>;
  stateLabels: Record<AnalyticsRetentionPromptStateBreakdownKey, string>;
  destinationLabels: Record<AnalyticsRetentionPromptDestinationBreakdownKey, string>;
};

const copy: Record<Locale, AdminRetentionCtaCopy> = {
  en: {
    metric: {
      label: "Retention CTA clicks",
      detail: "Clicks on save or continue-tracking cards from AI and result pages",
    },
    title: "Retention CTA mix",
    body:
      "See whether these cards are mostly driving anonymous save intent or signed-in return behavior, and which destination users choose next.",
    empty:
      "No retention CTA clicks yet. Open the AI or result page and use the dashboard continuation cards to populate this view.",
    stateTitle: "By sign-in state",
    destinationTitle: "By destination",
    clicksLabel: "Clicks",
    guestClicksLabel: "Guest",
    memberClicksLabel: "Member",
    shareLabel: "Share",
    shareEmpty: "No clicks yet",
    surfaceLabels: {
      ai: "AI page card",
      result: "Result page card",
      unknown: "Unknown surface",
    },
    stateLabels: {
      guest: "Guest",
      member: "Member",
      unknown: "Unknown state",
    },
    destinationLabels: {
      dashboard: "Dashboard",
      profile: "Profile",
      meals: "Meals",
      unknown: "Unknown destination",
    },
  },
  "zh-CN": {
    metric: {
      label: "\u7559\u5b58 CTA \u70b9\u51fb",
      detail:
        "AI \u9875\u548c\u7ed3\u679c\u9875\u4e0a\u201c\u4fdd\u5b58 / \u7ee7\u7eed\u8ffd\u8e2a\u201d\u5361\u7247\u7684\u70b9\u51fb\u91cf",
    },
    title: "\u7559\u5b58 CTA \u7ec4\u5408",
    body:
      "\u770b\u6e05\u8fd9\u4e9b\u5361\u7247\u5230\u5e95\u66f4\u591a\u662f\u5728\u63a8\u52a8\u533f\u540d\u7528\u6237\u4fdd\u5b58\uff0c\u8fd8\u662f\u5728\u63a8\u52a8\u5df2\u767b\u5f55\u7528\u6237\u56de\u5230 tracking\uff0c\u4ee5\u53ca\u4ed6\u4eec\u4e0b\u4e00\u6b65\u66f4\u611f\u5174\u8da3\u7684\u53bb\u5411\u3002",
    empty:
      "\u8fd8\u6ca1\u6709\u7559\u5b58 CTA \u70b9\u51fb\u3002\u5148\u5728 AI \u9875\u6216\u7ed3\u679c\u9875\u70b9\u51fb dashboard \u7eed\u8ffd\u5361\u7247\uff0c\u8fd9\u91cc\u5c31\u4f1a\u51fa\u73b0\u6570\u636e\u3002",
    stateTitle: "\u6309\u767b\u5f55\u72b6\u6001",
    destinationTitle: "\u6309\u8df3\u8f6c\u76ee\u6807",
    clicksLabel: "\u70b9\u51fb",
    guestClicksLabel: "\u672a\u767b\u5f55",
    memberClicksLabel: "\u5df2\u767b\u5f55",
    shareLabel: "\u5360\u6bd4",
    shareEmpty: "\u6682\u65e0\u70b9\u51fb",
    surfaceLabels: {
      ai: "AI \u9875\u5361\u7247",
      result: "\u7ed3\u679c\u9875\u5361\u7247",
      unknown: "\u672a\u77e5\u4f4d\u7f6e",
    },
    stateLabels: {
      guest: "\u672a\u767b\u5f55",
      member: "\u5df2\u767b\u5f55",
      unknown: "\u672a\u77e5\u72b6\u6001",
    },
    destinationLabels: {
      dashboard: "Dashboard",
      profile: "\u6863\u6848",
      meals: "\u996e\u98df\u8bb0\u5f55",
      unknown: "\u672a\u77e5\u53bb\u5411",
    },
  },
  es: {
    metric: {
      label: "Clics de CTA de retencion",
      detail:
        "Clics en las tarjetas de guardar o seguir el seguimiento desde IA y resultados",
    },
    title: "Mezcla de CTA de retencion",
    body:
      "Mira si estas tarjetas empujan sobre todo la intencion de guardar de usuarios anonimos o el regreso de personas con sesion iniciada, y a que destino entran despues.",
    empty:
      "Todavia no hay clics en CTAs de retencion. Usa las tarjetas de continuidad desde IA o resultados para llenar esta vista.",
    stateTitle: "Por estado de sesion",
    destinationTitle: "Por destino",
    clicksLabel: "Clics",
    guestClicksLabel: "Anonimo",
    memberClicksLabel: "Con sesion",
    shareLabel: "Cuota",
    shareEmpty: "Sin clics aun",
    surfaceLabels: {
      ai: "Tarjeta de IA",
      result: "Tarjeta de resultado",
      unknown: "Superficie desconocida",
    },
    stateLabels: {
      guest: "Anonimo",
      member: "Con sesion",
      unknown: "Estado desconocido",
    },
    destinationLabels: {
      dashboard: "Dashboard",
      profile: "Perfil",
      meals: "Comidas",
      unknown: "Destino desconocido",
    },
  },
};

export function getAdminRetentionCtaCopy(locale: Locale) {
  return copy[locale];
}
