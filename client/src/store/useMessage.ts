import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IMessageState {
  message: string;
  setMessage: (message: string) => void;
}

export const useMessage = create<IMessageState>()(
  devtools((set) => ({
    message: "",
    setMessage: (message) => set(() => ({ message })),
  })),
);

export const useMessageSelector = () => useMessage((state) => state.message);
