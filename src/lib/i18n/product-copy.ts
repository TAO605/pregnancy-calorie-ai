import type { Locale } from "@/lib/i18n/config";

type AuthCopy = {
  eyebrow: string;
  title: string;
  description: string;
  emailLabel: string;
  nameLabel: string;
  submitLabel: string;
  googleLabel: string;
  demoLabel: string;
  loadingLabel: string;
  errorLabel: string;
  helper: string;
  modeReady: string;
  modeDemo: string;
};

type DashboardCopy = {
  navOverview: string;
  navProfile: string;
  navWeight: string;
  signOut: string;
  demoMode: string;
  firebaseReady: string;
  shellHint: string;
  overviewEyebrow: string;
  overviewTitle: string;
  overviewDescription: string;
  profileTitle: string;
  profileDescription: string;
  weightTitle: string;
  weightDescription: string;
  currentWeekLabel: string;
  currentWeightLabel: string;
  currentWeightHint: string;
  currentWeightDeltaLabel: string;
  currentWeightDeltaEmpty: string;
  guidelineRegionLabel: string;
  guidelineRegionHint: string;
  profileSaved: string;
  profileFields: {
    displayName: string;
    email: string;
    age: string;
    heightCm: string;
    gestationalWeek: string;
    prePregnancyWeightKg: string;
    currentWeightKg: string;
    countryCode: string;
    pregnancyType: string;
    activityLevel: string;
    singleton: string;
    multiple: string;
    sedentary: string;
    light: string;
    moderate: string;
    active: string;
    save: string;
  };
  weightFields: {
    weightKg: string;
    date: string;
    note: string;
    notePlaceholder: string;
    save: string;
    trendTitle: string;
    entriesTitle: string;
    noEntries: string;
    noNote: string;
  };
  quickCards: Array<{ title: string; body: string }>;
};

export type ProductCopy = {
  auth: AuthCopy;
  dashboard: DashboardCopy;
};

