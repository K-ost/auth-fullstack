import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import RegisterForm from "./components/RegisterForm";
import { useToken } from "./store/useAuth";
import UserScreen from "./components/UserScreen";

function App() {
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
      <Notification />
    </>
  );
}

export default App;
