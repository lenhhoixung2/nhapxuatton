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
  title: "Kho Pro Mobile | Quản Lý Thông Minh",
  description: "Hệ thống quản lý kho thông minh chuẩn Pro",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kho Pro Mobile",
  },
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased bg-[#020617] text-slate-100 flex justify-center min-h-screen`}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
        </div>

        <main className="w-full max-w-lg min-h-screen glass-card relative z-10 flex flex-col shadow-2xl pb-24 border-x border-white/5">
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
