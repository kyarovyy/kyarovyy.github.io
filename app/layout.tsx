import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Accounting Trainer",
  description: "Lokale Accounting-Lern-App ohne kostenpflichtige APIs",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Accounting Trainer",
    statusBarStyle: "default"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <AppShell>{children}</AppShell>
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
