import { useContext } from "react";
import type { MessageContextType } from "../types";
import MessageCtx from "../context/MessageCtx";

const useMessage = (): MessageContextType => {
  const context = useContext(MessageCtx);
  if (!context) {
    throw new Error("useMessage must be used within a MessageCtx.Provider");
  }
  return context;
};

export default useMessage;
