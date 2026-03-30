import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, useTaskStore, Status } from "../../store/useTaskStore";
import { useToastStore } from "../../store/useToastStore";
import { MoreVertical, Edit3, Trash2, Tag, Calendar, ChevronLeft, ChevronRight } from "../../lib/icons";

const priorityConfig = {
  high: { label: "High", color: "var(--danger)", bg: "var(--danger-light)" },
  medium: { label: "Med", color: "var(--warning)", bg: "var(--warning-light)" },
  low: { label: "Low", color: "var(--success)", bg: "var(--success-light)" },
};

function getNextStatus(status: Status) {
  if (status === "todo") return "progress";
  if (status === "progress") return "done";
  return "done";
}

function getPrevStatus(status: Status) {
  if (status === "done") return "progress";
  if (status === "progress") return "todo";
  return "todo";
}

export default function TaskCard({
  task,
  onEdit,
  isMobile,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  isMobile?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const deleteTask = useTaskStore((s) => s.deleteTask);
  const moveTask = useTaskStore((s) => s.moveTask);
  const pushToast = useToastStore((s) => s.push);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
    opacity: isDragging ? 0.3 : 1,
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    const snapshot = { ...task };
    deleteTask(task.id);
    pushToast({ message: "Task deleted", undoTask: snapshot, duration: 5000 });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(task);
  };

  const handleMoveRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === "done") return;
    const next = getNextStatus(task.status);
    moveTask(task.id, next);
    const label = next === "progress" ? "In Progress" : "Done";
    pushToast({ message: `Moved to ${label}`, duration: 3000 });
  };

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === "todo") return;
    const prev = getPrevStatus(task.status);
    moveTask(task.id, prev);
    const label = prev === "todo" ? "To Do" : "In Progress";
    pushToast({ message: `Moved to ${label}`, duration: 3000 });
  };

  const p = priorityConfig[task.priority];

  const formattedDate = new Date(task.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 12,
        boxShadow: "var(--shadow-sm)",
        cursor: isMobile ? "default" : "grab",
      }}
      className="p-4 group animate-fadeInUp transition-shadow duration-150"
      {...attributes}
      {...(!isMobile ? listeners : {})}
    >
      {/* Priority badge + 3-dot menu */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold tracking-wide"
          style={{ color: p.color, background: p.bg }}
        >
          {p.label}
        </span>

        <div className="relative" ref={menuRef}>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-label="Task options"
            aria-expanded={menuOpen}
            className="p-1 rounded-lg transition opacity-0 group-hover:opacity-100"
            style={{ color: "var(--text-muted)" }}
          >
            <MoreVertical size={15} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-7 w-36 rounded-xl overflow-hidden animate-scaleIn z-50"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleEdit}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition"
                style={{ color: "var(--text-secondary)" }}
              >
                <Edit3 size={14} /> Edit Task
              </button>

              <div style={{ height: 1, background: "var(--border-subtle)" }} />

              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition"
                style={{ color: "var(--danger)" }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="mt-3 font-semibold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
        {task.title}
      </h3>

      {task.description && (
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {task.description}
        </p>
      )}

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 items-center">
          <Tag size={11} style={{ color: "var(--text-muted)" }} />
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md"
              style={{
                color: "var(--text-muted)",
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Date + buttons */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium"
          style={{
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>

        {/* Move buttons — mobile only */}
        {isMobile && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleMoveLeft}
              disabled={task.status === "todo"}
              className="p-1.5 rounded-lg transition"
              style={{
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-subtle)",
                opacity: task.status === "todo" ? 0.4 : 1,
              }}
              aria-label="Move task left"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              onClick={handleMoveRight}
              disabled={task.status === "done"}
              className="p-1.5 rounded-lg transition"
              style={{
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-subtle)",
                opacity: task.status === "done" ? 0.4 : 1,
              }}
              aria-label="Move task right"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}