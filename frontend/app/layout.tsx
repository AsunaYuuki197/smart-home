import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"
import Sidebar from "./components/Sidebar";
import AppLayout from "./components/AppLayout";

const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: "Smart Home Dashboard",
  description: "A smart home dashboard interface",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <AppLayout>{children}</AppLayout>
    </html>
  )
}
