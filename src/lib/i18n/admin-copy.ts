import type { Locale } from "@/lib/i18n/config";
import type {
  AnalyticsAiChatSourceKey,
  AnalyticsAiPromptOriginBreakdownKey,
  AnalyticsEventName,
  AnalyticsSignUpSourceBreakdownKey,
  ContentPageStatus,
} from "@/types/content";

type AdminCopy = {
  shell: {
    eyebrow: string;
    title: string;
    body: string;
    navAnalytics: string;
    navUsers: string;
    navGuidelines: string;
    navContent: string;
    signOut: string;
  };
  signInPage: {
    eyebrow: string;
    title: string;
    body: string;
  };
  signInForm: {
    hint: string;
    passwordLabel: string;
    submitLabel: string;
    submittingLabel: string;
    requiredPasswordError: string;
    invalidPasswordError: string;
    genericError: string;
  };
  analytics: {
    overviewEyebrow: string;
    title: string;
    body: string;
    rangeTitle: string;
    rangeBody: string;
    rangeLabels: {
      "7d": string;
      "30d": string;
      all: string;
    };
    metrics: {
      calculatorCompleted: { label: string; detail: string };
      resultAiClicked: { label: string; detail: string };
      weightAiClicked: { label: string; detail: string };
      aiEntryClicks: { label: string; detail: string };
      aiChats: { label: string; detail: string };
      aiSessionResumes: { label: string; detail: string };
      aiEscalations: { label: string; detail: string };
      dashboardViews: { label: string; detail: string };
      signIns: { label: string; detail: string };
      weightLogs: { label: string; detail: string };
      mealLogs: { label: string; detail: string };
      contentViews: { label: string; detail: string };
      contentPublished: { label: string; detail: string };
    };
    eventLabels: Record<AnalyticsEventName, string>;
    aiEntryTitle: string;
    aiEntryBody: string;
    aiEntryEmpty: string;
    aiSourceLabels: Record<AnalyticsAiChatSourceKey, string>;
    aiConversionTitle: string;
    aiConversionBody: string;
    aiConversionEmpty: string;
    aiConversionEntryClicksLabel: string;
    aiConversionChatStartsLabel: string;
    aiConversionRateLabel: string;
    aiConversionRateEmpty: string;
    aiQualityTitle: string;
    aiQualityBody: string;
    aiQualityEmpty: string;
    aiQualityChatsLabel: string;
    aiQualityContextLabel: string;
    aiQualityContextRateLabel: string;
    aiQualityContextRateEmpty: string;
    aiQualityRiskLabel: string;
    aiQualityRiskRateLabel: string;
    aiQualityRiskRateEmpty: string;
    aiDepthTitle: string;
    aiDepthBody: string;
    aiDepthEmpty: string;
    aiDepthSessionsLabel: string;
    aiDepthMessagesLabel: string;
    aiDepthAverageLabel: string;
    aiDepthAverageEmpty: string;
    aiDepthFollowUpsLabel: string;
    aiDepthContinuationLabel: string;
    aiDepthContinuationEmpty: string;
    aiResumeTitle: string;
    aiResumeBody: string;
    aiResumeEmpty: string;
    aiResumeCountLabel: string;
    aiResumeShareLabel: string;
    aiResumeShareEmpty: string;
    aiResumeAverageLabel: string;
    aiResumeAverageEmpty: string;
    aiResumeRiskLabel: string;
    aiResumeRiskRateLabel: string;
    aiResumeRiskRateEmpty: string;
    aiPromptOriginTitle: string;
    aiPromptOriginBody: string;
    aiPromptOriginEmpty: string;
    aiPromptOriginLabels: Record<AnalyticsAiPromptOriginBreakdownKey, string>;
    aiPromptOriginChatsLabel: string;
    aiPromptOriginFollowUpsLabel: string;
    aiPromptOriginFollowUpRateLabel: string;
    aiPromptOriginFollowUpRateEmpty: string;
    aiPromptOriginRiskLabel: string;
    aiPromptOriginRiskRateLabel: string;
    aiPromptOriginRiskRateEmpty: string;
    aiSourcePromptMixTitle: string;
    aiSourcePromptMixBody: string;
    aiSourcePromptMixEmpty: string;
    aiSourcePromptMixChatsLabel: string;
    aiSourcePromptMixDominantLabel: string;
    aiSourcePromptMixDominantEmpty: string;
    signUpSourceTitle: string;
    signUpSourceBody: string;
    signUpSourceEmpty: string;
    signUpSourceLabels: Record<AnalyticsSignUpSourceBreakdownKey, string>;
    signUpSourceSignUpsLabel: string;
    signUpSourceShareLabel: string;
    signUpSourceShareEmpty: string;
    totalsTitle: string;
    totalsBody: string;
    recentEventsTitle: string;
    recentEventsEmpty: string;
    funnelTitle: string;
    funnelCards: {
      anonymous: { label: string; detail: string };
      saved: { label: string; detail: string };
      tracking: { label: string; detail: string };
    };
    anonymousToSavedLabel: string;
    savedToTrackingLabel: string;
    anonymousToTrackingLabel: string;
    localeMixTitle: string;
    localeMixEmpty: string;
    signUpRetentionTitle: string;
    signUpRetentionBody: string;
    signUpRetentionEmpty: string;
    signUpRetentionSavedProfilesLabel: string;
    signUpRetentionShareLabel: string;
    signUpRetentionShareEmpty: string;
    signUpRetentionTrackingRateLabel: string;
    signUpRetentionTrackingRateEmpty: string;
    snapshotBadge: string;
    usersSuffix: string;
    activeTrackingLabel: string;
    controlsTitle: string;
    controlCards: Array<{ title: string; body: string }>;
  };
  contentPage: {
    eyebrow: string;
    title: string;
    body: string;
  };
  contentEditor: {
    formatSavedMessage: (title: string) => string;
    saveError: string;
    newPageEyebrow: string;
    newPageTitle: string;
    createPageLabel: string;
    savingLabel: string;
    localePlaceholder: string;
    slugPlaceholder: string;
    statusLabels: Record<ContentPageStatus, string>;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    bodyPlaceholder: string;
    saveLabel: string;
    openLiveLabel: string;
  };
  guidelinesPage: {
    eyebrow: string;
    title: string;
    body: string;
  };
  guidelinesEditor: {
    formatSavedMessage: (name: string) => string;
    saveError: string;
    savingLabel: string;
    savePackLabel: string;
    displayNameLabel: string;
    countryCodeLabel: string;
    trimester1Label: string;
    trimester2Label: string;
    trimester3Label: string;
    disclaimerKeyLabel: string;
  };
  usersPage: {
    eyebrow: string;
    title: string;
    body: string;
    emptyTitle: string;
    emptyBody: string;
    anonymousVisitor: string;
    noSignInYet: string;
    localeRegionLabel: string;
    weekLabel: string;
    calculatorLabel: string;
    sessionsSuffix: string;
    latestTargetLabel: string;
    aiCtaClicksLabel: string;
    engagementLabel: string;
    dashboardViewsSuffix: string;
    aiChatsSuffix: string;
    trackingLabel: string;
    weightLogsSuffix: string;
    mealLogsSuffix: string;
    signUpSourceLabel: string;
    signUpSourceLabels: Record<AnalyticsSignUpSourceBreakdownKey, string>;
    signalLabel: string;
    statusLabels: {
      anonymous: string;
      saved_profile: string;
      active_tracking: string;
    };
    signalLabels: {
      anonymous: string;
      saved_profile: string;
      active_tracking: string;
    };
    sortHint: string;
  };
};

