import fetchWithMock from "@/utils/fetchWithMock"

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  return fetchWithMock(input, { ...init, cache: "no-store" })
}

export default apiFetch
