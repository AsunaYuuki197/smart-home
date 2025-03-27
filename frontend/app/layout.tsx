import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"
import Sidebar from "./components/Sidebar";

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
          <div className="relative">
            <Sidebar/> 
          </div>
          <div className = "flex-1 ml-8 ">
            {children}
          </div>
        </body>
    </html>
  )
}
