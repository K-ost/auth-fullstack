import LoginForm from "./components/LoginForm";
import Notification from "./ui/Notification";
import RegisterForm from "./components/RegisterForm";
import { useMessageSelector } from "./store/useMessage";

function App() {
  const message = useMessageSelector();
  return (
    <>
      <div className="mx-auto max-w-175 my-4 grid grid-cols-2 gap-6">
        <LoginForm />
        <RegisterForm />
      </div>
      {message.length > 0 && <Notification message={message} />}
    </>
  );
}

export default App;
