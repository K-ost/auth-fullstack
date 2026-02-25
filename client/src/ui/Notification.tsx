import { type FC } from "react";

type NotificationProps = {
  message: string;
};

const Notification: FC<NotificationProps> = ({ message }) => {
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
