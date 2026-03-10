import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import Wrapper from "./testWrapper";
import LoginForm from "../components/LoginForm";
import Notification from "../components/Notification";
import { useAuthStore } from "../store/useAuth";
import { useMessage } from "../store/useMessage";
import { mockedFetch } from "./setup";
import { mockedLoginResponse } from "./mocks";

function loginTestSetup() {
  act(() => {
    useAuthStore.setState({ accessToken: null, user: null });
    useMessage.setState({ message: "" });
  });

  const loginSpy = vi.spyOn(useAuthStore.getState(), "login");
  const setMessageSpy = vi.spyOn(useMessage.getState(), "setMessage");

  render(
    <Wrapper>
      <LoginForm />
      <Notification />
    </Wrapper>,
  );

  return {
    loginSpy,
    setMessageSpy,
    email: screen.getByRole("textbox", { name: "E-mail" }),
    pass: screen.getByLabelText("Password"),
    btn: screen.getByRole("button", { name: "Login button" }),
  };
}

describe("Login Form", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Invalid form errors", async () => {
    const { btn, email, pass } = loginTestSetup();

    await userEvent.type(email, "test");
    await userEvent.type(pass, "111");
    await userEvent.click(btn);

    expect(screen.getByText("Invalid e-mail")).toBeInTheDocument();
    expect(screen.getByText(/Should be at least/i)).toBeInTheDocument();
  });

  it("Incorrect login error", async () => {
    const { btn, email, pass, setMessageSpy } = loginTestSetup();

    mockedFetch.mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ msg: "User doesn't exist" }),
    });

    await userEvent.type(email, "unknown@test.com");
    await userEvent.type(pass, "111111");
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText("User doesn't exist")).toBeInTheDocument();
      expect(setMessageSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("Successful login", async () => {
    const { btn, email, pass, loginSpy } = loginTestSetup();

    mockedFetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockedLoginResponse,
    });

    await userEvent.type(email, "test@test.com");
    await userEvent.type(pass, "555555");
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText("You have been logged")).toBeInTheDocument();
      expect(loginSpy).toHaveBeenCalledTimes(1);
    });
  });
});
