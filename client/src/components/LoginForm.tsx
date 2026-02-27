import { type FC } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import useMutateData from "../hooks/useMutateData";
import { ApiUrl } from "../constants";
import type { AuthResponse, ErrorResponse, User } from "../types";
import Wrapper from "../ui/Wrapper";
import { useMessage } from "../store/useMessage";

type FormData = {
  email: string;
  password: string;
};

const LoginForm: FC = () => {
  const setMessage = useMessage((state) => state.setMessage);

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
        setMessage(error.message);
      },
      onSuccess(data) {
        setMessage(data.msg);
      },
    });
  };

  return (
    <Wrapper title="Login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <TextInput
            type="email"
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

        <Button type="submit" aria-label="Login button">
          {isPending ? "Loading..." : "Login"}
        </Button>
      </form>
    </Wrapper>
  );
};

export default LoginForm;
