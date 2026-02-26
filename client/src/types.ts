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

export type MessageContextType = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};
