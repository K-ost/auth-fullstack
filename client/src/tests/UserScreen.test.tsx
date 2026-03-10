import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TestWrapper from "./testWrapper";
import UserScreen from "../components/UserScreen";
import { useAuthStore } from "../store/useAuth";
import Wrapper from "../ui/Wrapper";
import { mockedFetch } from "./setup";
import userEvent from "@testing-library/user-event";
import { mockedUsers } from "./mocks";

function setup() {
  const logoutSpy = vi.spyOn(useAuthStore.getState(), "logout");

  const { result } = renderHook(() => useAuthStore(), { wrapper: Wrapper });

  act(() => {
    result.current.login("token", { email: "test@test.com", id: 1, name: "User" });
  });

  render(
    <TestWrapper>
      <UserScreen />
    </TestWrapper>,
  );

  return { logoutSpy, result };
}

describe("User Screen", () => {
  it("Logout", async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ msg: "Logout" }),
    });
    const { logoutSpy } = setup();
    const logoutBtn = screen.getByRole("button", { name: "Logout" });
    await userEvent.click(logoutBtn);
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it("Protected data", async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockedUsers,
    });
    setup();

    expect(await screen.findByText(/"count": 2/)).toBeInTheDocument();
    expect(await screen.findByText(/"data": \[/)).toBeInTheDocument();
  });
});
