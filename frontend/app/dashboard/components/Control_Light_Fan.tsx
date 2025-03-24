"use client"

import { useState, useEffect, useCallback,useRef } from "react";
import { ChevronDown } from "lucide-react";

// Constants moved outside component to prevent re-creation
const ROOMS = ["Tất cả", "Phòng khách", "Phòng ngủ", "Phòng bếp", "Phòng tắm"];
const ROOMS_ID = {
  "Tất cả": 0,
  "Phòng khách": 1,
  "Phòng ngủ": 2,
  "Phòng bếp": 3,
  "Phòng tắm": 4
};
const LIGHT_COLORS = ["Trắng", "Vàng", "Xanh"];

// API service
const deviceService = {
  toggleDevice: async (deviceType: string, isOn: boolean, userId: number) => {
    try {
      const response = await fetch(`/api/device/${deviceType}/${isOn ? 'on' : 'off'}`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, device_id: 0, action: isOn ? 1 : 0, level: 0, color: "" }),
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error: any) {
      throw new Error(`Error toggling device: ${error.message}`);
    }
  },
  
    setDeviceLevel: async (deviceType: string, endpoint: string, level: number, userId: number) => {
    try {
      const response = await fetch(`/api/device/${deviceType}/${endpoint}`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, device_id: 0, action: 1, level, color: "" }),
        headers: { "Content-Type": "application/json" },
      });
      sessionStorage.setItem(`${deviceType}_${endpoint}`, JSON.stringify(level));
      return await response.json();
    } catch (error: any) {
      throw new Error(`Error setting device level: ${error.message}`);
    }
  },
  
  setLightColor: async (color: string, level: number, userId: number) => {
    try {
      const response = await fetch(`/api/device/light/color`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, device_id: 0, action: 1, level, color }),
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error: any) {
      throw new Error(`Error setting light color: ${error.message}`);
    }
  }
};

// Custom hook for device state
function useDeviceState(name: string) {
  const deviceType = name === "Quạt" ? 'fan' : 'light';
  const [selectedRoom, setSelectedRoom] = useState("Tất cả");
  const [userId, setUserId] = useState<number>(1);
  
  const [isOn, setIsOn] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = sessionStorage.getItem(`state_${deviceType}`);
      if (savedState !== null) {
        setIsOn(JSON.parse(savedState));
      }
    }
  }, []);
  
  
  useEffect(() => {
      if (typeof window !== "undefined") {
        setUserId(parseInt(localStorage.getItem("user_id") || "1"));
      }
  }, []);
  
  
  const toggleCooldownRef = useRef(false); // Biến cờ ngăn spam click

  const toggleDeviceState = useCallback(() => {
    if (toggleCooldownRef.current) return; // Nếu đang cooldown thì không thực hiện
    toggleCooldownRef.current = true;
  
    setIsOn(prev => {
      const newState = !prev;
      sessionStorage.setItem(`state_${deviceType}`, JSON.stringify(newState));
      return newState;
    });
  
    setTimeout(() => {
      toggleCooldownRef.current = false; // Sau 300ms cho phép bấm tiếp
    }, 300);
  }, [deviceType]);
  
  useEffect(() => {
    let isMounted = true; // Kiểm tra component có bị unmount không
  
    const toggleDevice = async () => {
      try {
        await deviceService.toggleDevice(deviceType, isOn, userId);
      } catch (error: any) {
        console.error(error.message);
        if (isMounted) {
          alert("Lỗi khi kết nối với thiết bị hoặc tại bản chuyển trang nhanh quá :). Vui lòng thử lại sau. toggleDevice " + deviceType);
        }
      }
    };
  
    toggleDevice();
  
    return () => {
      isMounted = false; // Cleanup khi unmount
    };
  }, [isOn, deviceType, userId]); 
  
  return { isOn, setIsOn, selectedRoom, setSelectedRoom, toggleDeviceState, userId };
}

// Types
interface ControlRoomProps {
  name: string;
  rooms: string[];
  selectedRoom: string;
  setSelectedRoom: (room: string) => void;
}

interface ControlItemProps {
  isOn?: boolean
  label: string;
  name?: string;
  selectRoom: string;
}

