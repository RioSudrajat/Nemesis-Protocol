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

  // Check stored session on mount
  useEffect(() => {
    checkSession();
    setChecked(true);
  }, [checkSession]);

  // Redirect to login if not authenticated (inside useEffect, not render)
  useEffect(() => {
    if (checked && !isAuthenticated && pathname !== "/depin/driver/login") {
      router.replace("/depin/driver/login");
    }
  }, [checked, isAuthenticated, pathname, router]);

  // Don't guard the login page
  if (pathname === "/depin/driver/login") {
    return <>{children}</>;
  }

  // Still loading session check, or redirecting
  if (!checked || !isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#0a0e17" }}
      >
        <Loader2 size={28} className="text-[#14B8A6] animate-spin" />
        <p className="text-sm text-white/30 mt-3">
          {!checked ? "Loading session..." : "Redirecting to login..."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
