import React, { memo } from "react";

type BarProps = {
  label: string;
  color: string;
  count: number;
  total: number;
};

export const Bar = memo(({ label, color, count, total }: BarProps) => {
  const percent = total === 0 ? 0 : (count / total) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
        <span className="text-sm font-mono-display font-bold" style={{ color: "var(--text-primary)" }}>{count}</span>
      </div>
      <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
        <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: color }} />
      </div>
    </div>
  );
});