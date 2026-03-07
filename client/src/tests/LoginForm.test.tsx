import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Wrapper } from "./testUtils";
import LoginForm from "../components/LoginForm";
import Notification from "../components/Notification";
import type { LoginResponse } from "../types";
import { useAuthStore } from "../store/useAuth";
import { useMessage } from "../store/useMessage";

const mockedResponse: LoginResponse = {
  accessToken: "mocked_access_token",
  user: {
    email: "test@test.com",
    id: 1,
    name: "User",
  },
};

const mockedFetch = vi.fn();
globalThis.fetch = mockedFetch;

describe("Login Form", () => {
  let loginSpy: ReturnType<typeof vi.spyOn>;
  let setMessageSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    useAuthStore.setState({ accessToken: null, user: null });
    useMessage.setState({ message: "" });

    loginSpy = vi.spyOn(useAuthStore.getState(), "login");
    setMessageSpy = vi.spyOn(useMessage.getState(), "setMessage");

    render(
      <Wrapper>
        <LoginForm />
        <Notification />
      </Wrapper>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
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
    mockedFetch.mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ msg: "User doesn't exist" }),
    });

    const email = screen.getByRole("textbox", { name: "E-mail" });
    const pass = screen.getByLabelText("Password");
    const btn = screen.getByRole("button", { name: "Login button" });

    await userEvent.type(email, "unknown@test.com");
    await userEvent.type(pass, "111111");
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText("User doesn't exist")).toBeInTheDocument();
      expect(setMessageSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("Successful login", async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => mockedResponse,
    });

    const email = screen.getByRole("textbox", { name: "E-mail" });
    const pass = screen.getByLabelText("Password");
    const btn = screen.getByRole("button", { name: "Login button" });

    await userEvent.type(email, "test@test.com");
    await userEvent.type(pass, "111111");
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText("You have been logged")).toBeInTheDocument();
      expect(loginSpy).toHaveBeenCalledTimes(1);
    });
  });
});
