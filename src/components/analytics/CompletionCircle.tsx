import React, { useMemo } from "react";

type CompletionCircleProps = {
  completion: number;
  done: number;
  total: number;
};

export const CompletionCircle = ({ completion, done, total }: CompletionCircleProps) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const offset = useMemo(() => {
    return circumference - (completion / 100) * circumference;
  }, [completion, circumference]);

  // تغيير اللون ديناميكي حسب النسبة
  const color = useMemo(() => {
    if (completion >= 80) return "var(--success)";
    if (completion >= 50) return "var(--warning)";
    return "var(--danger)";
  }, [completion]);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}
    >
      <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>
        Completion Rate
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-24 h-24 -rotate-90">
            <circle cx="48" cy="48" r={radius} stroke="var(--border)" strokeWidth="7" fill="transparent" />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={color}
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.3s ease" }}
            />
          </svg>

          <div
            className="absolute inset-0 flex items-center justify-center font-mono-display font-bold text-lg"
            style={{ color }}
          >
            {completion}%
          </div>
        </div>

        <div>
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {done} of {total} tasks completed
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Keep up the great work!
          </p>
        </div>
      </div>
    </div>
  );
};