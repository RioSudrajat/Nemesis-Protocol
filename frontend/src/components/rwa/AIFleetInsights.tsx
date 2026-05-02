import type { AIFleetInsight } from '@/types/rwa'

interface AIFleetInsightsProps {
  insights: AIFleetInsight[]
}

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    badgeClass: 'border-rose-200/18 bg-white/[0.045] text-rose-100/90',
    dotClass: 'bg-rose-300 shadow-[0_0_16px_rgba(253,164,175,0.24)]',
    confidenceClass: 'text-rose-100/90',
  },
  warning: {
    label: 'Warning',
    badgeClass: 'border-white/[0.08] bg-white/[0.04] text-amber-100/82',
    dotClass: 'bg-amber-300/90 shadow-[0_0_16px_rgba(252,211,77,0.2)]',
    confidenceClass: 'text-amber-100/84',
  },
  info: {
    label: 'Signal',
    badgeClass: 'border-white/[0.08] bg-white/[0.035] text-white/62',
    dotClass: 'bg-teal-300/80 shadow-[0_0_16px_rgba(94,234,212,0.18)]',
    confidenceClass: 'text-teal-100/78',
  },
}

const CATEGORY_LABEL: Record<AIFleetInsight['category'], string> = {
  maintenance: 'Maintenance',
  battery: 'Battery',
  utilization: 'Utilization',
  performance: 'Performance',
}

export function AIFleetInsights({ insights }: AIFleetInsightsProps) {
  return (
    <div className="flex flex-col gap-3">
      {insights.map((insight, idx) => {
        const cfg = SEVERITY_CONFIG[insight.severity]
        return (
          <article
            key={`${insight.unitId ?? insight.category}-${idx}`}
            className="rounded-2xl border border-white/[0.075] bg-[#0B0C0C] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition hover:bg-white/[0.035]"
          >
            <div className="flex items-start gap-3">
              <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${cfg.dotClass}`} />
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {insight.unitId && (
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-teal-100/78">
                      {insight.unitId}
                    </span>
                  )}
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${cfg.badgeClass}`}>
                    {cfg.label}
                  </span>
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/38">
                    {CATEGORY_LABEL[insight.category]}
                  </span>
                </div>

                <p className="text-sm font-semibold leading-6 text-white/84">
                  {insight.message}
                </p>
                <p className="mt-1 text-xs leading-5 text-white/43">
                  Prediction: {insight.prediction}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className={`text-sm font-semibold ${cfg.confidenceClass}`}>
                  {insight.confidence}%
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/30">
                  Confidence
                </div>
              </div>
            </div>
          </article>
        )
      })}

      {insights.length === 0 && (
        <div className="rounded-2xl border border-white/[0.075] bg-[#0B0C0C] px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
          <p className="text-sm font-semibold text-white/78">No active fleet intelligence signals</p>
          <p className="mt-1 text-xs text-white/40">
            Predictive alerts will appear after new route logs and service proofs are processed.
          </p>
        </div>
      )}
    </div>
  )
}
