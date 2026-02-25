export type RestApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  confirmPassword?: string;
};

export type ErrorField = {
  msg: string;
  path: string;
};

export type ErrorResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type AuthSuccessResponse = { msg: string };
