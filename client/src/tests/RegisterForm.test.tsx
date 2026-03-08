import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import Wrapper from "./testWrapper";
import Notification from "../components/Notification";
import RegisterForm from "../components/RegisterForm";
import { mockedFetch } from "./setup";
import { useMessage } from "../store/useMessage";

function registerTestSetup() {
  const setMessageSpy = vi.spyOn(useMessage.getState(), "setMessage");

  render(
    <Wrapper>
      <RegisterForm />
      <Notification />
    </Wrapper>,
  );

  return {
    email: screen.getByRole("textbox", { name: "E-mail" }),
    pass: screen.getByLabelText("Password"),
    confirmPass: screen.getByLabelText("Confirm Password"),
    name: screen.getByRole("textbox", { name: "Name" }),
    surname: screen.getByRole("textbox", { name: "Surname" }),
    btn: screen.getByRole("button", { name: "Register button" }),
    setMessageSpy,
  };
}

describe("Register Form", () => {
  afterEach(() => {
    vi.clearAllMocks();
    act(() => {
      useMessage.setState({ message: "" });
    });
  });

  describe("Validation", () => {
    it("Password less than 6 characters", async () => {
      const { pass, btn } = registerTestSetup();
      await userEvent.type(pass, "111");
      await userEvent.click(btn);
      expect(screen.getByText(/Should be at least 6 characters/i)).toBeInTheDocument();
    });

    it("Invalid e-mail", async () => {
      const { email, btn } = registerTestSetup();
      await userEvent.type(email, "test");
      await userEvent.click(btn);
      expect(screen.getByText("Invalid e-mail")).toBeInTheDocument();
    });

    it("Passwords don't match", async () => {
      const { pass, confirmPass, btn } = registerTestSetup();
      await userEvent.type(pass, "111111");
      await userEvent.type(confirmPass, "555555");
      await userEvent.click(btn);
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it("Succesful registration", async () => {
    const { btn, confirmPass, email, name, pass, surname, setMessageSpy } =
      registerTestSetup();

    mockedFetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ msg: "User has been registered" }),
    });

    await userEvent.type(email, "test@test.com");
    await userEvent.type(pass, "123456");
    await userEvent.type(confirmPass, "123456");
    await userEvent.type(name, "User");
    await userEvent.type(surname, "Test");
    await userEvent.click(btn);

    expect(await screen.findByText("User has been registered")).toBeInTheDocument();
    expect(setMessageSpy).toHaveBeenCalledOnce();
    expect(email).toHaveValue("");
    expect(pass).toHaveValue("");
    expect(confirmPass).toHaveValue("");
    expect(name).toHaveValue("");
    expect(surname).toHaveValue("");
  });

  it("Failed registration attempt - User already eixts", async () => {
    const { btn, confirmPass, email, name, pass, surname, setMessageSpy } =
      registerTestSetup();

    mockedFetch.mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ msg: "User already exists" }),
    });

    await userEvent.type(email, "wrong@email.com");
    await userEvent.type(pass, "123456");
    await userEvent.type(confirmPass, "123456");
    await userEvent.type(name, "User");
    await userEvent.type(surname, "Test");
    await userEvent.click(btn);

    expect(await screen.findByText("User already exists")).toBeInTheDocument();
    expect(setMessageSpy).toHaveBeenCalledOnce();
  });
});
