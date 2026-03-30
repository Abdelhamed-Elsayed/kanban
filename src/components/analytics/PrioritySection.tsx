// components/analytics/PrioritySection.tsx
import React from "react";
import { Bar } from "./Bar";

interface Props {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export const PrioritySection = ({ high, medium, low, total }: Props) => (
  <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
    <h2 className="font-semibold text-sm mb-5" style={{ color: "var(--text-primary)" }}>Tasks by Priority</h2>
    <div className="space-y-4">
      <Bar label="High Priority" color="var(--danger)" count={high} total={total} />
      <Bar label="Medium Priority" color="var(--warning)" count={medium} total={total} />
      <Bar label="Low Priority" color="var(--success)" count={low} total={total} />
    </div>
  </div>
);