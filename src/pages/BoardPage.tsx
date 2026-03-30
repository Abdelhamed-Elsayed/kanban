import { useEffect, useMemo, useRef, useState, useDeferredValue } from "react";
import Board from "../components/board/Board";
import { useTaskStore } from "../store/useTaskStore";
import { Search, Filter } from "../lib/icons";

export default function BoardPage() {

  const { loadTasks } = useTaskStore((s) => ({
    loadTasks: s.loadTasks,
  }));

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const deferredSearch = useDeferredValue(search);

  const priorities = useMemo(
    () => [
      { value: "all", label: "All Priorities" },
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
    []
  );

  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Task Board
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Drag cards between columns to update status
          </p>
        </div>

        {/* Priority filter pills */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Filter size={14} style={{ color: "var(--text-muted)", marginLeft: 6 }} />

          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriorityFilter(p.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={
                priorityFilter === p.value
                  ? {
                    background: "var(--bg-surface)",
                    color: "var(--accent)",
                    boxShadow: "var(--shadow-sm)",
                  }
                  : { color: "var(--text-muted)" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      <Board search={deferredSearch} priorityFilter={priorityFilter} />
    </div>
  );
}