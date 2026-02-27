import { type FC } from "react";
import { useForm } from "react-hook-form";
import { useMessage } from "../store/useMessage";
import useMutateData from "../hooks/useMutateData";
import { useAuthStore } from "../store/useAuth";
import Field from "../ui/Field";
import Button from "../ui/Button";
import Wrapper from "../ui/Wrapper";
import { ApiUrl } from "../constants";
import type { LoginResponse, ErrorResponse, User } from "../types";

type FormData = {
  email: string;
  password: string;
};

const LoginForm: FC = () => {
  const setMessage = useMessage((state) => state.setMessage);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate, isPending } = useMutateData<
    LoginResponse,
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
          {...register("password", { required: "Required field", minLength: 6 })}
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
