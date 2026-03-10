import type { FailResponse, LoginResponse, User, UsersReponse } from "../types";

export const mockedToken = "new_token";

export const mockedUser: Pick<User, "email" | "id" | "name"> = {
  id: 1,
  email: "test@test.com",
  name: "Test",
};

export const mockedUsers: UsersReponse = {
  count: 2,
  data: [
    { email: "test1@test.com", id: 1, name: "John", surname: "Surname" },
    { email: "test2@test.com", id: 2, name: "Steve", surname: "Surname" },
  ],
};

export const mockedFailResponse: FailResponse = { msg: "Token expired" };

export const mockedLoginResponse: LoginResponse = {
  accessToken: mockedToken,
  user: { email: "test@test.com", id: 1, name: "User" },
};
