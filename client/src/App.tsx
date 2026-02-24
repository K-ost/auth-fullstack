import { useState, type SubmitEvent } from "react";
import Button from "./ui/Button";
import TextInput from "./ui/TextInput";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleForm = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="mx-auto max-w-175 my-4 flex">
      <div className="border border-gray-300 rounded-xl p-6">
        <form onSubmit={handleForm}>
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <div className="mb-4">
            <TextInput onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
          </div>
          <div className="mb-4">
            <TextInput
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <Button>Login</Button>
        </form>
      </div>
    </div>
  );
}

export default App;
