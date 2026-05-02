"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { AdminProvider } from "@/context/AdminContext";
import { BookingProvider } from "@/context/BookingContext";
import { OperatorProvider } from "@/context/OperatorContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AdminProvider>
        <OperatorProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </OperatorProvider>
      </AdminProvider>
    </ToastProvider>
  );
}
