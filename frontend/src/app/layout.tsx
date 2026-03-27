import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import { BookingProvider } from "@/context/BookingContext";
import { EnterpriseProvider } from "@/context/EnterpriseContext";
import { AdminProvider } from "@/context/AdminContext";
import { PartCatalogProvider } from "@/context/PartCatalogContext";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOC ID — Trustless Vehicle Identity on Solana",
  description:
    "Decentralized vehicle passport system. On-chain service history, AI predictive maintenance, and interactive 3D Digital Twins — all powered by Solana blockchain.",
  keywords: ["NOC ID", "Solana", "blockchain", "vehicle", "digital passport", "NFT", "Web3", "automotive"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo2.variable}`}>
      <body className="font-exo bg-[#0F172A] text-slate-50 antialiased selection:bg-purple-500/30 selection:text-purple-200">
        <ToastProvider>
          <AdminProvider>
            <PartCatalogProvider>
              <BookingProvider>
                <EnterpriseProvider>
                  {children}
                </EnterpriseProvider>
              </BookingProvider>
            </PartCatalogProvider>
          </AdminProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
