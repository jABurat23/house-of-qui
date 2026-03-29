import axios from "axios";

// The Sovereign API client — all requests pass through the Imperial Gate
export const api = axios.create({
  baseURL: "http://localhost:4000",
});

// Attaches the Imperial Session token to every outgoing request
api.interceptors.request.use((config) => {
  const session = localStorage.getItem("imperial_session");
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      // Malformed session — ignore
    }
  }
  return config;
});