// Main component
export default function Control({ name }: { name: string }) {
  const { isOn, selectedRoom, setSelectedRoom, toggleDeviceState } = useDeviceState(name);

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
          </div>
          <span className="font-medium">{name}</span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isOn} 
            onChange={toggleDeviceState} 
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full 
                      peer peer-checked:bg-teal-600 peer-checked:after:translate-x-full 
                      after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>

      <div className={`space-y-2 ${isOn ? "" : "opacity-50 pointer-events-none"}`}>
        <ControlRoom 
          name={name} 
          rooms={ROOMS} 
          selectedRoom={selectedRoom} 
          setSelectedRoom={setSelectedRoom} 
        />
        
        {name === "Đèn" && (
          <ControlItem  label="Màu" selectRoom={selectedRoom} name={name} />
        )}
        
        <ControlItem  label="Mức" selectRoom={selectedRoom} name={name} />
      </div>
    </div>
  );
}

function ControlRoom({ name, rooms, selectedRoom, setSelectedRoom }: ControlRoomProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div
        className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm">{selectedRoom}</span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>
      
      <div 
        className={`absolute left-0 mt-1 w-full bg-white shadow-md rounded-md border z-10 
                  ${name === "Quạt" ? 'bottom-10' : ''} 
                  overflow-hidden transition-all duration-300 
                  ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="py-1">
          {rooms.map((room) => (
            <li
              key={room}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedRoom(room);
                setIsOpen(false);
              }}
            >
              {room}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ControlItem({label, name, selectRoom }: ControlItemProps) {
  const [isOpen, setIsOpen] = useState(false); //Cho việc chọn màu đèn
  const [speed, setSpeed] = useState(() => name === "Quạt" ? 100 : 4);
  const [selectLightColor, setSelectLightColor] = useState("");
  const [userId, setUserId] = useState(1);
  const deviceType = name === "Quạt" ? 'fan' : 'light';
  const endpoint = name === "Quạt" ? 'speed' : 'level';


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSpeed = sessionStorage.getItem(`${deviceType}_${endpoint}`); // lấy dữ liệu speed
      if (savedSpeed !== null) {
        setSpeed(JSON.parse(savedSpeed));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(parseInt(localStorage.getItem("user_id") || "1")); // Lấy dữ liệu ID từ local
    }
  }, []);
  
  const handleSelectLightColor = useCallback((lightColor: string) => {
    setSelectLightColor(lightColor);
    setIsOpen(false);
  }, []);
  
  const handleChangeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);
  
  // Effect for light color change
  useEffect(() => {
    if (!selectLightColor) return;
    
    const changeLightColor = async () => {
      try {
        await deviceService.setLightColor(selectLightColor, speed, userId);
      } catch (error: any) {
        console.error(error.message);
      }
    };
    
    changeLightColor();
  }, [selectLightColor]);
  
  // Effect for speed/level change
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        await deviceService.setDeviceLevel(deviceType, endpoint, speed, userId);
      } catch (error: any) {
        console.error(error.message);
      }
    }, 500); // Trì hoãn (0.5s)
  
    return () => clearTimeout(timeout); // clear timeout 
  }, [speed]);
  
  if (label === "Mức") {
    const minValue = name === "Quạt" ? 10 : 1;
    const maxValue = name === "Quạt" ? 100 : 4;
    const step = name === "Quạt" ? 10 : 1;
    const percentage = ((speed - minValue) / (maxValue - minValue)) * 100;
    
    return (
      <div className="flex flex-row items-center">
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={step}
          value={speed}
          onChange={(e) => handleChangeSpeed(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-200 ease-in-out bg-gray-200"
          style={{
            background: `linear-gradient(to right, #4caf50 ${percentage}%, #ddd 0%)`,
            transition: "background 0.2s ease-in-out"
          }}
        />
        <span className="text-sm font-medium ml-3">{speed}</span>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div
        className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm">{selectLightColor || "Mặc định"}</span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>

      <div 
        className={`absolute left-0 mt-1 w-full bg-white shadow-md rounded-md border z-10
                  overflow-hidden transition-all duration-300 
                  ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="py-1">
          {LIGHT_COLORS.map((lightColor) => (
            <li
              key={lightColor}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectLightColor(lightColor)}
            >
              {lightColor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}