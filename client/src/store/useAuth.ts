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
        login: (token, user) => set(() => ({ accessToken: token, user })),
        logout: () => set(() => ({ accessToken: null, user: null })),
      }),
      {
        name: "accessToken",
      },
    ),
  ),
);

export const useToken = () => useAuthStore((state) => state.accessToken);
