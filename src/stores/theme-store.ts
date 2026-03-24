import { create } from "zustand";
import { api } from "../lib/api";

interface ThemeStore {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "dark",

  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
    api.updateSettings({ theme }).catch(() => {});
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },

  loadTheme: async () => {
    try {
      const settings = await api.getSettings();
      const theme = settings.theme === "light" ? "light" : "dark";
      set({ theme });
      applyTheme(theme);
    } catch {
      applyTheme("dark");
    }
  },
}));

function applyTheme(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
}
