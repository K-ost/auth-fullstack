import { type FC } from "react";
import { useForm } from "react-hook-form";
import Wrapper from "../ui/Wrapper";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import type { AuthResponse, ErrorResponse, User } from "../types";
import useMutateData from "../hooks/useMutateData";
import { ApiUrl } from "../constants";
import useMessage from "../hooks/useMessage";

type FormData = Omit<User, "id">;

const RegisterForm: FC = () => {
  const { setMessage } = useMessage();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>();

  const { mutate, isPending } = useMutateData<AuthResponse, ErrorResponse, FormData>({
    keys: ["register"],
    method: "POST",
    url: `${ApiUrl}/register`,
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onError(error) {
        setMessage(error.message);
      },
      onSuccess(data) {
        setMessage(data.msg);
        reset();
      },
    });
  };

  return (
    <Wrapper title="Register">
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

        <div className="mb-4">
          <TextInput
            type="password"
            aria-label="Confirm Password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === watch("password"),
            })}
            style={{ borderColor: errors.confirmPassword ? "red" : "" }}
          />
        </div>

        <div className="mb-4">
          <TextInput
            aria-label="Name"
            placeholder="Name"
            {...register("name", { required: true, minLength: 3 })}
            style={{ borderColor: errors.name ? "red" : "" }}
          />
        </div>

        <div className="mb-4">
          <TextInput
            aria-label="Surname"
            placeholder="Surname"
            {...register("surname", { required: true, minLength: 3 })}
            style={{ borderColor: errors.surname ? "red" : "" }}
          />
        </div>

        <Button type="submit" aria-label="Register button">
          {isPending ? "Loading..." : "Register"}
        </Button>
      </form>
    </Wrapper>
  );
};

export default RegisterForm;
