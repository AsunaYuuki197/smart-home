"use client"

import { useState, useEffect, useCallback,useContext } from "react";
import { ChevronDown } from "lucide-react";
import { useDeviceState } from "../../hooks/useDeviceState"
import { useDeviceControl } from "../../hooks/useDeviceControl"
import { useMqttClient } from "@/app/hooks/useMqttClient";
import { autoruleService } from "@/app/services/autoruleService";
// import { deviceService } from "../../services/deviceService";
// import { setLogLevel } from "firebase/app";

// Constants moved outside component to prevent re-creation
const ROOMS = ["Tất cả", "Phòng khách", "Phòng ngủ", "Phòng bếp", "Phòng tắm"];
const ROOMS_ID = {
  "Tất cả": 0,
  "Phòng khách": 1,
  "Phòng ngủ": 2,
  "Phòng bếp": 3,
  "Phòng tắm": 4
};
const LIGHT_COLORS: Record<string, string> = {
 "white": "Trắng",
 "yellow": "Vàng",
 "red": "Đỏ",
 "orange": "Cam",
 "blue": "Xanh Dương",
 "green": "Xanh lá",
"purple": "Tím",
}
const BG_LIGHT_COLORS: Record<string, string> = {
  "white": "#FFFFFF",
  "yellow": "#FFFF00",  
  "red": "#FF0000",     
  "orange": "#FFA500",  
  "blue": "#0000FF",     
  "green": "#008000",    
  "purple": "#800080",  
};


interface ControlRoomProps {
  name: string;
  rooms: string[];
  selectedRoom: string;
  setSelectedRoom: (room: string) => void;
}

interface ControlItemProps {
  label: string;
  name: string;
  selectRoom?: string;
  speed:number;
  selectLightColor:string;
  isOpen:boolean;setIsOpen:(Active:React.SetStateAction<boolean>)=>void;
  handleChangeSpeed: (newSpeed: number) => void;
  handleSelectLightColor:(lightColor:string)=>void;
}
const AIO_KEY = process.env.NEXT_PUBLIC_AIO_KEY;
const AIO_USERNAME = process.env.NEXT_PUBLIC_AIO_USERNAME;

