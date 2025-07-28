"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/verification");
        return;
      }

      if (requiredRole && userData?.role !== requiredRole) {
        console.log(`User role: ${userData?.role}, Required role: ${requiredRole}`);
        
        if (userData?.role === "admin") {
          router.push("/dashboard/admin");
        } else if (userData?.role === "committee") {
          router.push("/dashboard/committee");
        } else {
          router.push("/dashboard/user");
        }
        return;
      }

      if (!requiredRole && userData?.role) {
        if (userData.role === "admin") {
          router.push("/dashboard/admin");
        } else if (userData.role === "committee") {
          router.push("/dashboard/committee");
        } else {
          router.push("/dashboard/user");
        }
        return;
      }
    }
  }, [user, userData, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && userData?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}; 