// src/api.js

// Use Vite proxy (/api → http://localhost:3000)
const API_BASE = "/api";

console.log("[API] Base URL:", API_BASE);

async function request(path, options = {}) {
  console.log("[API] Fetching:", API_BASE + path);

  try {
    const res = await fetch(API_BASE + path, {
      credentials: "include",
      headers: {
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    }

    if (!res.ok) {
      throw new Error("Network error");
    }

    return null;
  } catch (err) {
    console.error("[API] Fetch error:", err);
    throw err;
  }
}

/* =========================
   AUTH API
   ========================= */

export const auth = {
  signup: (payload) =>
    request("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),
};

/* =========================
   COMPLAINT API
   ========================= */

export const complaints = {
  register: (formData) =>
    request("/complaint/register", {
      method: "POST",
      body: formData,
    }),

  my: () => request("/complaint/my"),

  details: (id) => request(`/complaint/details/${id}`),
};

export default request;
