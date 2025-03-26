"use client";
import { usePathname, useRouter } from "next/navigation";
import { Home, Bell, BarChart2, Settings } from "lucide-react";
import Notifications from "./Notifications"
import {useState,useRef,useCallback,useEffect} from 'react'
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const routes = ["/dashboard", "/notify", "/statistical", "/setting"];
  const [isActiveNoty,setIsActiveNoty] = useState(false)
  function handleClick(index: number) {
    if (routes[index] === "/notify"){
      setIsActiveNoty(!isActiveNoty)
    } 
    else if (pathname !== routes[index]) { // Chỉ chuyển nếu khác đường dẫn hiện tại
      if(isActiveNoty)setIsActiveNoty(!isActiveNoty)
      router.push(routes[index]);
    }
  }
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsActiveNoty(false);
      }
  }, []);
  
  useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  return (
  
    <div ref={modalRef}>
    <Notifications isOpen = {isActiveNoty} setIsOpen = {setIsActiveNoty}/>
    <div className="bg-[#E9E9E9] rounded-3xl flex flex-col gap-4 pb-4 w-fit mx-auto ml-5">
      <div className="rounded-full p-2 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-blue-400 transition-colors duration-200 ease-in-out cursor-pointer">
          <img
            src="https://th.bing.com/th/id/OIP.dND4f0DzJH4zmk0fYfhspQHaHa?rs=1&pid=ImgDetMain"
            alt="User avatar"
            className="w-11 h-11 bg-amber-50 rounded-full"
            />
        </div>
      </div>

      <SidebarButton icon={<Home size={30} />} active={(pathname === "/dashboard" || pathname === "/")} onClick={() => handleClick(0)} />
      <SidebarButton icon={<Bell size={30} />} active={isActiveNoty} onClick={() => handleClick(1)} />
      <SidebarButton icon={<BarChart2 size={30} />} active={pathname === "/statistical"} onClick={() => handleClick(2)} />
      <SidebarButton icon={<Settings size={30} />} active={pathname === "/setting"} onClick={() => handleClick(3)} />
    </div>
    </div>
  );
}

function SidebarButton({ icon, active, onClick }: { icon: React.ReactNode; active: boolean; onClick: () => void; }) {
  return (
    <div className="flex justify-center w-full">
      <button
        className={`w-12 h-12 rounded-2xl flex items-center justify-center
          ${active ? "bg-[#AEC7EE] text-white hover:bg-blue-400 transition-colors duration-300 ease-in-out" : "text-gray-400"}
          transition-all duration-300 ease-in-out hover:bg-[#AEC7EE] hover:text-white cursor-pointer`}
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  );
}
