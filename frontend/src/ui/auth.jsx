import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api.js";

const AuthContext = createContext(null);

function normalizeUser(payload) {
  if (!payload || payload.id == null || !payload.email) {
    return null;
  }

  const normalizedEmail = String(payload.email).trim().toLowerCase();
  const fullName = typeof payload.fullName === "string" && payload.fullName.trim()
    ? payload.fullName.trim()
    : normalizedEmail.split("@")[0] || "AS DANCE User";

  return {
    id: payload.id,
    email: normalizedEmail,
    fullName,
    unlocked: Boolean(payload.unlocked),
  };
}

function getAuthErrorMessage(message, mode) {
  switch (message) {
    case "Failed to fetch":
      return "Unable to reach auth server. Start backend on port 8085 and try again.";
    case "USER_NOT_FOUND":
    case "INVALID_PASSWORD":
      return "Incorrect email or password.";
    case "ACCOUNT_DISABLED":
      return "This account is disabled. Please contact support.";
    case "EMAIL_NOT_ALLOWED":
      return mode === "register"
        ? "This email is not allowed for access."
        : "This email is not allowed to login.";
    case "EMAIL_ALREADY_REGISTERED":
      return "This email already has an account. Please login instead.";
    default:
      return message || (mode === "register" ? "Register failed" : "Login failed");
  }
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // {id,email,fullName,unlocked}

  async function refresh() {
    try {
      const res = await apiFetch("/api/auth/me");
      if (!res.ok) throw new Error("not authed");
      const data = await res.json();
      setUser(normalizeUser(data));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function login(email, password) {
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok || data.ok === false) throw new Error(getAuthErrorMessage(data.message, "login"));
      const nextUser = normalizeUser(data);
      if (nextUser) {
        setUser(nextUser);
        return;
      }
      await refresh();
    } catch (error) {
      throw new Error(getAuthErrorMessage(error?.message, "login"));
    }
  }

  async function register(fullName, email, password) {
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok || data.ok === false) throw new Error(getAuthErrorMessage(data.message, "register"));
    } catch (error) {
      throw new Error(getAuthErrorMessage(error?.message, "register"));
    }
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
