import { create } from "zustand";

export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  tags: string[];
  date: string;
};

type TaskState = {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
};

export const priorityRank: Record<Priority, number> = { high: 1, medium: 2, low: 3 };

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  loadTasks: async () => {
    const stored = localStorage.getItem("kanban_tasks");
    if (stored) { set({ tasks: JSON.parse(stored) }); return; }
    const res = await fetch("/data/tasks.json");
    const data: Task[] = await res.json();
    set({ tasks: data });
    localStorage.setItem("kanban_tasks", JSON.stringify(data));
  },

  addTask: (task) => {
    const updated = [...get().tasks, task];
    set({ tasks: updated });
    localStorage.setItem("kanban_tasks", JSON.stringify(updated));
  },

  updateTask: (taskId, updates) => {
    const updated = get().tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t);
    set({ tasks: updated });
    localStorage.setItem("kanban_tasks", JSON.stringify(updated));
  },

  deleteTask: (taskId) => {
    const updated = get().tasks.filter((t) => t.id !== taskId);
    set({ tasks: updated });
    localStorage.setItem("kanban_tasks", JSON.stringify(updated));
  },

  moveTask: (taskId, newStatus) => {
    const updated = get().tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t);
    set({ tasks: updated });
    localStorage.setItem("kanban_tasks", JSON.stringify(updated));
  },
}));
