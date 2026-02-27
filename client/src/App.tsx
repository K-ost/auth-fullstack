import LoginForm from "./components/LoginForm";
import Notification from "./ui/Notification";
import RegisterForm from "./components/RegisterForm";
import { useMessageSelector } from "./store/useMessage";
import { useToken } from "./store/useAuth";
import UserScreen from "./components/UserScreen";

function App() {
  const message = useMessageSelector();
  const accessToken = useToken();

  return (
    <>
      {!accessToken && (
        <div className="mx-auto max-w-175 my-4 grid grid-cols-2 gap-6">
          <LoginForm />
          <RegisterForm />
        </div>
      )}
      {accessToken && <UserScreen />}
      {message.length > 0 && <Notification message={message} />}
    </>
  );
}

export default App;
