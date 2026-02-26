import { useState } from "react";
import LoginForm from "./components/LoginForm";
import MessageCtx from "./context/messageCtx";
import Notification from "./ui/Notification";

function App() {
  const [message, setMessage] = useState("");

  return (
    <MessageCtx.Provider value={{ message, setMessage }}>
      <div className="mx-auto max-w-175 my-4 flex">
        <LoginForm />
      </div>
      {message.length > 0 && <Notification message={message} />}
    </MessageCtx.Provider>
  );
}

export default App;
