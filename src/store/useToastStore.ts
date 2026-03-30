import { create } from "zustand";
import { Task } from "./useTaskStore";

export type Toast = {
  id: string;
  message: string;
  undoTask?: Task;   
  duration: number; 
};

type ToastState = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => string;
  remove: (id: string) => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  push: (toast) => {
    const id = crypto.randomUUID();
    set({ toasts: [...get().toasts, { ...toast, id }] });
    return id;
  },

  remove: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
