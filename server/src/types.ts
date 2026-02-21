export type User = {
  id: number;
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  surname?: string;
};
