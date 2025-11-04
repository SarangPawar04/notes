const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
console.log("📡 FETCHING:", `${API_BASE}${path}`, options);


  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("fromAuth");
    window.location.href = "/auth"; // redirect if token expired
  }

  return res;
}
