import { type FC } from "react";
import { useMessageSelector } from "../store/useMessage";

const Notification: FC = () => {
  const message = useMessageSelector();
  if (!message) return null;
  return (
    <div
      aria-label={`Notification: ${message}`}
      className="fixed right-4 bottom-4 bg-amber-400 text-black rounded-xl py-3 px-5"
    >
      {message}
    </div>
  );
};

export default Notification;
