import { type JSX } from "react";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import useMutateData from "../hooks/useMutateData";
import { ApiUrl } from "../constants";
import type { AuthResponse, ErrorResponse, User } from "../types";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

const LoginForm = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate, isPending } = useMutateData<
    AuthResponse,
    ErrorResponse,
    Pick<User, "email" | "password">
  >({
    keys: ["login"],
    method: "POST",
    url: `${ApiUrl}/login`,
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onError(error) {
        console.error("Error", error);
      },
      onSuccess(data) {
        console.log("onSuccess", data);
      },
    });
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <div className="mb-4">
          <TextInput
            aria-label="E-mail"
            placeholder="E-mail"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            style={{ borderColor: errors.email ? "red" : "" }}
          />
        </div>

        <div className="mb-4">
          <TextInput
            type="password"
            aria-label="Password"
            placeholder="Password"
            {...register("password", { required: true, minLength: 6 })}
            style={{ borderColor: errors.password ? "red" : "" }}
          />
        </div>

        <div className="mb-6">
          <Button type="submit" aria-label="Login button">
            {isPending ? "Loading..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
