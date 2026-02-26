import { useState } from "react";
import LoginForm from "./components/LoginForm";
import MessageCtx from "./context/MessageCtx";
import Notification from "./ui/Notification";
import RegisterForm from "./components/RegisterForm";

function App() {
  const [message, setMessage] = useState("");

  return (
    <MessageCtx.Provider value={{ message, setMessage }}>
      <div className="mx-auto max-w-175 my-4 grid grid-cols-2 gap-6">
        <LoginForm />
        <RegisterForm />
      </div>
      {message.length > 0 && <Notification message={message} />}
    </MessageCtx.Provider>
  );
}

export default App;
