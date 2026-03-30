import { useEffect, useRef, useState } from "react";
import { useToastStore, Toast } from "../../store/useToastStore";
import { useTaskStore } from "../../store/useTaskStore";
import { X, Trash2, RotateCcw } from "../../lib/icons";

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove);
  const addTask = useTaskStore((s) => s.addTask);
  const [progress, setProgress] = useState(100);
  const [leaving, setLeaving] = useState(false);
  const pausedRef = useRef(false);
  const startRef = useRef(Date.now());
  const remainingRef = useRef(toast.duration);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => remove(toast.id), 280);
  };

  const handleUndo = () => {
    if (toast.undoTask) addTask(toast.undoTask);
    dismiss();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / toast.duration) * 100);
      setProgress(pct);
      if (pct <= 0) dismiss();
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    pausedRef.current = true;
    remainingRef.current = toast.duration - (Date.now() - startRef.current);
  };

  const handleMouseLeave = () => {
    startRef.current = Date.now() - (toast.duration - remainingRef.current);
    pausedRef.current = false;
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-2xl flex items-start gap-3 pr-3 pl-4 pt-3 pb-4"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
        minWidth: 300,
        maxWidth: 360,
        opacity: leaving ? 0 : 1,
        transform: leaving ? "translateX(20px)" : "translateX(0)",
        transition: "opacity 0.28s ease, transform 0.28s ease",
      }}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: toast.undoTask ? "var(--danger-light)" : "var(--accent-light)" }}
      >
        <Trash2 size={15} style={{ color: toast.undoTask ? "var(--danger)" : "var(--accent)" }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {toast.message}
        </p>
        {toast.undoTask && (
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
            "{toast.undoTask.title}"
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1 shrink-0 mt-0.5">
        {toast.undoTask && (
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
            style={{ color: "var(--accent)", background: "var(--accent-light)" }}
          >
            <RotateCcw size={12} />
            Undo
          </button>
        )}
        <button
          onClick={dismiss}
          className="p-1.5 rounded-lg transition"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-surface-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px]"
        style={{
          width: `${progress}%`,
          background: "var(--accent)",
          transition: "width 30ms linear",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
      style={{ alignItems: "flex-end" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto"
          style={{ animation: "toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
        >
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}
