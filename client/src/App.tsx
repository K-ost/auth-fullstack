import LoginForm from "./components/LoginForm";
import Notification from "./ui/Notification";

function App() {
  return (
    <>
      <div className="mx-auto max-w-175 my-4 flex">
        <LoginForm />
      </div>

      <Notification message="" />
    </>
  );
}

export default App;
