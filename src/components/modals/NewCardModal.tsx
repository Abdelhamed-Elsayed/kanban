import { useState } from "react";
import { X, Plus } from "../../lib/icons";
import { Priority, Status, useTaskStore } from "../../store/useTaskStore";

const inputStyle = {
  background: "var(--bg-surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 14,
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s ease",
};

export default function NewCardModal({ open, onClose, status }: { open: boolean; onClose: () => void; status: Status }) {
  const addTask = useTaskStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) { setError("Title is required"); return; }
    addTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      date: new Date().toLocaleDateString(),
    });
    setTitle(""); setDescription(""); setPriority("medium"); setTags(""); setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 animate-scaleIn"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>New Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--bg-surface-hover)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Title *</label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="Task title..."
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
              placeholder="What needs to be done..."
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              style={inputStyle}
            >
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Tags <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(comma-separated)</span></label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, backend, urgent..."
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition"
            style={{ background: "var(--accent)", color: "#fff", boxShadow: "var(--shadow-accent)" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--accent-hover)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "var(--accent)"}
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
