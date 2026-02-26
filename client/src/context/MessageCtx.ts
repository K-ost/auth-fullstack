import { createContext } from "react";
import type { MessageContextType } from "../types";

const MessageCtx = createContext<MessageContextType | null>(null);

export default MessageCtx;
