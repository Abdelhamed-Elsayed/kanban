import { useState } from "react";
import { Plus } from "../../lib/icons";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Virtuoso } from "react-virtuoso";
import { Task, Status } from "../../store/useTaskStore";
import TaskCard from "./TaskCard";
import NewCardModal from "../modals/NewCardModal";

const statusConfig = {
  todo:     { label: "To Do",      dot: "var(--danger)" },
  progress: { label: "In Progress", dot: "var(--warning)" },
  done:     { label: "Done",       dot: "var(--success)" },
};

// Virtuoso requires a fixed height — use this when task count exceeds threshold
const VIRTUOSO_THRESHOLD = 8;
const VIRTUOSO_HEIGHT = 520;
const CARD_APPROX_HEIGHT = 130; // px — used for small lists

export default function Column({
  title,
  status,
  tasks,
  onEditTask,
  isOver,
}: {
  title: string;
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  isOver?: boolean;
  isMobile?:boolean;
}) {
  const [open, setOpen] = useState(false);
  const cfg = statusConfig[status];
  const useVirtual = tasks.length > VIRTUOSO_THRESHOLD;

  return (
    <div
      className="flex flex-col rounded-2xl transition-all duration-200"
      style={{
        background: isOver ? "var(--accent-light)" : "var(--bg-surface-2)",
        border: isOver
          ? "2px solid var(--accent)"
          : "1.5px solid var(--border-subtle)",
        boxShadow: isOver
          ? "inset 0 0 0 1px var(--accent), var(--shadow-accent)"
          : "none",
        minHeight: 120,
      }}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: cfg.dot }}
          />
          <h2
            className="font-semibold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            {cfg.label}
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "var(--border)", color: "var(--text-muted)" }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-lg transition"
          aria-label={`Add task to ${cfg.label}`}
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "var(--accent-light)";
            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Cards area */}
      <div className="p-3 flex-1">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 && !isOver ? (
            <div
              className="flex items-center justify-center h-16 rounded-xl border-2 border-dashed text-xs"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Drop tasks here
            </div>
          ) : useVirtual ? (
            /* ── Virtuoso for large lists ── */
            <Virtuoso
              style={{ height: VIRTUOSO_HEIGHT }}
              totalCount={tasks.length}
              itemContent={(index) => (
                <div style={{ paddingBottom: 12 }}>
                  <TaskCard
                    task={tasks[index]}
                    onEdit={onEditTask}
                  />
                </div>
              )}
              overscan={200}
            />
          ) : (
            /* ── Regular rendering for small lists ── */
            <div
              className="space-y-3"
              style={{ minHeight: Math.max(60, tasks.length * CARD_APPROX_HEIGHT * 0.4) }}
            >
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
              ))}
            </div>
          )}
        </SortableContext>
      </div>

      <NewCardModal
        open={open}
        onClose={() => setOpen(false)}
        status={status}
      />
    </div>
  );
}
