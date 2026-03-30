import { useEffect, useState } from "react";
import { X, Trash2, Save } from "lucide-react";
import { Priority, Task, useTaskStore } from "../../store/useTaskStore";
import { useToastStore } from "../../store/useToastStore";

const inputStyle = {
  background: "var(--bg-surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 14,
  width: "100%",
  outline: "none",
};

export default function EditTaskModal({
  open, onClose, task,
}: {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}) {
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const pushToast  = useToastStore((s) => s.push);

  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority]     = useState<Priority>("medium");
  const [tags, setTags]             = useState("");
  const [error, setError]           = useState("");

  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setTags(task.tags.join(", "));
    setError("");
  }, [task]);

  if (!open || !task) return null;

  const handleSave = () => {
    if (!title.trim()) { setError("Title is required"); return; }
    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    onClose();
  };

  const handleDelete = () => {
    const snapshot = { ...task };
    deleteTask(task.id);
    onClose();
    pushToast({ message: "Task deleted", undoTask: snapshot, duration: 5000 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 animate-scaleIn"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Edit Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}>
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Title *</label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            {error && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{error}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} style={inputStyle}>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition"
              style={{ background: "var(--accent)", color: "#fff", boxShadow: "var(--shadow-accent)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent)")}
            >
              <Save size={15} /> Save Changes
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold transition"
              style={{
                background: "var(--danger-light)",
                color: "var(--danger)",
                border: "1px solid color-mix(in srgb, var(--danger) 20%, transparent)",
              }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
