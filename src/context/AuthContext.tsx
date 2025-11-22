import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin" | "school_owner";
  avatar?: string;
  className?: string;
  school?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (payload: { token: string; user: AuthUser }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "adapti.portal.auth";

interface StoredAuthShape {
  token: string;
  user: AuthUser;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StoredAuthShape | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredAuthShape;
    } catch (error) {
      console.error("Gagal membaca sesi autentikasi", error);
      return null;
    }
  });

  useEffect(() => {
    if (state) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  const value = useMemo<AuthContextValue>(() => ({
    user: state?.user ?? null,
    token: state?.token ?? null,
    login: ({ token, user }) => setState({ token, user }),
    logout: () => {
      setState(null);
      // Clear all auth-related data from localStorage
      window.localStorage.removeItem("schoolId");
      window.localStorage.removeItem("token");
    },
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipanggil di dalam AuthProvider");
  }
  return context;
};
