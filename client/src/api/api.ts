import type { RestApiMethod } from "../types";

export async function mutateData<T>(
  url: string,
  method: RestApiMethod,
  body?: string,
): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    method,
    body: body ?? null,
  });
  const data = await response.json();
  return data;
}
