"use client";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { getFirebaseMessaging, onMessage } from "@/lib/firebase"; 

const inter = Inter({ subsets: ["latin"] });

const useFirebaseMessaging = () => {
  useEffect(() => {
    const setupFCM = async () => {
      const messaging = await getFirebaseMessaging();

      if (!messaging) {
        console.warn("🚫 Messaging not supported in this browser.");
        return;
      }

      onMessage(messaging, (payload) => {
        console.log("🔔 Foreground message received:", payload);
        const { title, body } = payload.notification || {};
        if (title && body) {
          alert(`${title}: ${body}`);
        }
      });
    };

    setupFCM();
  }, []);
};



export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith("/login"); // Hiện sidebar nếu KHÔNG phải /login
  useFirebaseMessaging();
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
