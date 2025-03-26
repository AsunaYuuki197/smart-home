"use client"

import { useState, useEffect, useCallback,useContext } from "react";
import { ChevronDown } from "lucide-react";
import { useDeviceState } from "../../hooks/useDeviceState"
import { useDeviceControl } from "../../hooks/useDeviceControl"
import { DeviceContext } from "../../context/DeviceContext";


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


interface ControlRoomProps {
  name: string;
  rooms: string[];
  selectedRoom: string;
  setSelectedRoom: (room: string) => void;
}

interface ControlItemProps {
  user_ID?: number;
  isActive?: boolean;
  speedDevice?: number;
  color?: string
  label: string;
  name?: string;
  deviceID: number;
  selectRoom?: string;
}



// Main component
export default function Control({ name ,user_id}: { name: string,user_id:number }) {
  const device_id = name ==="Quạt" ? 1 : 2

  const { isOn, selectedRoom, setSelectedRoom, toggleDeviceState} = useDeviceState(name,user_id,device_id); // lấy thông tin hiện tại của control
  
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
          <ControlItem  label="Màu" selectRoom={selectedRoom} name={name} deviceID = {device_id}/>
        )}
        
        <ControlItem  label="Mức" selectRoom={selectedRoom} name={name} deviceID = {device_id} />
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


export function ControlItem({ user_ID, speedDevice, color, label, name, deviceID }: ControlItemProps) {
  const {
    isOpen,
    setIsOpen,
    speed,
    handleChangeSpeed,
    selectLightColor,
    handleSelectLightColor,
  } = useDeviceControl({ user_ID, speedDevice, color, name, deviceID });

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
            transition: "background 0.2s ease-in-out",
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
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <div
        className={`absolute left-0 mt-1 w-full bg-white shadow-md rounded-md border z-10
                  overflow-hidden transition-all duration-300 
                  ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="py-1">
          {["Đỏ", "Xanh", "Vàng"].map((lightColor) => (
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


