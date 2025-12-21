const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: "include",
    headers: { ...(options.headers || {}) },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  }

  if (!res.ok) throw new Error("Network error");
  return null;
}

export const auth = {
  signup: (payload) =>
    request("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
};

export const complaints = {
  register: (formData) =>
    request("/complaint/register", { method: "POST", body: formData }),
  my: () => request("/complaint/my"),
  details: (id) => request(`/complaint/details/${id}`),
};

export default request;
