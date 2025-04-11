"use client";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith("/login"); // Hiện sidebar nếu KHÔNG phải /login

  return (
    <body className={`min-h-screen bg-[#DCE9FC] p-8 flex flex-row ${inter.className}`}>
      {showSidebar && (
        <div className="relative">
          <Sidebar />
        </div>
      )}
      <div className={`flex-1 ${showSidebar ? "ml-8" : ""}`}>
        {children}
      </div>
    </body>
  );
}
