import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowRoles?: Array<"student" | "teacher" | "admin" | "school_owner">;
}

export const ProtectedRoute = ({ children, allowRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    console.warn('[ProtectedRoute] No user found, redirecting to landing page');
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Normalize role comparison (case-insensitive)
  const userRole = user.role?.toLowerCase();
  const normalizedAllowRoles = allowRoles?.map(r => r.toLowerCase());

  if (allowRoles && normalizedAllowRoles && !normalizedAllowRoles.includes(userRole as any)) {
    console.warn('[ProtectedRoute] Access denied:', {
      userRole: user.role,
      allowedRoles: allowRoles,
      path: location.pathname
    });
    
    // Redirect to appropriate dashboard instead of landing page
    const dashboardMap: Record<string, string> = {
      'student': '/dashboard-siswa',
      'teacher': '/dashboard-guru',
      'school_owner': '/school-owner-dashboard',
      'admin': '/admin/dashboard'
    };
    
    const redirectPath = dashboardMap[userRole] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
