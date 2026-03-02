import { useAuthStore } from "../store/useAuth";
import type { ErrorResponse, RestApiMethod } from "../types";

export async function apiRequest<T, K>(
  url: string,
  method: RestApiMethod = "GET",
  body?: K,
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.msg || "Request failed",
      status: response.status,
    } as ErrorResponse;
  }

  return data;
}
