"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Bell, BarChart2, Settings, LogOut } from "lucide-react";
import Notifications from "./Notifications";
import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { handleLogout } = useAuth();

  const [isActiveNoty, setIsActiveNoty] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  function toggleNotifications() {
    setIsActiveNoty(!isActiveNoty);
    setIsAvatarMenuOpen(false);
  }

  function toggleAvatarMenu() {
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
    setIsActiveNoty(false);
  }

  function turnOffNotifications() {
    if (isActiveNoty) setIsActiveNoty(false);
  }

  function turnOffAvatarMenu() {
    if (isAvatarMenuOpen) setIsAvatarMenuOpen(false);
  }

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsActiveNoty(false);
    }
    if (
      avatarMenuRef.current &&
      !avatarMenuRef.current.contains(event.target as Node)
    ) {
      setIsAvatarMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={modalRef}>
      <Notifications isOpen={isActiveNoty} setIsOpen={setIsActiveNoty} />
      <div className="bg-[#E9E9E9] rounded-3xl flex flex-col gap-4 pb-4 w-fit mx-auto ml-5">
        <div
          className="rounded-full p-2 flex items-center justify-center relative"
          ref={avatarMenuRef}
        >
          <div
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-blue-400 transition-colors duration-200 ease-in-out cursor-pointer"
            onClick={toggleAvatarMenu}
          >
            <img
              src="https://th.bing.com/th/id/OIP.dND4f0DzJH4zmk0fYfhspQHaHa?rs=1&pid=ImgDetMain"
              alt="User avatar"
              className="w-11 h-11 bg-amber-50 rounded-full"
            />
          </div>

          {/* Avatar dropdown menu */}
          {isAvatarMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        <SidebarButton
          icon={<Home size={30} />}
          active={pathname === "/dashboard" || pathname === "/"}
          href="/dashboard"
          onClick={() => {
            turnOffNotifications();
            turnOffAvatarMenu();
          }}
        />
        <SidebarButton
          icon={<Bell size={30} />}
          active={isActiveNoty}
          onClick={toggleNotifications}
        />
        <SidebarButton
          icon={<BarChart2 size={30} />}
          active={pathname.startsWith("/statistical")}
          href="/statistical"
          onClick={() => {
            turnOffNotifications();
            turnOffAvatarMenu();
          }}
        />
        <SidebarButton
          icon={<Settings size={30} />}
          active={pathname.startsWith("/setting")}
          href="/setting"
          onClick={() => {
            turnOffNotifications();
            turnOffAvatarMenu();
          }}
        />
      </div>
    </div>
  );
}

function SidebarButton({
  icon,
  active,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  active: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const buttonClass = `w-12 h-12 rounded-2xl flex items-center justify-center
  ${
    active
      ? "bg-[#AEC7EE] text-white hover:bg-blue-400 transition-colors duration-300 ease-in-out"
      : "text-gray-400"
  }
  transition-all duration-300 ease-in-out hover:bg-[#AEC7EE] hover:text-white cursor-pointer`;
  return (
    <div className="flex justify-center w-full">
      {href ? (
        <Link href={href} className={buttonClass} onClick={onClick}>
          {icon}
        </Link>
      ) : (
        <button onClick={onClick} className={buttonClass}>
          {icon}
        </button>
      )}
    </div>
  );
}
