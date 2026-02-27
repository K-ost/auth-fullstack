import { type FC } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Field from "../ui/Field";
import Wrapper from "../ui/Wrapper";
import { useMessage } from "../store/useMessage";
import useMutateData from "../hooks/useMutateData";
import { ApiUrl } from "../constants";
import type { AuthResponse, ErrorResponse, User } from "../types";

type FormData = Omit<User, "id">;

const RegisterForm: FC = () => {
  const setMessage = useMessage((state) => state.setMessage);

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
            required: "Should be at least 6 characters long",
            minLength: 6,
          })}
          error={errors.password && errors.password.message}
        />

        <Field
          type="password"
          aria-label="Confirm Password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Required field",
            validate: (value) => {
              return value === watch("password") || "Passwords don't match";
            },
          })}
          error={errors.confirmPassword && errors.confirmPassword.message}
        />

        <Field
          aria-label="Name"
          placeholder="Name"
          {...register("name", {
            required: "Should be at least 3 characters long",
            minLength: 3,
          })}
          error={errors.name && errors.name.message}
        />

        <Field
          aria-label="Surname"
          placeholder="Surname"
          {...register("surname", {
            required: "Should be at least 3 characters long",
            minLength: 3,
          })}
          error={errors.surname && errors.surname.message}
        />

        <Button type="submit" aria-label="Register button">
          {isPending ? "Loading..." : "Register"}
        </Button>
      </form>
    </Wrapper>
  );
};

export default RegisterForm;
