import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import * as Acacia from "acacia-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sales CRM - Dashboard",
  description: "Modern Sales CRM Interface",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Acacia.AcaciaWrapper>
          <div>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto">{children}</main>
                <Acacia.AcaciaDashboard />
              </div>
            </SidebarProvider>
            <Toaster />
          </div>
        </Acacia.AcaciaWrapper>
      </body>
    </html>
  );
}
