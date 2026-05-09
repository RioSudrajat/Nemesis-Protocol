"use client";
import { FiTopNav } from "@/components/fi/FiTopNav";

export default function FiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light min-h-screen bg-[#F4F5F6]">
      <FiTopNav />
      <main className="min-w-0">
        {children}
      </main>
    </div>
  );
}
