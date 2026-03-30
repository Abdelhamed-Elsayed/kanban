import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, useTaskStore } from "../../store/useTaskStore";
import { useToastStore } from "../../store/useToastStore";
import { MoreVertical, Edit3, Trash2, Tag, Calendar } from "lucide-react";

const priorityConfig = {
  high: { label: "High", color: "var(--danger)", bg: "var(--danger-light)" },
  medium: { label: "Med", color: "var(--warning)", bg: "var(--warning-light)" },
  low: { label: "Low", color: "var(--success)", bg: "var(--success-light)" },
};

export default function TaskCard({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const pushToast = useToastStore((s) => s.push);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
    opacity: isDragging ? 0.3 : 1,
  };

  // Close menu on outside click
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
    // Soft-delete: remove immediately, store snapshot for Undo
    const snapshot = { ...task };
    deleteTask(task.id);
    pushToast({ message: "Task deleted", undoTask: snapshot, duration: 5000 });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(task);
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
        cursor: "grab",
      }}
      className="p-4 group animate-fadeInUp transition-shadow duration-150"
      {...attributes}
      {...listeners}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
      }}
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
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="p-1 rounded-lg transition opacity-0 group-hover:opacity-100"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-surface-hover)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
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
              {/* Edit */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleEdit}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-surface-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <Edit3 size={14} /> Edit Task
              </button>

              <div style={{ height: 1, background: "var(--border-subtle)" }} />

              {/* Delete → toast with Undo */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition"
                style={{ color: "var(--danger)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--danger-light)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
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

      <div className="mt-3 flex items-center justify-between">
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
      </div>
    </div>
  );
}
