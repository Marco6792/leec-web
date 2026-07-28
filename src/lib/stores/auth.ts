import { create } from "zustand";

type AuthState = {
  user: { id: string; email?: string } | null;
  avatarUrl: string | null;
  fullName: string;
  setUser: (
    user: { id: string; email?: string } | null,
    avatarUrl?: string | null,
    fullName?: string,
  ) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  avatarUrl: null,
  fullName: "",
  setUser: (user, avatarUrl = null, fullName = "") =>
    set({ user, avatarUrl, fullName }),
  clear: () => set({ user: null, avatarUrl: null, fullName: "" }),
}));
