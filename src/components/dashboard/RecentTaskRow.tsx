import React from "react";
import { Clock3 } from "lucide-react";

interface RecentTaskRowProps {
  task: any;
  priorityColor: Record<string, string>;
  priorityBg: Record<string, string>;
  formatDate: (date: string) => string;
}

export default function RecentTaskRow({ task, priorityColor, priorityBg, formatDate }: RecentTaskRowProps) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-2"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 text-center"
          style={{
            width: 70,
            color: priorityColor[task.priority],
            background: priorityBg[task.priority],
          }}
        >
          {task.priority.toUpperCase()}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{task.title}</p>
          <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{task.status}</p>
        </div>
      </div>

      <div
        className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium"
        style={{
          background: "var(--bg-surface-2)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
        }}
      >
        <Clock3 size={12} />
        <span>{formatDate(task.date)}</span>
      </div>
    </div>
  );
}