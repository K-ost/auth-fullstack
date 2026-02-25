import type { ErrorResponse, RestApiMethod } from "../types";

export async function mutateData<T, K>(
  url: string,
  method: RestApiMethod,
  body?: K,
): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    method,
    body: JSON.stringify(body) ?? null,
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
