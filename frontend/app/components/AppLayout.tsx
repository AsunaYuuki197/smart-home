"use client";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { getFirebaseMessaging, onMessage } from "@/lib/firebase";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const showSidebar = !pathname.startsWith("/login");

  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access_token");
      setToken(storedToken);
      if (!storedToken) {
        router.replace("/login");
      }
      else {
        setIsChecking(false);
      }
    }
  }, [router]);
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang kiểm tra đăng nhập...</p>
      </div>
    );
  }
  useEffect(() => {
    const setupFCM = async () => {
      if (typeof window === "undefined") return;
      const storedToken = sessionStorage.getItem("access_token");
      
      if (!storedToken) return;
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn("🚫 Không được cấp quyền thông báo.");
          return;
        }
      }

      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        console.warn("🚫 Messaging not supported in this browser.");
        return;
      }
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      }
      
      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification || {};
        const alertKey = `alert-${title}`;
        if (!sessionStorage.getItem("access_token")) {
          sessionStorage.removeItem(alertKey); // Xóa alertKey nếu không có token
        }
        if ( title && body && showSidebar && !sessionStorage.getItem(alertKey)) {
          alert(`Notification: ${title}\n${body}`);
          sessionStorage.setItem(alertKey, 'true');
        }
      });
    };

    setupFCM();
  }, [token]);

  return (
    <div className={`min-h-screen bg-[#DCE9FC] p-5 flex flex-row `}>
      {showSidebar && (
        <div className="relative">
          <Sidebar />
        </div>
      )}
      <div className={`flex-1 ${showSidebar ? "ml-8" : ""}`}>
        {children}
      </div>
      </div>
  );
}
