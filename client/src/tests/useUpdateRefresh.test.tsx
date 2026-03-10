import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import useUpdateRefresh from "../hooks/useUpdateRefresh";
import TestWrapper from "./testWrapper";
import { mockedFetch } from "./setup";
import type { UsersReponse } from "../types";
import { useAuthStore } from "../store/useAuth";
import { mockedFailResponse, mockedLoginResponse, mockedUsers } from "./mocks";

function setup() {
  const { result } = renderHook(
    () => useUpdateRefresh<UsersReponse>({ keys: ["test"], url: "/users" }),
    { wrapper: TestWrapper },
  );
  return { result };
}

describe("useUpdateRefresh", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Getting data - refresh token is still alive", async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockedUsers),
    });

    const { result } = setup();

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy();
    });

    expect(result.current.data?.count).toBe(2);
    expect(result.current.data?.data.length).toBe(2);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).not.toHaveBeenCalledWith("/refresh");
  });

  it("Getting data - refresh token is expired", async () => {
    mockedFetch.mockImplementation((url) => {
      if (url.endsWith("/users"))
        return Promise.resolve({
          ok: false,
          status: 401,
          json: async () => mockedFailResponse,
        });
      if (url.endsWith("/refresh"))
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockedLoginResponse,
        });
    });

    const loginSpy = vi.spyOn(useAuthStore.getState(), "login");

    setup();

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith("new_token", {
        email: "test@test.com",
        id: 1,
        name: "User",
      });
    });
  });
});
