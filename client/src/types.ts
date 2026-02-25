export type RestApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  confirmPassword?: string;
};
