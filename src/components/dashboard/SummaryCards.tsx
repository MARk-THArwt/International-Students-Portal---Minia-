import { useEffect, useRef } from "react";
import type { ReportSummary } from "../../store/slices/reportsSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SummaryCardsProps {
  summary: ReportSummary;
}

interface CardConfig {
  label: string;
  value: number;
  icon: string;
  gradient: string;
  shadowColor: string;
  iconBg: string;
  trend: string;
  trendColor: string;
}

// ─── Animated Counter Hook ────────────────────────────────────────────────────

function useCountUp(target: number | undefined, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const safeTarget = typeof target === 'number' && !isNaN(target) ? target : 0;
    
    if (safeTarget === 0) {
      el.textContent = "0";
      return;
    }

    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (safeTarget - from) * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return ref;
}

// ─── Individual Card ──────────────────────────────────────────────────────────

function SummaryCard({ card }: { card: CardConfig }) {
  const counterRef = useCountUp(card.value);

  return (
    <div
      className="summary-card"
      style={{
        background: card.gradient,
        boxShadow: `0 8px 32px ${card.shadowColor}`,
      }}
    >
      {/* Decorative orb */}
      <div className="summary-card__orb" />

      {/* Header row */}
      <div className="summary-card__header">
        <div
          className="summary-card__icon"
          style={{ background: card.iconBg }}
        >
          <span>{card.icon}</span>
        </div>
        <span
          className="summary-card__trend"
          style={{ color: card.trendColor }}
        >
          {card.trend}
        </span>
      </div>

      {/* Value */}
      <div className="summary-card__value">
        <span ref={counterRef}>0</span>
      </div>

      {/* Label */}
      <p className="summary-card__label">{card.label}</p>

      {/* Progress bar accent */}
      <div className="summary-card__bar" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards: CardConfig[] = [
    {
      label: "Total Requests",
      value: summary?.totalRequests ?? 0,
      icon: "📋",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadowColor: "rgba(102,126,234,0.40)",
      iconBg: "rgba(255,255,255,0.20)",
      trend: "↑ Active",
      trendColor: "#c7d2fe",
    },
    {
      label: "Total Services",
      value: summary?.totalServices ?? 0,
      icon: "⚙️",
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      shadowColor: "rgba(17,153,142,0.40)",
      iconBg: "rgba(255,255,255,0.20)",
      trend: "↑ Running",
      trendColor: "#bbf7d0",
    },
    {
      label: "Total Students",
      value: summary?.totalStudents ?? 0,
      icon: "🎓",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      shadowColor: "rgba(240,147,251,0.40)",
      iconBg: "rgba(255,255,255,0.20)",
      trend: "↑ Enrolled",
      trendColor: "#fecdd3",
    },
  ];

  return (
    <div className="summary-cards-grid">
      {cards.map((card) => (
        <SummaryCard key={card.label} card={card} />
      ))}
    </div>
  );
}
