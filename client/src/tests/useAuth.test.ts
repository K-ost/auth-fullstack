import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore, type IAuthStore } from "../store/useAuth";
import { Wrapper } from "./testUtils";
import type { User } from "../types";

const mockedToken = "mock_access_token";
const mockedUser: Pick<User, "email" | "id" | "name"> = {
  id: 1,
  email: "test@test.com",
  name: "Test",
};

describe("Auth Store", () => {
  let testResult: RenderHookResult<IAuthStore, unknown>;

  beforeEach(() => {
    testResult = renderHook(() => useAuthStore(), {
      wrapper: Wrapper,
    });
  });

  it("Login function", () => {
    act(() => {
      testResult.result.current.login(mockedToken, mockedUser);
    });

    expect(testResult.result.current.accessToken).toStrictEqual(mockedToken);
    expect(testResult.result.current.user).toStrictEqual(mockedUser);
  });

  it("Logout function", () => {
    act(() => {
      testResult.result.current.login(mockedToken, mockedUser);
    });
    act(() => {
      testResult.result.current.logout();
    });

    expect(testResult.result.current.accessToken).toStrictEqual(null);
    expect(testResult.result.current.user).toStrictEqual(null);
  });
});
