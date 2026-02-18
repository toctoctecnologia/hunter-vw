import fetchWithMock from "@/utils/fetchWithMock"

export class HttpError extends Error {
  status: number
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

export async function httpJSON<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T | undefined> {
  const headers = new Headers({ Accept: "application/json" })
  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => {
      headers.set(key, value)
    })
  }
  const res = await fetchWithMock(input, { ...init, headers, cache: "no-store" })

  if (res.status === 204 || res.status === 205) return undefined

  const contentType = res.headers.get("Content-Type") ?? ""
  const text = await res.text()

  // If response is not JSON but we get HTML (like a 404 page), handle gracefully
  if (!contentType.toLowerCase().includes("application/json")) {
    // For HTML responses, check if it's an error or try to extract meaningful info
    if (res.status >= 400) {
      throw new HttpError(
        `Erro ${res.status}: ${res.statusText}`,
        res.status,
        text,
      )
    }
    throw new HttpError(
      `Resposta não é JSON (content-type: ${contentType || "desconhecido"})`,
      res.status,
      text,
    )
  }

  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new HttpError("Resposta JSON inválida", res.status, text)
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? (data as any).message
        : res.statusText
    throw new HttpError(message, res.status, data)
  }

  return data as T
}

export default httpJSON
