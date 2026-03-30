import { create } from "zustand";

type ThemeState = {
  dark: boolean;
  toggle: () => void;
  setDark: (val: boolean) => void;
};

const stored = localStorage.getItem("kanban_dark");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initial = stored !== null ? stored === "true" : prefersDark;

if (initial) document.documentElement.classList.add("dark");

export const useThemeStore = create<ThemeState>((set) => ({
  dark: initial,
  toggle: () =>
    set((s) => {
      const next = !s.dark;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("kanban_dark", String(next));
      return { dark: next };
    }),
  setDark: (val) => {
    document.documentElement.classList.toggle("dark", val);
    localStorage.setItem("kanban_dark", String(val));
    set({ dark: val });
  },
}));
