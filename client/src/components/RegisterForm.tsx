import { type JSX } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Button from "../ui/Button";
import Field from "../ui/Field";
import Wrapper from "../ui/Wrapper";
import { useMessage } from "../store/useMessage";
import { ApiUrl } from "../constants";
import type { AuthResponse, ErrorResponse, User } from "../types";
import type { ApiService } from "../api/api";

type RegisterFormProps = {
  service: ApiService<AuthResponse, FormData>;
};

type FormData = Omit<User, "id">;

const RegisterForm = (props: RegisterFormProps): JSX.Element => {
  const { service } = props;
  const setMessage = useMessage((state) => state.setMessage);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>();

  const { mutate, isPending } = useMutation<AuthResponse, ErrorResponse, FormData>({
    mutationKey: ["register"],
    mutationFn: (data) => service(`${ApiUrl}/register`, "POST", data),
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
            required: "Required field",
            minLength: {
              value: 6,
              message: "Should be at least 6 characters long",
            },
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
