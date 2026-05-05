"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useDriverAuthStore } from "@/store/driverAuthStore";

/**
 * Wraps driver portal pages — checks session and redirects to login if unauthenticated.
 * Skips guarding the login page itself.
 */
export function DriverAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkSession } = useDriverAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkSession();
    setChecked(true);
  }, [checkSession]);

  // Don't guard the login page
  if (pathname === "/depin/driver/login") {
    return <>{children}</>;
  }

  // Still loading session check
  if (!checked) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#0a0e17" }}
      >
        <Loader2 size={28} className="text-[#14B8A6] animate-spin" />
        <p className="text-sm text-white/30 mt-3">Loading session...</p>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    router.replace("/depin/driver/login");
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#0a0e17" }}
      >
        <Loader2 size={28} className="text-[#14B8A6] animate-spin" />
        <p className="text-sm text-white/30 mt-3">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
