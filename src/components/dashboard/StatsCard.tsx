import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
}

export default function StatCard({ label, value, sub, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-4 animate-fadeInUp"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-sm)",
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}
        >
          <Icon size={18} style={{ color }} />
        </div>

        <span className="font-mono-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {value}
        </span>
      </div>

      <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{label}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
    </div>
  );
}