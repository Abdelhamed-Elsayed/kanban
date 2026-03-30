import { useEffect, useMemo, useRef, useCallback } from "react";
import { useTaskStore } from "../store/useTaskStore";
import StatCard from "../components/dashboard/StatsCard";
import RecentTaskRow from "../components/dashboard/RecentTaskRow";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import { ClipboardList, AlertCircle, Clock3, CheckCircle2, KanbanSquare, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { tasks, loadTasks } = useTaskStore((s) => ({ tasks: s.tasks, loadTasks: s.loadTasks }));
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadTasks();
  }, [loadTasks]);

  const formatDate = useCallback((date: string) => new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }), []);

  const { total, high, inProgress, done, recent } = useMemo(() => {
    let high = 0, inProgress = 0, done = 0;
    for (const t of tasks) {
      if (t.priority === "high") high++;
      if (t.status === "progress") inProgress++;
      if (t.status === "done") done++;
    }
    const recent = [...tasks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    return { total: tasks.length, high, inProgress, done, recent };
  }, [tasks]);

  const stats = useMemo(() => [
    { label: "Total Tasks", value: total, sub: "Across all columns", icon: ClipboardList, color: "var(--accent)" },
    { label: "High Priority", value: high, sub: "Require attention", icon: AlertCircle, color: "var(--danger)" },
    { label: "In Progress", value: inProgress, sub: "Currently active", icon: Clock3, color: "var(--warning)" },
    { label: "Completed", value: done, sub: "Done tasks", icon: CheckCircle2, color: "var(--success)" },
  ], [total, high, inProgress, done]);

  const priorityColor: Record<string,string> = { high: "var(--danger)", medium: "var(--warning)", low: "var(--success)" };
  const priorityBg: Record<string,string> = { high: "var(--danger-light)", medium: "var(--warning-light)", low: "var(--success-light)" };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Overview of your workspace</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s,i) => <StatCard key={s.label} {...s} delay={i*60} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Recent Activity</h2>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>No tasks yet</p>}
            {recent.map(task => <RecentTaskRow key={task.id} task={task} priorityColor={priorityColor} priorityBg={priorityBg} formatDate={formatDate} />)}
          </div>
        </div>

        <div className="grid gap-3">
          <QuickActionCard title="View Board" description="Manage and move your tasks" icon={<KanbanSquare size={17} color="#fff" />} color="var(--accent)" bgColor="var(--accent-light)" route="/board" />
          <QuickActionCard title="Analytics" description="View charts and insights" icon={<BarChart3 size={17} color="#fff" />} color="var(--success)" bgColor="var(--success-light)" route="/analytics" shadow="0 4px 20px color-mix(in srgb, var(--success) 20%, transparent)" />
        </div>
      </div>
    </div>
  );
}