export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export async function jsonFetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    credentials: "include",      // ← セッションCookieをやり取り
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
