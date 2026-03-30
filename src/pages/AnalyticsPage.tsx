// pages/AnalyticsPage.tsx
import { useEffect, useMemo, useRef } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { CompletionCircle } from "../components/analytics/CompletionCircle";

type BarProps = {
  label: string;
  color: string;
  count: number;
  total: number;
};

const Bar = ({ label, color, count, total }: BarProps) => {
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
};

export default function AnalyticsPage() {
  const { tasks, loadTasks } = useTaskStore((s) => ({ tasks: s.tasks, loadTasks: s.loadTasks }));
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadTasks();
  }, [loadTasks]);

  const analytics = useMemo(() => {
    let high = 0, medium = 0, low = 0;
    let todo = 0, progress = 0, done = 0;

    for (const t of tasks) {
      if (t.priority === "high") high++;
      else if (t.priority === "medium") medium++;
      else if (t.priority === "low") low++;

      if (t.status === "todo") todo++;
      else if (t.status === "progress") progress++;
      else if (t.status === "done") done++;
    }

    const total = tasks.length;
    const completion = total === 0 ? 0 : Math.round((done / total) * 100);

    return { total, high, medium, low, todo, progress, done, completion };
  }, [tasks]);

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h1 className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}>Analytics</h1>
        <p className="text-sm mt-0.5"
          style={{ color: "var(--text-muted)" }}>Task insights and progress overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Priority */}
        <div className="rounded-2xl p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
          <h2 className="font-semibold text-sm mb-5"
            style={{ color: "var(--text-primary)" }}>Tasks by Priority</h2>
          <div className="space-y-4">
            <Bar label="High Priority" color="var(--danger)" count={analytics.high} total={analytics.total} />
            <Bar label="Medium Priority" color="var(--warning)" count={analytics.medium} total={analytics.total} />
            <Bar label="Low Priority" color="var(--success)" count={analytics.low} total={analytics.total} />
          </div>
        </div>

        {/* Status */}
        <div className="rounded-2xl p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
          <h2 className="font-semibold text-sm mb-5"
            style={{ color: "var(--text-primary)" }}>Tasks by Status</h2>
          <div className="space-y-4">
            <Bar label="To Do" color="var(--danger)" count={analytics.todo} total={analytics.total} />
            <Bar label="In Progress" color="var(--warning)" count={analytics.progress} total={analytics.total} />
            <Bar label="Done" color="var(--success)" count={analytics.done} total={analytics.total} />
          </div>
        </div>
      </div>

      <CompletionCircle completion={analytics.completion} done={analytics.done} total={analytics.total} />
    </div>
  );
}