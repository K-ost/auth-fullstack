import { type JSX } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useMessage } from "../store/useMessage";
import { useAuthStore } from "../store/useAuth";
import Field from "../ui/Field";
import Button from "../ui/Button";
import Wrapper from "../ui/Wrapper";
import { ApiUrl } from "../constants";
import type { LoginResponse, ErrorResponse, LoginUser } from "../types";
import { apiRequest } from "../api/api";

type FormData = {
  email: string;
  password: string;
};

const LoginForm = (): JSX.Element => {
  const setMessage = useMessage((state) => state.setMessage);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate, isPending } = useMutation<LoginResponse, ErrorResponse, LoginUser>({
    mutationKey: ["login"],
    mutationFn: (data) => apiRequest(`${ApiUrl}/login`, "POST", data),
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onError(error) {
        setMessage(error.message);
      },
      onSuccess(data) {
        login(data.accessToken, data.user);
      },
    });
  };

  return (
    <Wrapper title="Login">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field
          type="email"
          aria-label="E-mail"
          placeholder="E-mail"
          {...register("email", {
            required: "Required field",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid e-mail",
            },
          })}
          error={errors.email && errors.email.message}
        />

        <Field
          type="password"
          aria-label="Password"
          placeholder="Password"
          {...register("password", {
            required: "Required field",
            minLength: {
              value: 6,
              message: "Should be at least 6 characters long",
            },
          })}
          error={errors.password && errors.password.message}
        />

        <Button type="submit" aria-label="Login button">
          {isPending ? "Loading..." : "Login"}
        </Button>
      </form>
    </Wrapper>
  );
};

export default LoginForm;
