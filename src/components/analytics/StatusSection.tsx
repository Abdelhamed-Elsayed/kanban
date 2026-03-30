// components/analytics/StatusSection.tsx
import React from "react";
import { Bar } from "./Bar";

interface Props {
  todo: number;
  progress: number;
  done: number;
  total: number;
}

export const StatusSection = ({ todo, progress, done, total }: Props) => (
  <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
    <h2 className="font-semibold text-sm mb-5" style={{ color: "var(--text-primary)" }}>Tasks by Status</h2>
    <div className="space-y-4">
      <Bar label="To Do" color="var(--danger)" count={todo} total={total} />
      <Bar label="In Progress" color="var(--warning)" count={progress} total={total} />
      <Bar label="Done" color="var(--success)" count={done} total={total} />
    </div>
  </div>
);