const copy: Record<Locale, ProductCopy> = {
  en: {
    auth: {
      eyebrow: "Saved profile entry point",
      title: "Sign in to save your profile and return to your calorie plan later.",
      description:
        "This milestone uses a demo-safe session by default, and it can switch to Firebase once project credentials are wired in.",
      emailLabel: "Email",
      nameLabel: "Display name",
      submitLabel: "Continue in demo mode",
      googleLabel: "Continue with Google",
      demoLabel: "Or use demo mode",
      loadingLabel: "Continuing...",
      errorLabel: "Unable to sign in right now.",
      helper: "A real production sign-in can replace this shell without changing the dashboard routes.",
      modeReady: "Firebase configuration detected",
      modeDemo: "Firebase not configured, using demo mode",
    },
    dashboard: {
      navOverview: "Overview",
      navProfile: "Profile",
      navWeight: "Weight",
      signOut: "Sign out",
      demoMode: "Demo session",
      firebaseReady: "Firebase-ready",
      shellHint:
        "The logged-in area is now active and ready for profile context plus repeat tracking.",
      overviewEyebrow: "Retention loop",
      overviewTitle: "Turn one calculator visit into a saved prenatal routine.",
      overviewDescription:
        "The dashboard should become the place where users update profile context, review current targets, and keep a lightweight weight trend.",
      profileTitle: "Profile settings",
      profileDescription: "Store the baseline details that future AI and trend features will depend on.",
      weightTitle: "Weight trend",
      weightDescription: "Capture simple check-ins now; the charting and alerts can deepen later.",
      currentWeekLabel: "Current week",
      currentWeightLabel: "Current weight",
      currentWeightHint: "Add another entry to unlock delta.",
      currentWeightDeltaLabel: "Change vs prior entry",
      currentWeightDeltaEmpty: "Add another entry to unlock delta.",
      guidelineRegionLabel: "Guideline region",
      guidelineRegionHint: "This later maps to rule packs and disclaimers.",
      profileSaved: "Profile saved.",
      profileFields: {
        displayName: "Display name",
        email: "Email",
        age: "Age",
        heightCm: "Height (cm)",
        gestationalWeek: "Gestational week",
        prePregnancyWeightKg: "Pre-pregnancy weight (kg)",
        currentWeightKg: "Current weight (kg)",
        countryCode: "Country code",
        pregnancyType: "Pregnancy type",
        activityLevel: "Activity level",
        singleton: "Singleton",
        multiple: "Multiple",
        sedentary: "Sedentary",
        light: "Light",
        moderate: "Moderate",
        active: "Active",
        save: "Save profile",
      },
      weightFields: {
        weightKg: "Weight (kg)",
        date: "Date",
        note: "Note",
        notePlaceholder: "Morning weigh-in",
        save: "Save weight entry",
        trendTitle: "Recent trend",
        entriesTitle: "Entries",
        noEntries: "No weight entries saved yet.",
        noNote: "No note",
      },
      quickCards: [
        {
          title: "Profile context",
          body: "Keep age, trimester, activity, and region available for future recommendations.",
        },
        {
          title: "Weight snapshots",
          body: "Log a few data points instead of waiting for a full habit tracker.",
        },
        {
          title: "Migration safety",
          body: "The current store is demo-safe and can be replaced by Firebase persistence later.",
        },
      ],
    },
  },
  "zh-CN": {
    auth: {
      eyebrow: "保存型入口",
      title: "登录后保存档案，之后就能继续回来看你的孕期计划。",
      description:
        "这一阶段默认先走 demo 安全会话；等 Firebase 项目配置齐全后，可以无缝换成正式登录。",
      emailLabel: "邮箱",
      nameLabel: "昵称",
      submitLabel: "以 demo 模式继续",
      googleLabel: "使用 Google 继续",
      demoLabel: "或先用 demo 模式",
      loadingLabel: "进入中...",
      errorLabel: "当前无法登录。",
      helper: "后续替换成正式认证时，不需要改 Dashboard 路由结构。",
      modeReady: "已检测到 Firebase 配置",
      modeDemo: "尚未配置 Firebase，当前使用 demo 模式",
    },
    dashboard: {
      navOverview: "总览",
      navProfile: "档案",
      navWeight: "体重",
      signOut: "退出登录",
      demoMode: "Demo 会话",
      firebaseReady: "已预留 Firebase",
      shellHint: "登录后区域已经打通，可以继续承接档案上下文和重复记录。",
      overviewEyebrow: "留存闭环",
      overviewTitle: "把一次计算器访问，变成持续可回来的孕期工具。",
      overviewDescription:
        "工作台的目标是让用户继续补全档案、查看当前目标，并且以最轻的方式记录体重趋势。",
      profileTitle: "档案设置",
      profileDescription: "把后续 AI 建议和趋势分析需要的基础上下文先存下来。",
      weightTitle: "体重趋势",
      weightDescription: "先把简单打卡做起来，后续再叠加更复杂的提醒和图表。",
      currentWeekLabel: "当前孕周",
      currentWeightLabel: "当前体重",
      currentWeightHint: "再添加一条记录后，就能看到变化值。",
      currentWeightDeltaLabel: "相较上一条变化",
      currentWeightDeltaEmpty: "再添加一条记录后，就能看到变化值。",
      guidelineRegionLabel: "规则地区",
      guidelineRegionHint: "后续会映射到规则包和免责声明。",
      profileSaved: "档案已保存。",
      profileFields: {
        displayName: "昵称",
        email: "邮箱",
        age: "年龄",
        heightCm: "身高（cm）",
        gestationalWeek: "孕周",
        prePregnancyWeightKg: "孕前体重（kg）",
        currentWeightKg: "当前体重（kg）",
        countryCode: "国家代码",
        pregnancyType: "妊娠类型",
        activityLevel: "活动水平",
        singleton: "单胎",
        multiple: "多胎",
        sedentary: "久坐",
        light: "轻度活动",
        moderate: "中度活动",
        active: "高活动量",
        save: "保存档案",
      },
      weightFields: {
        weightKg: "体重（kg）",
        date: "日期",
        note: "备注",
        notePlaceholder: "例如：早晨空腹称重",
        save: "保存体重记录",
        trendTitle: "近期趋势",
        entriesTitle: "记录列表",
        noEntries: "还没有体重记录。",
        noNote: "无备注",
      },
      quickCards: [
        {
          title: "档案上下文",
          body: "把年龄、孕周、活动量和地区规则先固定下来，为后续建议提供基础。",
        },
        {
          title: "体重快照",
          body: "先记录关键时间点，而不是一开始就做重型健康打卡。",
        },
        {
          title: "可迁移存储",
          body: "当前使用 demo 安全存储，后续可以替换成 Firebase 持久化。",
        },
      ],
    },
  },
  es: {
    auth: {
      eyebrow: "Entrada para guardado",
      title: "Inicia sesión para guardar tu perfil y volver a tu plan después.",
      description:
        "En este hito usamos una sesión segura de demostración por defecto, lista para migrar a Firebase cuando exista configuración real.",
      emailLabel: "Correo",
      nameLabel: "Nombre visible",
      submitLabel: "Continuar en modo demo",
      googleLabel: "Continuar con Google",
      demoLabel: "O usar modo demo",
      loadingLabel: "Continuando...",
      errorLabel: "No es posible iniciar sesión ahora.",
      helper: "Cuando llegue la autenticación real, no hará falta cambiar la estructura del panel.",
      modeReady: "Configuración de Firebase detectada",
      modeDemo: "Firebase no está configurado; usando modo demo",
    },
    dashboard: {
      navOverview: "Resumen",
      navProfile: "Perfil",
      navWeight: "Peso",
      signOut: "Cerrar sesión",
      demoMode: "Sesión demo",
      firebaseReady: "Listo para Firebase",
      shellHint:
        "La zona autenticada ya está activa y lista para guardar contexto de perfil y seguimiento repetido.",
      overviewEyebrow: "Bucle de retención",
      overviewTitle: "Convierte una visita a la calculadora en una rutina prenatal guardada.",
      overviewDescription:
        "El panel debe ser el lugar donde la usuaria actualiza su contexto, revisa objetivos y mantiene un seguimiento simple del peso.",
      profileTitle: "Configuración del perfil",
      profileDescription: "Guarda el contexto base del que dependerán futuras recomendaciones y la IA.",
      weightTitle: "Tendencia de peso",
      weightDescription: "Empieza con registros simples; la parte más compleja puede llegar después.",
      currentWeekLabel: "Semana actual",
      currentWeightLabel: "Peso actual",
      currentWeightHint: "Añade otra entrada para desbloquear la variación.",
      currentWeightDeltaLabel: "Cambio vs entrada previa",
      currentWeightDeltaEmpty: "Añade otra entrada para desbloquear la variación.",
      guidelineRegionLabel: "Región de guía",
      guidelineRegionHint: "Más adelante se conectará con paquetes de reglas y avisos.",
      profileSaved: "Perfil guardado.",
      profileFields: {
        displayName: "Nombre visible",
        email: "Correo",
        age: "Edad",
        heightCm: "Altura (cm)",
        gestationalWeek: "Semana de gestación",
        prePregnancyWeightKg: "Peso antes del embarazo (kg)",
        currentWeightKg: "Peso actual (kg)",
        countryCode: "Código de país",
        pregnancyType: "Tipo de embarazo",
        activityLevel: "Nivel de actividad",
        singleton: "Único",
        multiple: "Múltiple",
        sedentary: "Sedentario",
        light: "Ligero",
        moderate: "Moderado",
        active: "Activo",
        save: "Guardar perfil",
      },
      weightFields: {
        weightKg: "Peso (kg)",
        date: "Fecha",
        note: "Nota",
        notePlaceholder: "Por ejemplo: peso en ayunas",
        save: "Guardar peso",
        trendTitle: "Tendencia reciente",
        entriesTitle: "Entradas",
        noEntries: "Todavía no hay registros de peso.",
        noNote: "Sin nota",
      },
      quickCards: [
        {
          title: "Contexto del perfil",
          body: "Mantén edad, trimestre, actividad y región disponibles para recomendaciones futuras.",
        },
        {
          title: "Registros de peso",
          body: "Añade algunos puntos clave sin esperar a un rastreador completo.",
        },
        {
          title: "Migración segura",
          body: "El almacenamiento actual es seguro para demo y puede reemplazarse por Firebase.",
        },
      ],
    },
  },
};

export function getProductCopy(locale: Locale): ProductCopy {
  return copy[locale] ?? copy.en;
}
