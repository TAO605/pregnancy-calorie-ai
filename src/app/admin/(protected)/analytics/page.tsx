import Link from "next/link";

import { getAdminUserActivityOverview } from "@/lib/admin/user-activity-store";
import {
  analyticsRanges,
  getAnalyticsOverview,
  parseAnalyticsRange,
  type AnalyticsRange,
} from "@/lib/analytics/store";
import { getAdminRetentionCtaCopy } from "@/lib/i18n/admin-retention-cta-copy";
import { getAdminCopy } from "@/lib/i18n/admin-copy";
import { getPreferredRequestLocale } from "@/lib/i18n/request-locale";

type AdminAnalyticsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatTimestamp(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildRangeHref(range: AnalyticsRange) {
  return `/admin/analytics?range=${range}`;
}

function getGuideTopicAnalyticsCopy(locale: string) {
  if (locale === "zh-CN") {
    return {
      title: "\u5185\u5bb9\u4e3b\u9898\u8868\u73b0",
      body: "\u6309\u6307\u5357\u4e3b\u9898\u67e5\u770b\u5185\u5bb9\u6d4f\u89c8\u548c\u4ece\u6587\u7ae0\u8fdb\u5165 AI \u7684\u70b9\u51fb\u3002",
      empty: "\u8fd8\u6ca1\u6709\u5e26\u4e3b\u9898\u7684\u5185\u5bb9\u4e8b\u4ef6\u3002\u6253\u5f00\u4e00\u7bc7\u6307\u5357\u6216\u70b9\u51fb\u6587\u7ae0\u91cc\u7684 AI CTA \u540e\u4f1a\u51fa\u73b0\u3002",
      views: "\u6d4f\u89c8",
      aiClicks: "AI \u70b9\u51fb",
      aiEntryRate: "AI \u8fdb\u5165\u7387",
      rateEmpty: "\u65e0\u6d4f\u89c8",
    };
  }

  if (locale === "es") {
    return {
      title: "Rendimiento por tema",
      body: "Compara vistas de guias y clics hacia IA por tema editorial.",
      empty: "Aun no hay eventos de contenido con tema. Abre una guia o usa un CTA de IA dentro de un articulo.",
      views: "Vistas",
      aiClicks: "Clics IA",
      aiEntryRate: "Tasa hacia IA",
      rateEmpty: "Sin vistas",
    };
  }

  return {
    title: "Guide topic performance",
    body: "Compare guide views and article-to-AI clicks by editorial topic.",
    empty: "No guide topic events yet. Open a guide or use an article AI CTA to populate this section.",
    views: "Views",
    aiClicks: "AI clicks",
    aiEntryRate: "AI entry rate",
    rateEmpty: "No views",
  };
}

export default async function AdminAnalyticsPage({
  searchParams,
}: AdminAnalyticsPageProps) {
  const [query, locale] = await Promise.all([
    searchParams,
    getPreferredRequestLocale(),
  ]);
  const currentRange = parseAnalyticsRange(query.range);
  const copy = getAdminCopy(locale);
  const retentionCopy = getAdminRetentionCtaCopy(locale);
  const guideTopicCopy = getGuideTopicAnalyticsCopy(locale);
  const [overview, userOverview] = await Promise.all([
    getAnalyticsOverview({ range: currentRange }),
    getAdminUserActivityOverview(),
  ]);
  const rangeOptions = analyticsRanges.map((range) => ({
    value: range,
    label: copy.analytics.rangeLabels[range],
  }));
  const liveMetrics = [
    {
      label: copy.analytics.metrics.calculatorCompleted.label,
      value: String(overview.counts.calculator_completed),
      detail: copy.analytics.metrics.calculatorCompleted.detail,
    },
    {
      label: copy.analytics.metrics.resultAiClicked.label,
      value: String(overview.counts.result_ai_clicked),
      detail: copy.analytics.metrics.resultAiClicked.detail,
    },
    {
      label: copy.analytics.metrics.weightAiClicked.label,
      value: String(overview.counts.weight_ai_clicked),
      detail: copy.analytics.metrics.weightAiClicked.detail,
    },
    {
      label: copy.analytics.metrics.aiEntryClicks.label,
      value: String(overview.aiEntryTotal),
      detail: copy.analytics.metrics.aiEntryClicks.detail,
    },
    {
      label: copy.analytics.metrics.aiChats.label,
      value: String(overview.counts.ai_chat_started),
      detail: copy.analytics.metrics.aiChats.detail,
    },
    {
      label: copy.analytics.metrics.aiSessionResumes.label,
      value: String(overview.counts.ai_session_resumed),
      detail: copy.analytics.metrics.aiSessionResumes.detail,
    },
    {
      label: copy.analytics.metrics.aiEscalations.label,
      value: String(overview.counts.ai_risk_escalated),
      detail: copy.analytics.metrics.aiEscalations.detail,
    },
    {
      label: copy.analytics.metrics.dashboardViews.label,
      value: String(overview.counts.dashboard_viewed),
      detail: copy.analytics.metrics.dashboardViews.detail,
    },
    {
      label: copy.analytics.metrics.signIns.label,
      value: String(overview.counts.signup_completed),
      detail: copy.analytics.metrics.signIns.detail,
    },
    {
      label: retentionCopy.metric.label,
      value: String(overview.counts.retention_cta_clicked),
      detail: retentionCopy.metric.detail,
    },
    {
      label: copy.analytics.metrics.weightLogs.label,
      value: String(overview.counts.weight_log_created),
      detail: copy.analytics.metrics.weightLogs.detail,
    },
    {
      label: copy.analytics.metrics.mealLogs.label,
      value: String(overview.counts.meal_log_created),
      detail: copy.analytics.metrics.mealLogs.detail,
    },
    {
      label: copy.analytics.metrics.contentViews.label,
      value: String(overview.counts.content_page_viewed),
      detail: copy.analytics.metrics.contentViews.detail,
    },
    {
      label: copy.analytics.metrics.contentPublished.label,
      value: String(overview.counts.content_page_published),
      detail: copy.analytics.metrics.contentPublished.detail,
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="surface-card rounded-[2rem] p-8 md:p-10">
        <span className="eyebrow">{copy.analytics.overviewEyebrow}</span>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
          {copy.analytics.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          {copy.analytics.body}
        </p>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.analytics.rangeTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {copy.analytics.rangeBody}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {rangeOptions.map((option) => {
              const isActive = option.value === currentRange;

              return (
                <Link
                  key={option.value}
                  href={buildRangeHref(option.value)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[rgb(10,114,239)] text-white shadow-[0_16px_40px_rgba(10,114,239,0.2)]"
                      : "bg-white/88 text-muted shadow-border hover:bg-white"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {liveMetrics.map((metric) => (
          <article key={metric.label} className="surface-card rounded-[1.8rem] p-7">
            <p className="text-sm font-medium text-muted">{metric.label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">{metric.value}</p>
            <p className="mt-3 text-sm leading-7 text-muted">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {guideTopicCopy.title}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {guideTopicCopy.body}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {overview.guideTopicBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{guideTopicCopy.empty}</p>
            </div>
          ) : (
            overview.guideTopicBreakdown.map((item) => (
              <article
                key={item.topic}
                className="rounded-[1.3rem] bg-white/88 p-5 shadow-border"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {guideTopicCopy.aiEntryRate}:{" "}
                    {item.aiEntryRate === null
                      ? guideTopicCopy.rateEmpty
                      : `${item.aiEntryRate}%`}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {guideTopicCopy.views}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.views}
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] bg-[rgba(255,122,89,0.08)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {guideTopicCopy.aiClicks}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.aiEntryClicks}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.analytics.aiEntryTitle}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {copy.analytics.aiEntryBody}
            </p>
          </div>
          <p className="text-3xl font-semibold tracking-[-0.06em]">{overview.aiEntryTotal}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overview.aiEntryBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.aiEntryEmpty}</p>
            </div>
          ) : (
            overview.aiEntryBreakdown.map((item) => (
              <article key={item.source} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <p className="text-sm font-medium text-muted">
                  {copy.analytics.aiSourceLabels[item.source]}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">{item.count}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.aiConversionTitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {copy.analytics.aiConversionBody}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {overview.aiSourceConversionBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.aiConversionEmpty}</p>
            </div>
          ) : (
            overview.aiSourceConversionBreakdown.map((item) => (
              <article key={item.source} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {copy.analytics.aiSourceLabels[item.source]}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {copy.analytics.aiConversionRateLabel}:{" "}
                    {item.conversionRate === null
                      ? copy.analytics.aiConversionRateEmpty
                      : `${item.conversionRate}%`}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiConversionEntryClicksLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.entryClicks}
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] bg-white p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiConversionChatStartsLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.chatStarts}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.aiQualityTitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {copy.analytics.aiQualityBody}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {overview.aiSourceQualityBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.aiQualityEmpty}</p>
            </div>
          ) : (
            overview.aiSourceQualityBreakdown.map((item) => (
              <article key={item.source} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {copy.analytics.aiSourceLabels[item.source]}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {copy.analytics.aiQualityChatsLabel}: {item.chatStarts}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiQualityContextRateLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.contextRate === null
                        ? copy.analytics.aiQualityContextRateEmpty
                        : `${item.contextRate}%`}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.aiQualityContextLabel}: {item.contextBackedChats}
                    </p>
                  </div>

                  <div className="rounded-[1.1rem] bg-[rgba(255,122,89,0.08)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiQualityRiskRateLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.riskRate === null
                        ? copy.analytics.aiQualityRiskRateEmpty
                        : `${item.riskRate}%`}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.aiQualityRiskLabel}: {item.riskEscalations}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.aiDepthTitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {copy.analytics.aiDepthBody}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {overview.aiSourceSessionDepthBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.aiDepthEmpty}</p>
            </div>
          ) : (
            overview.aiSourceSessionDepthBreakdown.map((item) => (
              <article key={item.source} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {copy.analytics.aiSourceLabels[item.source]}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {copy.analytics.aiDepthAverageLabel}:{" "}
                    {item.averageMessagesPerSession === null
                      ? copy.analytics.aiDepthAverageEmpty
                      : item.averageMessagesPerSession}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiDepthSessionsLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.sessions}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.aiDepthMessagesLabel}: {item.totalMessages}
                    </p>
                  </div>

                  <div className="rounded-[1.1rem] bg-[rgba(255,122,89,0.08)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiDepthContinuationLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.continuationRate === null
                        ? copy.analytics.aiDepthContinuationEmpty
                        : `${item.continuationRate}%`}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.aiDepthFollowUpsLabel}: {item.followUpMessages}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.aiResumeTitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {copy.analytics.aiResumeBody}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {overview.aiSessionResumeBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.aiResumeEmpty}</p>
            </div>
          ) : (
            overview.aiSessionResumeBreakdown.map((item) => (
              <article key={item.source} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {copy.analytics.aiSourceLabels[item.source]}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {copy.analytics.aiResumeShareLabel}:{" "}
                    {item.shareOfResumes === null
                      ? copy.analytics.aiResumeShareEmpty
                      : `${item.shareOfResumes}%`}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiResumeCountLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.resumes}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.aiResumeAverageLabel}:{" "}
                      {item.averageMessagesPerResume === null
                        ? copy.analytics.aiResumeAverageEmpty
                        : item.averageMessagesPerResume}
                    </p>
                  </div>

                  <div className="rounded-[1.1rem] bg-[rgba(255,122,89,0.08)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiResumeRiskRateLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.highRiskRate === null
                        ? copy.analytics.aiResumeRiskRateEmpty
                        : `${item.highRiskRate}%`}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.aiResumeRiskLabel}: {item.highRiskResumes}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.aiPromptOriginTitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {copy.analytics.aiPromptOriginBody}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {overview.aiPromptOriginBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.aiPromptOriginEmpty}</p>
            </div>
          ) : (
            overview.aiPromptOriginBreakdown.map((item) => (
              <article key={item.origin} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {copy.analytics.aiPromptOriginLabels[item.origin]}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {copy.analytics.aiPromptOriginChatsLabel}: {item.chats}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiPromptOriginFollowUpRateLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.followUpRate === null
                        ? copy.analytics.aiPromptOriginFollowUpRateEmpty
                        : `${item.followUpRate}%`}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.aiPromptOriginFollowUpsLabel}: {item.followUpChats}
                    </p>
                  </div>

                  <div className="rounded-[1.1rem] bg-[rgba(255,122,89,0.08)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.aiPromptOriginRiskRateLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.riskRate === null
                        ? copy.analytics.aiPromptOriginRiskRateEmpty
                        : `${item.riskRate}%`}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.aiPromptOriginRiskLabel}: {item.riskEscalations}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.aiSourcePromptMixTitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {copy.analytics.aiSourcePromptMixBody}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {overview.aiSourcePromptOriginBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.aiSourcePromptMixEmpty}</p>
            </div>
          ) : (
            overview.aiSourcePromptOriginBreakdown.map((item) => (
              <article key={item.source} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {copy.analytics.aiSourceLabels[item.source]}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {copy.analytics.aiSourcePromptMixChatsLabel}: {item.chats}
                  </p>
                </div>

                <p className="mt-4 text-sm text-muted">
                  {copy.analytics.aiSourcePromptMixDominantLabel}:{" "}
                  <span className="font-semibold text-foreground">
                    {copy.analytics.aiPromptOriginLabels[item.dominantOrigin]}
                  </span>
                  {item.dominantShare === null
                    ? ` (${copy.analytics.aiSourcePromptMixDominantEmpty})`
                    : ` (${item.dominantShare}%)`}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.origins.map((originItem) => (
                    <span
                      key={`${item.source}-${originItem.origin}`}
                      className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-xs font-semibold text-[#0a72ef]"
                    >
                      {copy.analytics.aiPromptOriginLabels[originItem.origin]}:{" "}
                      {originItem.chats}
                      {originItem.share === null ? "" : ` (${originItem.share}%)`}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.signUpSourceTitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {copy.analytics.signUpSourceBody}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {overview.signUpSourceBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.signUpSourceEmpty}</p>
            </div>
          ) : (
            overview.signUpSourceBreakdown.map((item) => (
              <article key={item.source} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {copy.analytics.signUpSourceLabels[item.source]}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {copy.analytics.signUpSourceShareLabel}:{" "}
                    {item.share === null
                      ? copy.analytics.signUpSourceShareEmpty
                      : `${item.share}%`}
                  </p>
                </div>

                <div className="mt-4 rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {copy.analytics.signUpSourceSignUpsLabel}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                    {item.signUps}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {retentionCopy.title}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {retentionCopy.body}
          </p>
        </div>

        {overview.retentionPromptSurfaceBreakdown.length === 0 ? (
          <div className="mt-6 rounded-[1.2rem] bg-white/88 p-4 shadow-border">
            <p className="text-sm text-muted">{retentionCopy.empty}</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {overview.retentionPromptSurfaceBreakdown.map((item) => (
                <article
                  key={item.surface}
                  className="rounded-[1.3rem] bg-white/88 p-5 shadow-border"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <p className="text-base font-semibold tracking-[-0.03em]">
                      {retentionCopy.surfaceLabels[item.surface]}
                    </p>
                    <p className="text-sm font-medium text-muted">
                      {retentionCopy.clicksLabel}: {item.clicks}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {retentionCopy.guestClicksLabel}
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                        {item.guestClicks}
                      </p>
                    </div>

                    <div className="rounded-[1.1rem] bg-[rgba(255,122,89,0.08)] p-4 shadow-border">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {retentionCopy.memberClicksLabel}
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                        {item.memberClicks}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  {retentionCopy.stateTitle}
                </p>
                <div className="mt-4 grid gap-3">
                  {overview.retentionPromptStateBreakdown.map((item) => (
                    <div
                      key={item.state}
                      className="flex items-center justify-between gap-4 rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border"
                    >
                      <p className="text-sm font-medium text-muted">
                        {retentionCopy.stateLabels[item.state]}
                      </p>
                      <p className="text-sm font-semibold tracking-[-0.02em]">
                        {item.clicks}{" "}
                        <span className="text-muted">
                          {item.share === null
                            ? `(${retentionCopy.shareEmpty})`
                            : `(${retentionCopy.shareLabel}: ${item.share}%)`}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  {retentionCopy.destinationTitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {overview.retentionPromptDestinationBreakdown.map((item) => (
                    <span
                      key={item.destination}
                      className="rounded-full bg-[rgba(255,122,89,0.1)] px-3 py-2 text-xs font-semibold text-[#a34c36]"
                    >
                      {retentionCopy.destinationLabels[item.destination]}: {item.clicks}
                      {item.share === null ? "" : ` (${item.share}%)`}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <article className="surface-card rounded-[1.8rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.totalsTitle}
          </p>
          <p className="mt-4 text-5xl font-semibold tracking-[-0.08em]">
            {overview.totalEvents}
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            {copy.analytics.totalsBody}
          </p>
        </article>

        <article className="surface-card rounded-[1.8rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.analytics.recentEventsTitle}
          </p>
          <div className="mt-5 grid gap-3">
            {overview.recentEvents.length === 0 ? (
              <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                <p className="text-sm text-muted">{copy.analytics.recentEventsEmpty}</p>
              </div>
            ) : (
              overview.recentEvents.map((event) => (
                <div key={event.id} className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold tracking-[-0.02em]">
                      {copy.analytics.eventLabels[event.name]}
                    </p>
                    <p className="text-xs text-muted">{event.locale}</p>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {formatTimestamp(event.createdAt, locale)}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="surface-card rounded-[1.8rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.analytics.funnelTitle}
            </p>
            <span className="rounded-full bg-[rgba(28,160,98,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(28,160,98)]">
              {copy.analytics.snapshotBadge}
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-sm font-medium text-muted">
                {copy.analytics.funnelCards.anonymous.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {userOverview.totals.anonymousUsers}
              </p>
              <p className="mt-2 text-sm text-muted">
                {copy.analytics.funnelCards.anonymous.detail}
              </p>
            </div>
            <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-sm font-medium text-muted">
                {copy.analytics.funnelCards.saved.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {userOverview.totals.savedProfiles}
              </p>
              <p className="mt-2 text-sm text-muted">
                {copy.analytics.funnelCards.saved.detail}
              </p>
            </div>
            <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-sm font-medium text-muted">
                {copy.analytics.funnelCards.tracking.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {userOverview.totals.activeTrackingUsers}
              </p>
              <p className="mt-2 text-sm text-muted">
                {copy.analytics.funnelCards.tracking.detail}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <div className="rounded-[1.2rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
              <p className="text-sm font-medium text-muted">
                {copy.analytics.anonymousToSavedLabel}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                {userOverview.funnel.anonymousToSavedRate}%
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-[rgba(255,122,89,0.08)] p-4 shadow-border">
              <p className="text-sm font-medium text-muted">
                {copy.analytics.savedToTrackingLabel}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                {userOverview.funnel.savedToTrackingRate}%
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-[rgba(28,160,98,0.1)] p-4 shadow-border">
              <p className="text-sm font-medium text-muted">
                {copy.analytics.anonymousToTrackingLabel}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                {userOverview.funnel.anonymousToTrackingRate}%
              </p>
            </div>
          </div>
        </article>

        <article className="surface-card rounded-[1.8rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.analytics.localeMixTitle}
            </p>
            <span className="rounded-full bg-[rgba(28,160,98,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(28,160,98)]">
              {copy.analytics.snapshotBadge}
            </span>
          </div>
          <div className="mt-6 grid gap-3">
            {userOverview.localeBreakdown.length === 0 ? (
              <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                <p className="text-sm text-muted">{copy.analytics.localeMixEmpty}</p>
              </div>
            ) : (
              userOverview.localeBreakdown.map((item) => (
                <div key={item.locale} className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold tracking-[-0.03em]">{item.locale}</p>
                    <p className="text-sm text-muted">
                      {item.users} {copy.analytics.usersSuffix}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {copy.analytics.activeTrackingLabel}: {item.activeTrackingUsers}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.analytics.signUpRetentionTitle}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {copy.analytics.signUpRetentionBody}
            </p>
          </div>
          <span className="rounded-full bg-[rgba(28,160,98,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(28,160,98)]">
            {copy.analytics.snapshotBadge}
          </span>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {userOverview.signUpSourceRetentionBreakdown.length === 0 ? (
            <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
              <p className="text-sm text-muted">{copy.analytics.signUpRetentionEmpty}</p>
            </div>
          ) : (
            userOverview.signUpSourceRetentionBreakdown.map((item) => (
              <article key={item.source} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {copy.analytics.signUpSourceLabels[item.source]}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    {copy.analytics.signUpRetentionShareLabel}:{" "}
                    {item.shareOfSavedProfiles === null
                      ? copy.analytics.signUpRetentionShareEmpty
                      : `${item.shareOfSavedProfiles}%`}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] bg-[rgba(10,114,239,0.06)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.signUpRetentionSavedProfilesLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.savedProfiles}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {copy.analytics.activeTrackingLabel}: {item.activeTrackingUsers}
                    </p>
                  </div>

                  <div className="rounded-[1.1rem] bg-[rgba(28,160,98,0.1)] p-4 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.analytics.signUpRetentionTrackingRateLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                      {item.trackingRate === null
                        ? copy.analytics.signUpRetentionTrackingRateEmpty
                        : `${item.trackingRate}%`}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          {copy.analytics.controlsTitle}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {copy.analytics.controlCards.map((card) => (
            <div key={card.title} className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-lg font-semibold tracking-[-0.04em]">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
