import { create } from "zustand";

type SettingsState = {
  autoSave: boolean;
  notifications: boolean;
  emailDigest: boolean;
  compactMode: boolean;
  language: string;
  timezone: string;
  toggleAutoSave: () => void;
  toggleNotifications: () => void;
  toggleEmailDigest: () => void;
  toggleCompactMode: () => void;
  setLanguage: (lang: string) => void;
  setTimezone: (tz: string) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  autoSave: true,
  notifications: true,
  emailDigest: false,
  compactMode: false,
  language: "en",
  timezone: "UTC+2",
  toggleAutoSave: () => set((s) => ({ autoSave: !s.autoSave })),
  toggleNotifications: () => set((s) => ({ notifications: !s.notifications })),
  toggleEmailDigest: () => set((s) => ({ emailDigest: !s.emailDigest })),
  toggleCompactMode: () => set((s) => ({ compactMode: !s.compactMode })),
  setLanguage: (language) => set({ language }),
  setTimezone: (timezone) => set({ timezone }),
}));
