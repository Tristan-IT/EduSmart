import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const loadUser = async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        navigate("/", { replace: true });
        return;
      }
      const payload = await response.json();
      login({ token, user: payload.user });
      if (payload.user.role === "teacher" || payload.user.role === "admin") {
        navigate("/dashboard-guru", { replace: true });
      } else {
        navigate("/dashboard-siswa", { replace: true });
      }
    };

    loadUser().catch(() => navigate("/", { replace: true }));
  }, [location.search, login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <span className="text-lg font-semibold">Sedang memuat sesi Anda…</span>
      <span className="text-sm text-muted-foreground">Mohon tunggu sebentar.</span>
    </div>
  );
};

export default AuthCallback;
