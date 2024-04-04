class FetchError extends Error {
  info: any;
  status: number | undefined;
}

export async function apiClient(path: string, options: RequestInit = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, options);

  if (!res.ok) {
    const error = new FetchError("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;

    throw error;
  }
  return res.json();
}
