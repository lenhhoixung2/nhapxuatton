import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AutoCacheClear } from "@/components/AutoCacheClear";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kho Pro Mobile | Hệ thống Quản lý Kho",
  description: "Giải pháp quản lý kho thông minh chuẩn Pro",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kho Pro",
  },
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased bg-[#f1f5f9] text-[#0f172a] flex justify-center min-h-screen`}
      >
        <main className="w-full max-w-lg min-h-screen bg-white relative z-10 flex flex-col shadow-xl pb-24 border-x border-slate-200">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        
        <AutoCacheClear />
        <BottomNav />
      </body>
    </html>
  );
}
