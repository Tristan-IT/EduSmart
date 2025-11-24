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
  tokenExpiry: number | null;
  isTokenExpiringSoon: boolean;
  login: (payload: { token: string; user: AuthUser }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "token"; // Unified storage key

interface StoredAuthShape {
  token: string;
  user: AuthUser;
  tokenExpiry: number; // Unix timestamp in ms
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StoredAuthShape | null>(() => {
    if (typeof window === "undefined") return null;
    
    // Try direct token first (new format)
    const token = window.localStorage.getItem(STORAGE_KEY);
    if (token) {
      // Check if there's user data in old format
      const oldData = window.localStorage.getItem("adapti.portal.auth");
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData) as { token: string; user: AuthUser };
          // Calculate expiry: 7 days from now (matching backend)
          const tokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
          return { token, user: parsed.user, tokenExpiry };
        } catch (error) {
          console.error("Gagal membaca sesi autentikasi lama", error);
        }
      }
    }
    
    return null;
  });

  // Auto-logout on token expiration
  useEffect(() => {
    if (!state?.tokenExpiry) return;
    
    const checkExpiry = () => {
      if (Date.now() > state.tokenExpiry) {
        console.warn("Token expired, logging out");
        setState(null);
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem("schoolId");
        window.localStorage.removeItem("adapti.portal.auth");
      }
    };
    
    // Check every minute
    const interval = setInterval(checkExpiry, 60000);
    checkExpiry(); // Check immediately
    
    return () => clearInterval(interval);
  }, [state?.tokenExpiry]);

  useEffect(() => {
    if (state) {
      // Store token directly (new format)
      window.localStorage.setItem(STORAGE_KEY, state.token);
      // Keep old format for backward compatibility temporarily
      window.localStorage.setItem("adapti.portal.auth", JSON.stringify({
        token: state.token,
        user: state.user
      }));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("adapti.portal.auth");
    }
  }, [state]);

  const value = useMemo<AuthContextValue>(() => {
    // Check if token is expiring within 1 hour
    const isTokenExpiringSoon = state?.tokenExpiry 
      ? (state.tokenExpiry - Date.now()) < 60 * 60 * 1000
      : false;
    
    return {
      user: state?.user ?? null,
      token: state?.token ?? null,
      tokenExpiry: state?.tokenExpiry ?? null,
      isTokenExpiringSoon,
      login: ({ token, user }) => {
        // Calculate expiry: 7 days from now
        const tokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
        setState({ token, user, tokenExpiry });
      },
      logout: () => {
        setState(null);
        // Clear all auth-related data from localStorage
        window.localStorage.removeItem("schoolId");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("adapti.portal.auth");
      },
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipanggil di dalam AuthProvider");
  }
  return context;
};
