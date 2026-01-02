import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // {id,email,fullName,unlocked}

  async function refresh() {
    try {
      const res = await apiFetch("/api/auth/me");
      if (!res.ok) throw new Error("not authed");
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function login(email, password) {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok || data.ok === false) throw new Error(data.message || "Login failed");
    setUser(data);
  }

  async function register(fullName, email, password) {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok || data.ok === false) throw new Error(data.message || "Register failed");
  }

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    await refresh();
  }

  const value = useMemo(()=>({ loading, user, login, register, logout, refresh }), [loading, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
