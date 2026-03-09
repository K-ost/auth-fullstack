export type RestApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  confirmPassword?: string;
};

export type ErrorResponse = {
  status: number;
  message: string;
};

export type AuthResponse = { msg: string };

export type LoginUser = Pick<User, "email" | "password">;

export type FailResponse = { msg: string };

export type LoginResponse = {
  accessToken: string;
  user: Pick<User, "id" | "email" | "name">;
};

export type UsersReponse = {
  data: Omit<User, "password" | "confirmPassword">[];
  count: number;
};
