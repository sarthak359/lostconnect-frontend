export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries: number = 5,
  delay: number = 2000
): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Server error");
    }
    return await response.json() as T;
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((res) => setTimeout(res, delay));
    return fetchWithRetry<T>(url, options, retries - 1, delay);
  }
}
