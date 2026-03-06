import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { Wrapper } from "./testUtils";
import LoginForm from "../components/LoginForm";
import Notification from "../components/Notification";
import type { ErrorResponse, LoginResponse } from "../types";

const mockedError: ErrorResponse = { message: "User doesn't exist", status: 403 };
const mockedSuccess: LoginResponse = {
  accessToken: "token12345",
  user: { email: "test@test.com", id: 1, name: "Test" },
};

describe("Login Form", () => {
  beforeEach(() => {
    render(
      <Wrapper>
        <LoginForm service={() => Promise.reject(mockedError)} />
        <Notification />
      </Wrapper>,
    );
  });

  it("Invalid form errors", async () => {
    const email = screen.getByRole("textbox", { name: "E-mail" });
    const pass = screen.getByLabelText("Password");
    const btn = screen.getByRole("button", { name: "Login button" });

    await userEvent.type(email, "test");
    await userEvent.type(pass, "111");
    await userEvent.click(btn);

    expect(screen.getByText("Invalid e-mail")).toBeInTheDocument();
    expect(screen.getByText(/Should be at least/i)).toBeInTheDocument();
  });

  it("Incorrect login error", async () => {
    const email = screen.getByRole("textbox", { name: "E-mail" });
    const pass = screen.getByLabelText("Password");
    const btn = screen.getByRole("button", { name: "Login button" });

    await userEvent.type(email, "unknown@test.com");
    await userEvent.type(pass, "111111");
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText("User doesn't exist")).toBeInTheDocument();
    });
  });
});
