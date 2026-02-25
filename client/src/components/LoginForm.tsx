import { useState, type JSX, type SubmitEvent } from "react";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import Notification from "../ui/Notification";
import useMutateData from "../hooks/useMutateData";
import { ApiUrl } from "../constants";
import type { AuthSuccessResponse, ErrorField, ErrorResponse, User } from "../types";

const LoginForm = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutateData<
    AuthSuccessResponse,
    ErrorResponse<ErrorField[]>,
    Pick<User, "email" | "password">
  >({
    keys: ["login"],
    method: "POST",
    url: `${ApiUrl}/login`,
  });

  const handleForm = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.length && !password.length) return;
    mutate(
      { email, password },
      {
        onError(error) {
          console.error("Error", error.data[0].msg);
        },
        onSuccess(data) {
          console.log("onSuccess", data);
        },
      },
    );
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6">
      <form onSubmit={handleForm}>
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <div className="mb-4">
          <TextInput
            aria-label="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />
        </div>

        <div className="mb-4">
          <TextInput
            type="password"
            aria-label="Password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className="mb-6">
          <Button
            type="submit"
            aria-label="Login button"
            disabled={!email.length || !password.length}
          >
            {isPending ? "Loading..." : "Login"}
          </Button>
        </div>

        <Notification message="" />
      </form>
    </div>
  );
};

export default LoginForm;