const getLatestFeedValue = async (feed: string) => {
  if (!AIO_KEY ){
      throw new Error("AIO_KEY is not defined");
  }
  const res = await fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feed}/data?limit=1`, {
      headers: {
          "X-AIO-Key": AIO_KEY,
      },
      });

  if (!res.ok) {
      throw new Error("Failed to fetch feed data");
      }
  const data = await res.json();
  return data[0]?.value || null;

}
// Main component
export default function Control({ name ,user_id, onChange }: { name: string, onChange: () => void, user_id:number }) {
  const device_id = name ==="Quạt" ? 1 : 2
  const [isActive, setIsActive] = useState<boolean|null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [speed, setSpeed] = useState<number>((name === "Quạt" ? 100 : 4));
  const [selectLightColor, setSelectLightColor] = useState<string>("");
  let timeCountdown = 15;
  useEffect(() => {
    async function fetchData() {
      try {
        if(device_id == 1){
          const status = await getLatestFeedValue("fan");
          const speed = await getLatestFeedValue("fanspeed")
          setIsActive(status == "1" ?true:false)
          setSpeed(Number(speed))
        }
        if(device_id == 2){
          const status = await getLatestFeedValue("on-off-light");
          const speed = await getLatestFeedValue("lightlevel")
          const color = await getLatestFeedValue("lightcolor")

          setIsActive(status == "1" ?true:false)
          setSpeed(Number(speed))
          setSelectLightColor(color)
        }
      } catch (err) {
        console.error(" Error loading initial feed value", err);
      } finally {
        setIsLoading(false); 
      }
    }

    fetchData();
  }, []);

    const {publish} = useMqttClient((feed, value) => {
      if (device_id == 1){
        if (feed == "fan") setIsActive(value == "1"? true :false);
        if (feed == "fanspeed"){
          const newValue = Number(value)
          setSpeed(newValue)
        }
      }
      //"on-off-light", "lightcolor", "lightlevel"
      if (device_id==2) {
        if (feed == "on_off_light" ) setIsActive(value == "1"? true :false);
        if (feed == "lightcolor") setSelectLightColor(value);
        if (feed == "lightlevel") setSpeed(Number(value))
      }
  });

  const { isOn, selectedRoom, setSelectedRoom, toggleDeviceState} = useDeviceState(name,user_id,
                                                                                  device_id,isLoading,
                                                                                  selectLightColor,speed,
                                                                                  isActive,setIsActive); 
  const { isOpen, setIsOpen, handleChangeSpeed, handleSelectLightColor} = useDeviceControl({user_ID: user_id, name, 
                                                                                    deviceID: device_id,isLoading,
                                                                                    speed,setSpeed,
                                                                                    selectLightColor,setSelectLightColor,
                                                                                  });
  const handleSpeed = (newSpeed:number) => {
    // setIsPaused(false)
    // setTimeCountdown(timeCountdown)
    onChange()
    handleChangeSpeed(newSpeed)
  }
 
  return (
    <div className="flex flex-col justify-between bg-white rounded-xl p-2">
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
            checked={isOn!==null?isOn:true} 
            onChange={()=>{toggleDeviceState()
              setIsOpen(false);
              onChange()
              // setIsPaused(false);
              // setTimeCountdown(timeCountdown)
            }}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full 
                      peer peer-checked:bg-teal-600 peer-checked:after:translate-x-full 
                      after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>

      <div className={`space-y-1 ${isActive ? "" : "opacity-50 pointer-events-none"}`}>
        <ControlRoom 
          name={name} 
          rooms={ROOMS} 
          selectedRoom={selectedRoom} 
          setSelectedRoom={setSelectedRoom} 
        />
        
        {name === "Đèn" && (
          <ControlItem label="Màu" name={name} selectLightColor = {selectLightColor}  
                                      speed={speed} isOpen ={isOpen} setIsOpen ={setIsOpen}
                                      handleChangeSpeed={()=>{handleSpeed}} handleSelectLightColor ={handleSelectLightColor}
                                    selectRoom={selectedRoom} />
        )}

        <ControlItem label="Mức" name={name} selectLightColor = {selectLightColor} 
                                      speed={speed} isOpen ={isOpen} setIsOpen ={setIsOpen}
                                      handleChangeSpeed={handleSpeed} handleSelectLightColor ={handleSelectLightColor}
                                      selectRoom={selectedRoom}   />
      </div>
    </div>
  );
}

function ControlRoom({ name, rooms, selectedRoom, setSelectedRoom }: ControlRoomProps) {
  const [isDropDown, setIsDropDown] = useState(false);
  
  return (
    <div className="relative">
      <div
        className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={() => setIsDropDown(!isDropDown)}
      >
        <span className="text-sm pl-5">{selectedRoom}</span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isDropDown ? "rotate-180" : ""}`} 
        />
      </div>
      
      <div 
        className={`absolute left-0 mt-1 w-full bg-white shadow-md rounded-md border z-10 
                  ${name === "Quạt" ? 'bottom-10' : ''} 
                  overflow-hidden transition-all duration-300 
                  ${isDropDown ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="py-1">
          {rooms.map((room) => (
            <li
              key={room}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedRoom(room);
                setIsDropDown(false);
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


export function ControlItem({ 
                          label, name,  
                          speed,
                          selectLightColor,
                          isOpen,setIsOpen,
                          handleChangeSpeed,
                          handleSelectLightColor
                        }: ControlItemProps) {

  
  if (label === "Mức") {
    const minValue = name === "Quạt" ? 0 : 1;
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
          value={speed||0}
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
  // CHọn màu đèn
  return (
    <div className="relative">
      <div
        className={`relative flex items-center justify-between p-2  rounded-md cursor-pointer hover:bg-gray-200 ` }
        
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm pl-5">{LIGHT_COLORS[selectLightColor] || "Màu đèn"}</span>
        <div className={`absolute right-10  w-4 h-4 bg-gray-700 rounded-[4px]  border-2 border-black `}
                  style={{backgroundColor:BG_LIGHT_COLORS[selectLightColor]}}></div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <div
        className={`absolute left-0 mt-1 w-full bg-white shadow-md rounded-md border z-10
                  overflow-y-scroll transition-all duration-300 
                  ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="py-1">
          {Object.keys(LIGHT_COLORS).map((lightColor) => (
            
           <li
              key={lightColor}
              className={`relative flex items-center px-4 py-1 hover:bg-gray-300 cursor-pointer border-b-1 border-b-gray-200 rounded-[4px]`}
              onClick={() => handleSelectLightColor(lightColor)}
              >
              <span className = "p-2 ">{LIGHT_COLORS[lightColor]}</span>
              <div className={`absolute  right-6 w-4 h-4 bg-gray-700 rounded-[4px] border-2 border-black`}
                  style={{backgroundColor:BG_LIGHT_COLORS[lightColor]}}></div>
            </li>
            
            
          ))}
        </ul>
      </div>
    </div>
  );
}


