import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "../types";

type AuthUser = Pick<User, "id" | "email" | "name">;

interface IAuthStore {
  accessToken: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        user: null,
        login: (token, user) =>
          set(() => ({ accessToken: token, user }), false, "auth/login"),
        logout: () =>
          set(() => ({ accessToken: null, user: null }), false, "auth/logout"),
      }),
      {
        name: "auth-storage",
      },
    ),
  ),
);

export const useToken = () => useAuthStore((state) => state.accessToken);
export const useAuthUser = () => useAuthStore((state) => state.user);
