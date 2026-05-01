import type { Metadata } from "next";
import { Providers } from "@/context/Providers";
import { Orbitron, Exo_2, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
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

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nemesis Protocol — DePIN for Productive EV Infrastructure",
  description:
    "Nemesis Protocol turns productive EV infrastructure into telemetry-verified, cashflow-generating on-chain financing products.",
  keywords: ["Nemesis Protocol", "DePIN", "EV infrastructure", "Solana", "IDRX", "mobility credit pools", "RWA"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo2.variable} ${fraunces.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-exo2)] bg-[#0F0F23] text-[#F8FAFC] antialiased selection:bg-[#8B5CF6]/30 selection:text-white" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
