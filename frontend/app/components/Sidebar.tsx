"use client";
import type React from "react"
import { useState, useEffect } from "react"
import { Home, Bell, BarChart2, Settings } from "lucide-react"
import { useRouter ,usePathname} from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const routes = ["/dashboard", "/dashboard", "/statistical", "/setting"];

  const [isActive, setIsActive] = useState(()=>routes.findIndex(route => route === pathname) ?? 0);
  


  function hanldeClick(index: number) {
    setIsActive(index),
    router.push(routes[index]);
  }
  return (
    <div className=" bg-[#E9E9E9] rounded-3xl flex flex-col gap-4 pb-4 w-fit mx-auto ml-5">
      <div className=" rounded-full p-2 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-blue-400 transition-colors duration-200 ease-in-out
         cursor-pointer">
          <img src="https://th.bing.com/th/id/OIP.dND4f0DzJH4zmk0fYfhspQHaHa?rs=1&pid=ImgDetMain" alt="User avatar" className="w-11 h-11 bg-amber-50 rounded-full" />
        </div>
      </div>

      <SidebarButton icon={<Home size={30} />} active = {isActive == 0} onClick = {()=>hanldeClick(0) } />
      <SidebarButton icon={<Bell size={30} />} active = {isActive == 1} onClick = {()=>hanldeClick(1)}/>
      <SidebarButton icon={<BarChart2 size={30} />}active = {isActive == 2} onClick = {()=>hanldeClick(2)} />
      <SidebarButton icon={<Settings size={30} />} active = {isActive == 3} onClick = {()=>hanldeClick(3)}/>
    </div>
  )
}

function SidebarButton({ icon, active = false, onClick }: { icon: React.ReactNode; active?: boolean; onClick: () => void; }) {
  return (
    <div className="flex justify-center w-full">
      <button
        className={`w-12 h-12 rounded-2xl flex items-center justify-center
         ${active ? "bg-[#AEC7EE] text-white hover:bg-blue-400 transition-colors duration-300 ease-in-out" : " text-gray-400"}
         transition-all duration-300 ease-in-out
         hover:bg-[#AEC7EE] hover:text-white
         cursor-pointer`}
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  )
}

