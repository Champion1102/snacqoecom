export type RequestOptions = Omit<RequestInit, "body"> & { body?: object };

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, ...rest } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string>),
  };

  const res = await fetch(path, {
    ...rest,
    credentials: "include",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data as { error?: string })?.error ?? res.statusText;
    throw new Error(message);
  }

  return data as T;
}

export async function requestMultipart<T>(path: string, formData: FormData, method = "POST"): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: "include",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data as { error?: string })?.error ?? res.statusText;
    throw new Error(message);
  }

  return data as T;
}
