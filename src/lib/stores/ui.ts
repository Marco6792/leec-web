import { create } from "zustand";

type UIState = {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme (syncs with <ThemeProvider>)
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Global loading (for page transitions, mutations)
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Notifications
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  dismissToast: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  theme: "system",
  setTheme: (theme) => set({ theme }),

  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  toast: null,
  showToast: (message, type) => set({ toast: { message, type } }),
  dismissToast: () => set({ toast: null }),
}));
