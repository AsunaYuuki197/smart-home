import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google"
import Sidebar from "./components/Sidebar";
import { DeviceProvider } from "./context/DeviceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
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
        <body  className =  {`min-h-screen bg-[#DCE9FC] p-8  flex flex-row ${inter.className}`}>
          <div>
            <Sidebar/> 
          </div>
          <div className = "flex-1 ml-8 ">
            <DeviceProvider>
            {children}
            </DeviceProvider>
          </div>
        </body>
    </html>
  )
}