const copy: Record<Locale, AdminCopy> = {
  en: {
    shell: {
      eyebrow: "Admin",
      title: "Growth and rules",
      body: "This side manages SEO-oriented product metrics, content, and guideline pack changes.",
      navAnalytics: "Analytics",
      navUsers: "Users",
      navGuidelines: "Guidelines",
      navContent: "Content",
      signOut: "Sign out",
    },
    signInPage: {
      eyebrow: "Admin sign-in",
      title: "Manage SEO growth, saved users, and region rules.",
      body: "This admin side stays intentionally lean. It focuses on the controls that directly shape calculator output and product visibility.",
    },
    signInForm: {
      hint: "Use `admin123` by default, or set `ADMIN_DEMO_PASSWORD` in the environment.",
      passwordLabel: "Admin password",
      submitLabel: "Open admin",
      submittingLabel: "Signing in...",
      requiredPasswordError: "Password is required.",
      invalidPasswordError: "Invalid admin password.",
      genericError: "Unable to sign in.",
    },
    analytics: {
      overviewEyebrow: "Analytics overview",
      title: "Read the product the same way you want to grow it.",
      body: "This page combines event totals with live user-state snapshots, so the prototype shows both activity volume and where users sit in the funnel from result click to dashboard usage.",
      rangeTitle: "Event window",
      rangeBody:
        "Metric cards, AI source tables, totals, and recent activity follow the selected event window. User funnel and locale mix stay as current snapshots.",
      rangeLabels: {
        "7d": "7 days",
        "30d": "30 days",
        all: "All time",
      },
      metrics: {
        calculatorCompleted: {
          label: "Calculator completions",
          detail: "Captured from the calculation API",
        },
        resultAiClicked: {
          label: "Result to AI clicks",
          detail: "CTA taps from the calorie result page",
        },
        weightAiClicked: {
          label: "Weight to AI clicks",
          detail: "CTA taps from the dashboard weight page",
        },
        aiEntryClicks: {
          label: "All AI entry clicks",
          detail: "Combined AI CTA taps across results, dashboard, meals, weight, and blog",
        },
        aiChats: {
          label: "AI chats",
          detail: "Questions submitted on the AI assistant page",
        },
        aiSessionResumes: {
          label: "AI session resumes",
          detail: "Times a saved AI conversation was reopened from history",
        },
        aiEscalations: {
          label: "AI escalations",
          detail: "Raised when risk keywords are detected",
        },
        dashboardViews: {
          label: "Dashboard views",
          detail: "Tracked on dashboard route entry",
        },
        signIns: {
          label: "Saved sign-ins",
          detail: "Successful sign-ins from demo or Firebase mode",
        },
        weightLogs: {
          label: "Weight logs",
          detail: "Logged when a user saves a weight entry",
        },
        mealLogs: {
          label: "Meal logs",
          detail: "Logged when a user saves a meal entry",
        },
        contentViews: {
          label: "Content views",
          detail: "Captured when a published guide detail page is opened",
        },
        contentPublished: {
          label: "Published guides",
          detail: "Logged when admin saves a guide in published state",
        },
      },
      eventLabels: {
        calculator_completed: "Calculator completion",
        ai_chat_started: "AI chat started",
        ai_session_resumed: "AI session resumed",
        ai_risk_escalated: "AI escalation",
        dashboard_viewed: "Dashboard viewed",
        ai_entry_clicked: "AI entry clicked",
        result_ai_clicked: "Result to AI click",
        weight_ai_clicked: "Weight to AI click",
        retention_cta_clicked: "Retention CTA clicked",
        signup_completed: "Saved sign-in",
        meal_log_created: "Meal log created",
        weight_log_created: "Weight log created",
        content_page_viewed: "Content page viewed",
        content_page_published: "Content page published",
      },
      aiEntryTitle: "AI entry sources",
      aiEntryBody:
        "See which calculator, dashboard, tracker, and article surfaces are actually sending users into AI.",
      aiEntryEmpty:
        "No AI entry clicks yet. Trigger AI CTAs from result pages, dashboard summaries, meal or weight reviews, or blog articles.",
      aiSourceLabels: {
        calculator_result_primary: "Calculator result primary CTA",
        calculator_result_follow_up: "Calculator result follow-up cards",
        dashboard_overview_plan: "Dashboard calorie plan CTA",
        dashboard_overview_recent_targets: "Dashboard recent targets CTA",
        dashboard_weekly_checkin: "Dashboard weekly check-in CTA",
        dashboard_weight_summary: "Weight summary CTA",
        dashboard_weight_weekly_review: "Weight weekly review CTA",
        dashboard_weight: "Weight page AI CTA",
        dashboard_meals_plan: "Meals daily plan CTA",
        dashboard_meals_weekly_review: "Meals weekly review CTA",
        blog_article_tool_cta: "Blog article tool CTA",
        blog_article_footer: "Blog article footer CTA",
        direct: "Direct AI page visit",
        unknown: "Unknown source",
      },
      aiConversionTitle: "AI entry to chat conversion",
      aiConversionBody:
        "Compare which AI entry points merely get clicks and which ones actually convert into a submitted AI question.",
      aiConversionEmpty:
        "No sourced AI chat activity yet. Open AI from a tracked entry point and submit a question to populate this view.",
      aiConversionEntryClicksLabel: "Entry clicks",
      aiConversionChatStartsLabel: "Chats started",
      aiConversionRateLabel: "Click to chat",
      aiConversionRateEmpty: "No clicks yet",
      aiQualityTitle: "AI chat quality by source",
      aiQualityBody:
        "Track which entry points bring users into grounded conversations and which ones more often trigger medical-risk escalation.",
      aiQualityEmpty:
        "No AI chats yet. Submit at least one question from the AI page to populate source quality metrics.",
      aiQualityChatsLabel: "Chats",
      aiQualityContextLabel: "Context-backed chats",
      aiQualityContextRateLabel: "Context coverage",
      aiQualityContextRateEmpty: "No chats yet",
      aiQualityRiskLabel: "Risk escalations",
      aiQualityRiskRateLabel: "Risk rate",
      aiQualityRiskRateEmpty: "No chats yet",
      aiDepthTitle: "AI session depth by source",
      aiDepthBody:
        "Separate one-off questions from real back-and-forth usage by comparing sessions, follow-ups, and average message depth for each AI entry source.",
      aiDepthEmpty:
        "No AI sessions yet. Submit at least one AI question to populate session-depth metrics.",
      aiDepthSessionsLabel: "Sessions",
      aiDepthMessagesLabel: "Messages",
      aiDepthAverageLabel: "Avg. messages / session",
      aiDepthAverageEmpty: "No sessions yet",
      aiDepthFollowUpsLabel: "Follow-up messages",
      aiDepthContinuationLabel: "Sessions with follow-up",
      aiDepthContinuationEmpty: "No sessions yet",
      aiResumeTitle: "AI session resumes",
      aiResumeBody:
        "Track which saved AI threads users deliberately reopen, how much depth those sessions already had, and how often they carry medical-risk context.",
      aiResumeEmpty:
        "No AI session resumes yet. Reopen a saved AI conversation from history to populate this view.",
      aiResumeCountLabel: "Resumes",
      aiResumeShareLabel: "Share of resumes",
      aiResumeShareEmpty: "No resumes yet",
      aiResumeAverageLabel: "Avg. messages / resumed session",
      aiResumeAverageEmpty: "No resumes yet",
      aiResumeRiskLabel: "Resumes with risk context",
      aiResumeRiskRateLabel: "Risk-context rate",
      aiResumeRiskRateEmpty: "No resumes yet",
      aiPromptOriginTitle: "How AI questions start",
      aiPromptOriginBody:
        "Compare whether users begin AI conversations by typing manually, submitting prefilled prompts, using context suggestions, reusing history, or tapping suggested prompts.",
      aiPromptOriginEmpty:
        "No prompt-origin analytics yet. Use the AI page and submit at least one question to populate this view.",
      aiPromptOriginLabels: {
        manual_submit: "Manual submit",
        prefilled_prompt: "Prefilled prompt",
        context_prompt: "Context suggestion",
        history_reuse: "History reuse",
        suggested_prompt: "Suggested prompt",
        unknown: "Unknown origin",
      },
      aiPromptOriginChatsLabel: "Chats",
      aiPromptOriginFollowUpsLabel: "Follow-up chats",
      aiPromptOriginFollowUpRateLabel: "Follow-up share",
      aiPromptOriginFollowUpRateEmpty: "No chats yet",
      aiPromptOriginRiskLabel: "Risk escalations",
      aiPromptOriginRiskRateLabel: "Risk rate",
      aiPromptOriginRiskRateEmpty: "No chats yet",
      aiSourcePromptMixTitle: "How each AI source gets used",
      aiSourcePromptMixBody:
        "See whether each AI entry point mostly converts through prefilled prompts, manual rewrites, context suggestions, or resumed threads. This makes weak entry copy visible fast.",
      aiSourcePromptMixEmpty:
        "No source-to-prompt analytics yet. Start AI from a tracked entry point and submit at least one question to populate this view.",
      aiSourcePromptMixChatsLabel: "Chats",
      aiSourcePromptMixDominantLabel: "Dominant start style",
      aiSourcePromptMixDominantEmpty: "No mix yet",
      signUpSourceTitle: "Saved sign-ins by source",
      signUpSourceBody:
        "Track which public surfaces actually convert anonymous visitors into saved users instead of only generating clicks or one-off AI questions.",
      signUpSourceEmpty:
        "No saved sign-ins yet. Use a tracked sign-in entry point and complete at least one sign-in to populate this view.",
      signUpSourceLabels: {
        marketing_nav: "Marketing nav sign-in",
        calculator_result_save: "Calculator result save CTA",
        ai_page_save: "AI page save CTA",
        dashboard_gate: "Dashboard gate redirect",
        unknown: "Unknown source",
      },
      signUpSourceSignUpsLabel: "Saved sign-ins",
      signUpSourceShareLabel: "Share of sign-ins",
      signUpSourceShareEmpty: "No sign-ins yet",
      totalsTitle: "Totals",
      totalsBody: "Total analytics events captured inside the selected event window.",
      recentEventsTitle: "Recent events",
      recentEventsEmpty:
        "No live events yet. Use the calculator, result page, AI page, sign-in flow, or dashboard logs to generate activity.",
      funnelTitle: "User funnel",
      funnelCards: {
        anonymous: { label: "Anonymous", detail: "Top-of-funnel visitors" },
        saved: { label: "Saved", detail: "Profiles tied to an email identity" },
        tracking: { label: "Tracking", detail: "Users logging weight or meals" },
      },
      anonymousToSavedLabel: "Anonymous to saved",
      savedToTrackingLabel: "Saved to tracking",
      anonymousToTrackingLabel: "Anonymous to tracking",
      localeMixTitle: "Locale mix",
      localeMixEmpty:
        "No user snapshots yet. Calculator and dashboard flows will populate locale mix.",
      signUpRetentionTitle: "Saved-user retention by sign-in source",
      signUpRetentionBody:
        "Use the current snapshot to compare which sign-in entry points are only creating saved users and which ones are actually producing active tracking behavior later.",
      signUpRetentionEmpty:
        "No saved-user source snapshot yet. Complete at least one tracked sign-in to populate this view.",
      signUpRetentionSavedProfilesLabel: "Saved users",
      signUpRetentionShareLabel: "Share of saved users",
      signUpRetentionShareEmpty: "No saved users yet",
      signUpRetentionTrackingRateLabel: "Tracking rate",
      signUpRetentionTrackingRateEmpty: "No saved users yet",
      snapshotBadge: "Current snapshot",
      usersSuffix: "users",
      activeTrackingLabel: "Active tracking",
      controlsTitle: "What this admin already controls",
      controlCards: [
        {
          title: "Journey view",
          body: "Result clicks, AI usage, and dashboard visits are live in the prototype now.",
        },
        {
          title: "User preview",
          body: "Admin can inspect who stayed anonymous, who saved a profile, and who keeps tracking.",
        },
        {
          title: "Guideline control",
          body: "Rule pack edits persist locally and immediately affect calculator results.",
        },
      ],
    },
    contentPage: {
      eyebrow: "Content management",
      title: "Publish search-facing pregnancy content without leaving the product.",
      body: "These pages are stored locally in this prototype, surfaced publicly under localized blog routes, and ready to become the SEO content layer behind the calculator.",
    },
    contentEditor: {
      formatSavedMessage: (title) => `Saved ${title}.`,
      saveError: "Unable to save content page.",
      newPageEyebrow: "New page",
      newPageTitle: "Create SEO content directly from admin",
      createPageLabel: "Create page",
      savingLabel: "Saving...",
      localePlaceholder: "Locale",
      slugPlaceholder: "Slug",
      statusLabels: {
        draft: "draft",
        published: "published",
      },
      titlePlaceholder: "Title",
      descriptionPlaceholder: "Description",
      bodyPlaceholder: "Body",
      saveLabel: "Save",
      openLiveLabel: "Open live page",
    },
    guidelinesPage: {
      eyebrow: "Guideline packs",
      title: "Change the region logic without editing code.",
      body: "These edits persist to a local JSON store in this prototype, and the calculation API reads them back immediately. That keeps the admin page honest instead of being just a mock.",
    },
    guidelinesEditor: {
      formatSavedMessage: (name) => `Saved ${name}.`,
      saveError: "Unable to save guideline pack.",
      savingLabel: "Saving...",
      savePackLabel: "Save pack",
      displayNameLabel: "Display name",
      countryCodeLabel: "Country code",
      trimester1Label: "Trimester 1 extra calories",
      trimester2Label: "Trimester 2 extra calories",
      trimester3Label: "Trimester 3 extra calories",
      disclaimerKeyLabel: "Disclaimer key",
    },
    usersPage: {
      eyebrow: "User preview",
      title: "Read who is staying and who is bouncing.",
      body: "This view reads from the prototype's local activity store, so calculator usage, AI engagement, dashboard visits, sign-ins, and tracking actions show up as real records.",
      emptyTitle: "No user activity yet",
      emptyBody: "Use the calculator, sign-in flow, profile save, or tracking pages to generate records for this admin view.",
      anonymousVisitor: "Anonymous visitor",
      noSignInYet: "No sign-in yet",
      localeRegionLabel: "Locale / region",
      weekLabel: "Week",
      calculatorLabel: "Calculator",
      sessionsSuffix: "sessions",
      latestTargetLabel: "Latest target",
      aiCtaClicksLabel: "AI CTA clicks",
      engagementLabel: "Engagement",
      dashboardViewsSuffix: "dashboard views",
      aiChatsSuffix: "AI chats",
      trackingLabel: "Tracking",
      weightLogsSuffix: "weight logs",
      mealLogsSuffix: "meal logs",
      signUpSourceLabel: "Saved from",
      signUpSourceLabels: {
        marketing_nav: "Marketing nav",
        calculator_result_save: "Result save CTA",
        ai_page_save: "AI save CTA",
        dashboard_gate: "Dashboard gate",
        unknown: "Unknown source",
      },
      signalLabel: "Signal",
      statusLabels: {
        anonymous: "anonymous",
        saved_profile: "saved profile",
        active_tracking: "active tracking",
      },
      signalLabels: {
        anonymous: "Top of funnel",
        saved_profile: "Activated",
        active_tracking: "Retention",
      },
      sortHint: "Sort order follows latest activity time.",
    },
  },
  "zh-CN": {
    shell: {
      eyebrow: "管理后台",
      title: "增长与规则",
      body: "这里管理面向 SEO 的产品数据、内容资产和规则包变更。",
      navAnalytics: "数据概览",
      navUsers: "用户预览",
      navGuidelines: "规则包",
      navContent: "内容管理",
      signOut: "退出登录",
    },
    signInPage: {
      eyebrow: "后台登录",
      title: "管理 SEO 增长、已保存用户和地区规则。",
      body: "这个后台刻意保持精简，只保留会直接影响计算器结果和产品可见性的核心控制项。",
    },
    signInForm: {
      hint: "默认密码是 `admin123`，也可以在环境变量中设置 `ADMIN_DEMO_PASSWORD`。",
      passwordLabel: "后台密码",
      submitLabel: "进入后台",
      submittingLabel: "登录中...",
      requiredPasswordError: "请输入密码。",
      invalidPasswordError: "后台密码不正确。",
      genericError: "登录失败。",
    },
    analytics: {
      overviewEyebrow: "数据概览",
      title: "按增长视角读这个产品。",
      body: "这个页面把事件总量和实时用户状态放在一起，让原型既能看活动规模，也能看用户从结果页点击一路走到仪表盘使用时处在漏斗的哪一层。",
      rangeTitle: "事件时间范围",
      rangeBody:
        "指标卡、AI 来源表、事件总量和最近事件都会按所选时间范围过滤；用户漏斗和语言分布保持当前快照。",
      rangeLabels: {
        "7d": "近 7 天",
        "30d": "近 30 天",
        all: "全部时间",
      },
      metrics: {
        calculatorCompleted: {
          label: "计算完成数",
          detail: "来自计算 API 的记录",
        },
        resultAiClicked: {
          label: "结果页到 AI 点击",
          detail: "热量结果页上的 AI CTA 点击",
        },
        weightAiClicked: {
          label: "体重页到 AI 点击",
          detail: "仪表盘体重页上的 AI CTA 点击",
        },
        aiEntryClicks: {
          label: "AI 入口点击",
          detail: "覆盖结果页、仪表盘、饮食、体重和文章页的 AI CTA",
        },
        aiChats: {
          label: "AI 对话数",
          detail: "AI 助手页实际提交的问题数",
        },
        aiSessionResumes: {
          label: "AI 会话恢复数",
          detail: "用户从历史里重新打开已保存 AI 会话的次数",
        },
        aiEscalations: {
          label: "AI 风险升级",
          detail: "检测到风险关键词后触发",
        },
        dashboardViews: {
          label: "仪表盘访问数",
          detail: "进入仪表盘路由时记录",
        },
        signIns: {
          label: "已保存登录数",
          detail: "Demo 或 Firebase 模式下的成功登录次数",
        },
        weightLogs: {
          label: "体重记录数",
          detail: "用户保存体重记录时计数",
        },
        mealLogs: {
          label: "饮食记录数",
          detail: "用户保存饮食记录时计数",
        },
        contentViews: {
          label: "内容浏览数",
          detail: "用户打开已发布指南详情页时记录",
        },
        contentPublished: {
          label: "内容发布数",
          detail: "后台以已发布状态保存指南时记录",
        },
      },
      eventLabels: {
        calculator_completed: "完成一次计算",
        ai_chat_started: "发起一次 AI 对话",
        ai_session_resumed: "恢复一次 AI 会话",
        ai_risk_escalated: "触发 AI 风险升级",
        dashboard_viewed: "访问仪表盘",
        ai_entry_clicked: "点击 AI 入口",
        result_ai_clicked: "点击结果页 AI 入口",
        weight_ai_clicked: "点击体重页 AI 入口",
        retention_cta_clicked: "点击留存 CTA",
        signup_completed: "完成一次登录保存",
        meal_log_created: "新增饮食记录",
        weight_log_created: "新增体重记录",
        content_page_viewed: "浏览内容详情页",
        content_page_published: "发布内容页",
      },
      aiEntryTitle: "AI 入口来源",
      aiEntryBody: "看清哪些页面和回顾模块最能把用户送进 AI。",
      aiEntryEmpty:
        "还没有 AI 入口点击。先从结果页、仪表盘、饮食或体重回顾、文章页点击 AI CTA 生成数据。",
      aiSourceLabels: {
        calculator_result_primary: "结果页主 CTA",
        calculator_result_follow_up: "结果页后续问题卡片",
        dashboard_overview_plan: "仪表盘热量计划 CTA",
        dashboard_overview_recent_targets: "仪表盘最近目标 CTA",
        dashboard_weekly_checkin: "仪表盘每周回顾 CTA",
        dashboard_weight_summary: "体重摘要 CTA",
        dashboard_weight_weekly_review: "体重周回顾 CTA",
        dashboard_weight: "体重页 AI 入口",
        dashboard_meals_plan: "饮食计划 CTA",
        dashboard_meals_weekly_review: "饮食周回顾 CTA",
        blog_article_tool_cta: "文章工具区 CTA",
        blog_article_footer: "文章底部 CTA",
        direct: "直接访问 AI 页面",
        unknown: "未知来源",
      },
      aiConversionTitle: "AI 入口到对话转化",
      aiConversionBody: "对比哪些 AI 入口只是被点击，哪些入口真的把用户带成一次已提交的问题。",
      aiConversionEmpty:
        "还没有来源明确的 AI 对话。先从已追踪入口进入 AI 页面并提交一个问题，再回来查看转化。",
      aiConversionEntryClicksLabel: "入口点击",
      aiConversionChatStartsLabel: "已发起对话",
      aiConversionRateLabel: "点击到对话",
      aiConversionRateEmpty: "暂无点击",
      aiQualityTitle: "按来源看 AI 对话质量",
      aiQualityBody: "看哪些入口带来的对话更依赖已保存上下文，哪些入口更容易触发医疗风险升级。",
      aiQualityEmpty:
        "还没有 AI 对话数据。先在 AI 页面提交至少一个问题，再回来查看来源质量指标。",
      aiQualityChatsLabel: "对话数",
      aiQualityContextLabel: "带上下文的对话",
      aiQualityContextRateLabel: "上下文覆盖率",
      aiQualityContextRateEmpty: "暂无对话",
      aiQualityRiskLabel: "风险升级数",
      aiQualityRiskRateLabel: "风险率",
      aiQualityRiskRateEmpty: "暂无对话",
      aiDepthTitle: "按来源看 AI 会话深度",
      aiDepthBody: "区分一次性提问和真正持续追问的使用，看每个 AI 入口带来的会话数、追问数和平均消息深度。",
      aiDepthEmpty:
        "还没有 AI 会话数据。先提交至少一个 AI 问题，再回来查看会话深度指标。",
      aiDepthSessionsLabel: "会话数",
      aiDepthMessagesLabel: "消息数",
      aiDepthAverageLabel: "平均每会话消息数",
      aiDepthAverageEmpty: "暂无会话",
      aiDepthFollowUpsLabel: "追问消息数",
      aiDepthContinuationLabel: "有追问的会话",
      aiDepthContinuationEmpty: "暂无会话",
      aiResumeTitle: "AI 会话恢复情况",
      aiResumeBody:
        "看用户会主动把哪些已保存 AI 线程重新捞起来继续聊，这些被恢复的会话原本有多深，以及其中有多少已经带有风险上下文。",
      aiResumeEmpty:
        "还没有 AI 会话恢复数据。先从历史里重新打开一次已保存 AI 会话，再回来查看这个区块。",
      aiResumeCountLabel: "恢复次数",
      aiResumeShareLabel: "恢复占比",
      aiResumeShareEmpty: "暂无恢复",
      aiResumeAverageLabel: "恢复会话平均消息数",
      aiResumeAverageEmpty: "暂无恢复",
      aiResumeRiskLabel: "带风险上下文的恢复会话",
      aiResumeRiskRateLabel: "风险上下文占比",
      aiResumeRiskRateEmpty: "暂无恢复",
      aiPromptOriginTitle: "AI 问题是怎么开始的",
      aiPromptOriginBody:
        "对比用户是手动输入、直接提交预填 prompt、点击上下文建议、复用历史问题，还是点击推荐问题来开启 AI 对话。",
      aiPromptOriginEmpty:
        "还没有问题起点数据。先在 AI 页面提交至少一个问题，再回来查看这个区块。",
      aiPromptOriginLabels: {
        manual_submit: "手动输入",
        prefilled_prompt: "预填 prompt",
        context_prompt: "上下文建议",
        history_reuse: "历史复用",
        suggested_prompt: "推荐问题",
        unknown: "未知方式",
      },
      aiPromptOriginChatsLabel: "对话数",
      aiPromptOriginFollowUpsLabel: "追问对话数",
      aiPromptOriginFollowUpRateLabel: "追问占比",
      aiPromptOriginFollowUpRateEmpty: "暂无对话",
      aiPromptOriginRiskLabel: "风险升级数",
      aiPromptOriginRiskRateLabel: "风险率",
      aiPromptOriginRiskRateEmpty: "暂无对话",
      aiSourcePromptMixTitle: "各个 AI 来源是怎么被使用的",
      aiSourcePromptMixBody:
        "看清每个 AI 入口最终是靠预填问题、手动改写、上下文建议，还是从旧会话续聊来转化成对话，这样可以快速找出文案或入口设计的问题。",
      aiSourcePromptMixEmpty:
        "还没有“来源到提问方式”的数据。先从已追踪的 AI 入口进入，并提交至少一个问题。",
      aiSourcePromptMixChatsLabel: "对话数",
      aiSourcePromptMixDominantLabel: "主要起始方式",
      aiSourcePromptMixDominantEmpty: "暂无分布",
      signUpSourceTitle: "已保存登录的来源分布",
      signUpSourceBody:
        "看清哪些公开页面真的把匿名访问者推进成已保存用户，而不只是带来点击或一次性 AI 提问。",
      signUpSourceEmpty:
        "还没有已保存登录数据。先从带来源标记的登录入口进入，并完成至少一次登录。",
      signUpSourceLabels: {
        marketing_nav: "营销导航登录入口",
        calculator_result_save: "结果页保存 CTA",
        ai_page_save: "AI 页保存 CTA",
        dashboard_gate: "仪表盘拦截跳转",
        unknown: "未知来源",
      },
      signUpSourceSignUpsLabel: "已保存登录数",
      signUpSourceShareLabel: "登录占比",
      signUpSourceShareEmpty: "暂无登录",
      totalsTitle: "总量",
      totalsBody: "当前所选事件时间范围内采集到的 analytics 事件总数。",
      recentEventsTitle: "最近事件",
      recentEventsEmpty:
        "还没有实时事件。去使用计算器、结果页、AI 页面、登录流程或仪表盘记录，这里就会出现数据。",
      funnelTitle: "用户漏斗",
      funnelCards: {
        anonymous: { label: "匿名", detail: "漏斗顶部访问者" },
        saved: { label: "已保存", detail: "已绑定邮箱身份的资料" },
        tracking: { label: "持续追踪", detail: "正在记录体重或饮食的用户" },
      },
      anonymousToSavedLabel: "匿名到已保存",
      savedToTrackingLabel: "已保存到持续追踪",
      anonymousToTrackingLabel: "匿名到持续追踪",
      localeMixTitle: "语言分布",
      localeMixEmpty: "还没有用户快照。计算器和仪表盘流程会逐步填充语言分布。",
      signUpRetentionTitle: "按登录来源看的保存后留存",
      signUpRetentionBody:
        "用当前快照比较不同登录入口带来的用户质量，分清哪些入口只是带来已保存用户，哪些入口真的更容易走到持续追踪。",
      signUpRetentionEmpty:
        "还没有保存用户来源快照。先完成至少一次带来源标记的登录。",
      signUpRetentionSavedProfilesLabel: "已保存用户",
      signUpRetentionShareLabel: "已保存用户占比",
      signUpRetentionShareEmpty: "暂无已保存用户",
      signUpRetentionTrackingRateLabel: "持续追踪率",
      signUpRetentionTrackingRateEmpty: "暂无已保存用户",
      snapshotBadge: "当前快照",
      usersSuffix: "位用户",
      activeTrackingLabel: "持续追踪",
      controlsTitle: "这个后台已经能控制什么",
      controlCards: [
        {
          title: "路径视角",
          body: "结果页点击、AI 使用和仪表盘访问都已经接入真实原型数据。",
        },
        {
          title: "用户预览",
          body: "后台可以看到谁仍然匿名、谁保存了资料、谁开始持续追踪。",
        },
        {
          title: "规则控制",
          body: "规则包编辑会持久化到本地，并立即影响计算器结果。",
        },
      ],
    },
    contentPage: {
      eyebrow: "内容管理",
      title: "不离开产品也能发布面向搜索的孕期内容。",
      body: "这些页面当前保存在原型的本地存储中，会公开显示在多语言 blog 路由下，也已经具备成为计算器 SEO 内容层的基础结构。",
    },
    contentEditor: {
      formatSavedMessage: (title) => `已保存：${title}`,
      saveError: "内容页保存失败。",
      newPageEyebrow: "新页面",
      newPageTitle: "直接在后台创建 SEO 内容",
      createPageLabel: "创建页面",
      savingLabel: "保存中...",
      localePlaceholder: "语言",
      slugPlaceholder: "Slug",
      statusLabels: {
        draft: "草稿",
        published: "已发布",
      },
      titlePlaceholder: "标题",
      descriptionPlaceholder: "摘要",
      bodyPlaceholder: "正文",
      saveLabel: "保存",
      openLiveLabel: "打开线上页面",
    },
    guidelinesPage: {
      eyebrow: "规则包",
      title: "不改代码也能调整地区逻辑。",
      body: "这些编辑会持久化到原型的本地 JSON 存储里，计算 API 也会立刻重新读取，所以这个后台不是纯展示，而是在真实驱动产品行为。",
    },
    guidelinesEditor: {
      formatSavedMessage: (name) => `已保存：${name}`,
      saveError: "规则包保存失败。",
      savingLabel: "保存中...",
      savePackLabel: "保存规则包",
      displayNameLabel: "显示名称",
      countryCodeLabel: "国家代码",
      trimester1Label: "孕早期额外热量",
      trimester2Label: "孕中期额外热量",
      trimester3Label: "孕晚期额外热量",
      disclaimerKeyLabel: "免责声明键名",
    },
    usersPage: {
      eyebrow: "用户预览",
      title: "看清谁留下来了，谁已经流失了。",
      body: "这个视图直接读取原型的本地行为存储，所以计算器使用、AI 互动、仪表盘访问、登录和追踪动作都会显示成真实记录。",
      emptyTitle: "还没有用户活动",
      emptyBody: "走一遍计算器、登录、资料保存或追踪页面流程，这里就会生成可查看的记录。",
      anonymousVisitor: "匿名访客",
      noSignInYet: "尚未登录",
      localeRegionLabel: "语言 / 地区",
      weekLabel: "孕周",
      calculatorLabel: "计算器",
      sessionsSuffix: "次会话",
      latestTargetLabel: "最新目标",
      aiCtaClicksLabel: "AI CTA 点击",
      engagementLabel: "互动",
      dashboardViewsSuffix: "次仪表盘访问",
      aiChatsSuffix: "次 AI 对话",
      trackingLabel: "追踪",
      weightLogsSuffix: "条体重记录",
      mealLogsSuffix: "条饮食记录",
      signUpSourceLabel: "保存来源",
      signUpSourceLabels: {
        marketing_nav: "营销导航",
        calculator_result_save: "结果页保存 CTA",
        ai_page_save: "AI 页保存 CTA",
        dashboard_gate: "仪表盘拦截",
        unknown: "未知来源",
      },
      signalLabel: "信号",
      statusLabels: {
        anonymous: "匿名",
        saved_profile: "已保存资料",
        active_tracking: "持续追踪",
      },
      signalLabels: {
        anonymous: "漏斗顶部",
        saved_profile: "已激活",
        active_tracking: "留存中",
      },
      sortHint: "排序按最近活动时间生成。",
    },
  },
  es: {
    shell: {
      eyebrow: "Admin",
      title: "Crecimiento y reglas",
      body: "Este panel gestiona metricas orientadas a SEO, contenido y cambios en los paquetes de reglas.",
      navAnalytics: "Analitica",
      navUsers: "Usuarios",
      navGuidelines: "Guias",
      navContent: "Contenido",
      signOut: "Salir",
    },
    signInPage: {
      eyebrow: "Acceso admin",
      title: "Gestiona crecimiento SEO, usuarios guardados y reglas regionales.",
      body: "Este lado admin se mantiene ligero a proposito. Se centra en los controles que cambian la salida de la calculadora y la visibilidad del producto.",
    },
    signInForm: {
      hint: "Usa `admin123` por defecto o define `ADMIN_DEMO_PASSWORD` en el entorno.",
      passwordLabel: "Contrasena admin",
      submitLabel: "Abrir admin",
      submittingLabel: "Entrando...",
      requiredPasswordError: "La contrasena es obligatoria.",
      invalidPasswordError: "La contrasena admin no es valida.",
      genericError: "No se pudo iniciar sesion.",
    },
    analytics: {
      overviewEyebrow: "Resumen analitico",
      title: "Lee el producto como quieres hacerlo crecer.",
      body: "Esta pagina combina totales de eventos con estados vivos de usuarios para mostrar tanto volumen como posicion dentro del embudo desde el clic en resultados hasta el uso del dashboard.",
      rangeTitle: "Ventana de eventos",
      rangeBody:
        "Las tarjetas de metricas, las tablas de fuentes IA, los totales y la actividad reciente siguen la ventana elegida. El embudo y la mezcla de idiomas siguen siendo snapshots actuales.",
      rangeLabels: {
        "7d": "7 dias",
        "30d": "30 dias",
        all: "Todo el tiempo",
      },
      metrics: {
        calculatorCompleted: {
          label: "Calculos completados",
          detail: "Capturados desde la API de calculo",
        },
        resultAiClicked: {
          label: "Clics de resultado a IA",
          detail: "Toques del CTA en la pagina de resultado",
        },
        weightAiClicked: {
          label: "Clics de peso a IA",
          detail: "Toques del CTA en la pagina de peso del dashboard",
        },
        aiEntryClicks: {
          label: "Todos los clics hacia IA",
          detail: "Suma CTAs de IA desde resultados, dashboard, comidas, peso y blog",
        },
        aiChats: {
          label: "Chats IA",
          detail: "Preguntas enviadas en la pagina del asistente",
        },
        aiSessionResumes: {
          label: "Reanudaciones de sesion IA",
          detail: "Veces que una conversacion guardada de IA se reabrio desde el historial",
        },
        aiEscalations: {
          label: "Escaladas IA",
          detail: "Se activan al detectar palabras de riesgo",
        },
        dashboardViews: {
          label: "Vistas de dashboard",
          detail: "Registradas al entrar en la ruta del dashboard",
        },
        signIns: {
          label: "Accesos guardados",
          detail: "Inicios de sesion exitosos en modo demo o Firebase",
        },
        weightLogs: {
          label: "Registros de peso",
          detail: "Se cuentan cuando el usuario guarda una entrada de peso",
        },
        mealLogs: {
          label: "Registros de comidas",
          detail: "Se cuentan cuando el usuario guarda una entrada de comida",
        },
        contentViews: {
          label: "Vistas de contenido",
          detail: "Se registran al abrir una guia publicada",
        },
        contentPublished: {
          label: "Guias publicadas",
          detail: "Se registran cuando admin guarda una guia como publicada",
        },
      },
      eventLabels: {
        calculator_completed: "Calculo completado",
        ai_chat_started: "Chat IA iniciado",
        ai_session_resumed: "Sesion IA reanudada",
        ai_risk_escalated: "Escalada IA",
        dashboard_viewed: "Dashboard visto",
        ai_entry_clicked: "Entrada a IA clicada",
        result_ai_clicked: "Clic de resultado a IA",
        weight_ai_clicked: "Clic de peso a IA",
        retention_cta_clicked: "Clic en CTA de retencion",
        signup_completed: "Acceso guardado",
        meal_log_created: "Registro de comida creado",
        weight_log_created: "Registro de peso creado",
        content_page_viewed: "Pagina de contenido vista",
        content_page_published: "Pagina de contenido publicada",
      },
      aiEntryTitle: "Fuentes de entrada a IA",
      aiEntryBody:
        "Mira que superficies del calculador, dashboard y contenido realmente empujan usuarios hacia IA.",
      aiEntryEmpty:
        "Aun no hay clics hacia IA. Usa CTAs desde resultados, dashboard, revisiones de comidas o peso, o articulos del blog.",
      aiSourceLabels: {
        calculator_result_primary: "CTA principal del resultado",
        calculator_result_follow_up: "Tarjetas de seguimiento del resultado",
        dashboard_overview_plan: "CTA del plan calorico",
        dashboard_overview_recent_targets: "CTA de objetivos recientes",
        dashboard_weekly_checkin: "CTA del chequeo semanal",
        dashboard_weight_summary: "CTA del resumen de peso",
        dashboard_weight_weekly_review: "CTA de revision semanal de peso",
        dashboard_weight: "CTA IA de la pagina de peso",
        dashboard_meals_plan: "CTA del plan diario de comidas",
        dashboard_meals_weekly_review: "CTA de revision semanal de comidas",
        blog_article_tool_cta: "CTA de herramienta en articulo",
        blog_article_footer: "CTA del pie del articulo",
        direct: "Visita directa a la pagina IA",
        unknown: "Fuente desconocida",
      },
      aiConversionTitle: "Conversion de entrada a chat IA",
      aiConversionBody:
        "Compara que entradas a IA solo reciben clics y cuales realmente terminan en una pregunta enviada.",
      aiConversionEmpty:
        "Todavia no hay chats IA con fuente atribuida. Entra a IA desde un punto rastreado y envia una pregunta para llenar esta vista.",
      aiConversionEntryClicksLabel: "Clics de entrada",
      aiConversionChatStartsLabel: "Chats iniciados",
      aiConversionRateLabel: "Clic a chat",
      aiConversionRateEmpty: "Sin clics aun",
      aiQualityTitle: "Calidad del chat IA por fuente",
      aiQualityBody:
        "Mira que entradas generan conversaciones mejor apoyadas por contexto guardado y cuales disparan mas escaladas de riesgo medico.",
      aiQualityEmpty:
        "Todavia no hay chats IA. Envia al menos una pregunta desde la pagina IA para llenar estas metricas.",
      aiQualityChatsLabel: "Chats",
      aiQualityContextLabel: "Chats con contexto",
      aiQualityContextRateLabel: "Cobertura de contexto",
      aiQualityContextRateEmpty: "Sin chats aun",
      aiQualityRiskLabel: "Escaladas de riesgo",
      aiQualityRiskRateLabel: "Tasa de riesgo",
      aiQualityRiskRateEmpty: "Sin chats aun",
      aiDepthTitle: "Profundidad de sesion IA por fuente",
      aiDepthBody:
        "Separa preguntas aisladas de conversaciones reales comparando sesiones, seguimientos y profundidad media por fuente de entrada.",
      aiDepthEmpty:
        "Todavia no hay sesiones IA. Envia al menos una pregunta para llenar estas metricas de profundidad.",
      aiDepthSessionsLabel: "Sesiones",
      aiDepthMessagesLabel: "Mensajes",
      aiDepthAverageLabel: "Promedio de mensajes / sesion",
      aiDepthAverageEmpty: "Sin sesiones aun",
      aiDepthFollowUpsLabel: "Mensajes de seguimiento",
      aiDepthContinuationLabel: "Sesiones con seguimiento",
      aiDepthContinuationEmpty: "Sin sesiones aun",
      aiResumeTitle: "Reanudaciones de sesiones IA",
      aiResumeBody:
        "Mira que hilos guardados de IA los usuarios deciden reabrir, cuanta profundidad ya tenia cada sesion y con que frecuencia arrastran contexto de riesgo medico.",
      aiResumeEmpty:
        "Todavia no hay reanudaciones de sesiones IA. Reabre una conversacion guardada desde el historial para llenar este bloque.",
      aiResumeCountLabel: "Reanudaciones",
      aiResumeShareLabel: "Cuota de reanudaciones",
      aiResumeShareEmpty: "Sin reanudaciones aun",
      aiResumeAverageLabel: "Promedio de mensajes / sesion reanudada",
      aiResumeAverageEmpty: "Sin reanudaciones aun",
      aiResumeRiskLabel: "Reanudaciones con contexto de riesgo",
      aiResumeRiskRateLabel: "Tasa de contexto de riesgo",
      aiResumeRiskRateEmpty: "Sin reanudaciones aun",
      aiPromptOriginTitle: "Como empiezan las preguntas IA",
      aiPromptOriginBody:
        "Compara si los usuarios inician conversaciones IA escribiendo manualmente, enviando prompts precargados, usando sugerencias de contexto, reutilizando historial o tocando preguntas sugeridas.",
      aiPromptOriginEmpty:
        "Todavia no hay datos sobre el origen de las preguntas. Envia al menos una pregunta desde la pagina IA para llenar este bloque.",
      aiPromptOriginLabels: {
        manual_submit: "Envio manual",
        prefilled_prompt: "Prompt precargado",
        context_prompt: "Sugerencia de contexto",
        history_reuse: "Reutilizar historial",
        suggested_prompt: "Pregunta sugerida",
        unknown: "Origen desconocido",
      },
      aiPromptOriginChatsLabel: "Chats",
      aiPromptOriginFollowUpsLabel: "Chats de seguimiento",
      aiPromptOriginFollowUpRateLabel: "Cuota de seguimiento",
      aiPromptOriginFollowUpRateEmpty: "Sin chats aun",
      aiPromptOriginRiskLabel: "Escaladas de riesgo",
      aiPromptOriginRiskRateLabel: "Tasa de riesgo",
      aiPromptOriginRiskRateEmpty: "Sin chats aun",
      aiSourcePromptMixTitle: "Como se usa cada fuente de IA",
      aiSourcePromptMixBody:
        "Mira si cada entrada a IA convierte sobre todo mediante prompts precargados, reescritura manual, sugerencias de contexto o hilos retomados. Asi se detecta rapido cuando un punto de entrada no esta guiando bien.",
      aiSourcePromptMixEmpty:
        "Todavia no hay analitica de fuente a tipo de prompt. Entra a IA desde un punto rastreado y envia al menos una pregunta para llenar esta vista.",
      aiSourcePromptMixChatsLabel: "Chats",
      aiSourcePromptMixDominantLabel: "Estilo dominante de inicio",
      aiSourcePromptMixDominantEmpty: "Sin mezcla aun",
      signUpSourceTitle: "Accesos guardados por fuente",
      signUpSourceBody:
        "Mira que superficies publicas realmente convierten visitantes anonimos en usuarios guardados, en vez de solo generar clics o preguntas aisladas a la IA.",
      signUpSourceEmpty:
        "Todavia no hay accesos guardados. Entra por un punto de acceso rastreado y completa al menos un inicio de sesion para llenar esta vista.",
      signUpSourceLabels: {
        marketing_nav: "Acceso desde navegacion",
        calculator_result_save: "CTA de guardar en resultado",
        ai_page_save: "CTA de guardar en IA",
        dashboard_gate: "Redireccion del acceso al dashboard",
        unknown: "Fuente desconocida",
      },
      signUpSourceSignUpsLabel: "Accesos guardados",
      signUpSourceShareLabel: "Cuota de accesos",
      signUpSourceShareEmpty: "Sin accesos aun",
      totalsTitle: "Totales",
      totalsBody: "Total de eventos analiticos capturados dentro de la ventana seleccionada.",
      recentEventsTitle: "Eventos recientes",
      recentEventsEmpty:
        "Todavia no hay eventos. Usa la calculadora, la pagina de resultado, la IA, el acceso o el dashboard para generar actividad.",
      funnelTitle: "Embudo de usuarios",
      funnelCards: {
        anonymous: { label: "Anonimo", detail: "Visitantes en la parte alta del embudo" },
        saved: { label: "Guardado", detail: "Perfiles ligados a una identidad por correo" },
        tracking: { label: "Seguimiento", detail: "Usuarios que registran peso o comidas" },
      },
      anonymousToSavedLabel: "Anonimo a guardado",
      savedToTrackingLabel: "Guardado a seguimiento",
      anonymousToTrackingLabel: "Anonimo a seguimiento",
      localeMixTitle: "Mezcla de idiomas",
      localeMixEmpty:
        "Aun no hay snapshots de usuarios. La calculadora y el dashboard llenaran esta mezcla.",
      signUpRetentionTitle: "Retencion de usuarios guardados por fuente",
      signUpRetentionBody:
        "Usa el snapshot actual para comparar que entradas de acceso solo crean usuarios guardados y cuales realmente llevan despues a comportamiento de seguimiento activo.",
      signUpRetentionEmpty:
        "Todavia no hay snapshot de usuarios guardados por fuente. Completa al menos un acceso rastreado para llenar esta vista.",
      signUpRetentionSavedProfilesLabel: "Usuarios guardados",
      signUpRetentionShareLabel: "Cuota de usuarios guardados",
      signUpRetentionShareEmpty: "Sin usuarios guardados aun",
      signUpRetentionTrackingRateLabel: "Tasa de seguimiento",
      signUpRetentionTrackingRateEmpty: "Sin usuarios guardados aun",
      snapshotBadge: "Snapshot actual",
      usersSuffix: "usuarios",
      activeTrackingLabel: "Seguimiento activo",
      controlsTitle: "Lo que este admin ya controla",
      controlCards: [
        {
          title: "Vista del recorrido",
          body: "Los clics del resultado, el uso de IA y las visitas al dashboard ya estan vivos en el prototipo.",
        },
        {
          title: "Vista de usuarios",
          body: "Admin puede ver quien sigue anonimo, quien guardo un perfil y quien continua registrando.",
        },
        {
          title: "Control de reglas",
          body: "Las ediciones del paquete de reglas se guardan localmente y afectan al resultado enseguida.",
        },
      ],
    },
    contentPage: {
      eyebrow: "Gestion de contenido",
      title: "Publica contenido de embarazo orientado a busqueda sin salir del producto.",
      body: "Estas paginas se guardan localmente en el prototipo, se publican bajo rutas localizadas del blog y ya pueden servir como capa SEO alrededor de la calculadora.",
    },
    contentEditor: {
      formatSavedMessage: (title) => `Guardado: ${title}.`,
      saveError: "No se pudo guardar la pagina.",
      newPageEyebrow: "Nueva pagina",
      newPageTitle: "Crear contenido SEO directamente desde admin",
      createPageLabel: "Crear pagina",
      savingLabel: "Guardando...",
      localePlaceholder: "Idioma",
      slugPlaceholder: "Slug",
      statusLabels: {
        draft: "borrador",
        published: "publicado",
      },
      titlePlaceholder: "Titulo",
      descriptionPlaceholder: "Descripcion",
      bodyPlaceholder: "Cuerpo",
      saveLabel: "Guardar",
      openLiveLabel: "Abrir pagina publicada",
    },
    guidelinesPage: {
      eyebrow: "Paquetes de guia",
      title: "Cambia la logica regional sin tocar codigo.",
      body: "Estas ediciones persisten en un JSON local del prototipo y la API de calculo las relee enseguida. Asi este admin hace cambios reales y no solo muestra una maqueta.",
    },
    guidelinesEditor: {
      formatSavedMessage: (name) => `Guardado: ${name}.`,
      saveError: "No se pudo guardar el paquete.",
      savingLabel: "Guardando...",
      savePackLabel: "Guardar paquete",
      displayNameLabel: "Nombre visible",
      countryCodeLabel: "Codigo de pais",
      trimester1Label: "Calorias extra trimestre 1",
      trimester2Label: "Calorias extra trimestre 2",
      trimester3Label: "Calorias extra trimestre 3",
      disclaimerKeyLabel: "Clave del aviso",
    },
    usersPage: {
      eyebrow: "Vista de usuarios",
      title: "Lee quien se queda y quien rebota.",
      body: "Esta vista lee el almacen local de actividad del prototipo, asi que el uso de calculadora, IA, dashboard, accesos y seguimiento ya aparece como registros reales.",
      emptyTitle: "Todavia no hay actividad de usuarios",
      emptyBody: "Usa la calculadora, el acceso, el guardado del perfil o las paginas de seguimiento para generar registros en esta vista.",
      anonymousVisitor: "Visitante anonima",
      noSignInYet: "Sin acceso aun",
      localeRegionLabel: "Idioma / region",
      weekLabel: "Semana",
      calculatorLabel: "Calculadora",
      sessionsSuffix: "sesiones",
      latestTargetLabel: "Ultimo objetivo",
      aiCtaClicksLabel: "Clics del CTA IA",
      engagementLabel: "Interaccion",
      dashboardViewsSuffix: "vistas de dashboard",
      aiChatsSuffix: "chats IA",
      trackingLabel: "Seguimiento",
      weightLogsSuffix: "registros de peso",
      mealLogsSuffix: "registros de comida",
      signUpSourceLabel: "Guardado desde",
      signUpSourceLabels: {
        marketing_nav: "Navegacion",
        calculator_result_save: "CTA de guardar en resultado",
        ai_page_save: "CTA de guardar en IA",
        dashboard_gate: "Bloqueo del dashboard",
        unknown: "Fuente desconocida",
      },
      signalLabel: "Senal",
      statusLabels: {
        anonymous: "anonima",
        saved_profile: "perfil guardado",
        active_tracking: "seguimiento activo",
      },
      signalLabels: {
        anonymous: "Parte alta del embudo",
        saved_profile: "Activada",
        active_tracking: "Retencion",
      },
      sortHint: "El orden sigue la actividad mas reciente.",
    },
  },
};

export function getAdminCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}
