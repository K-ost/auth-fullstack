import type { ErrorResponse, RestApiMethod } from "../types";

export async function getData<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
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

export async function mutateData<T, K>(
  url: string,
  method: RestApiMethod,
  body?: K,
): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    method,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.msg || "Request failed",
    } as ErrorResponse;
  }

  return data;
}
