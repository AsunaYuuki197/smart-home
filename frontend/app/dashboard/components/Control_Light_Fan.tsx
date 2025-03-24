"use client"

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const rooms = ["Tất cả", "Phòng khách", "Phòng ngủ", "Phòng bếp", "Phòng tắm"]
const roomsObj = {
  "Tất cả":0,
   "Phòng khách":1,
   "Phòng ngủ":2,
   "Phòng bếp":3,
   "Phòng tắm":4
                }
const lightColors =["Trắng", "Vàng", "Xanh"]

export default function Control({ name }: {name: string}) {
  const [isOn, setIsOn] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState("Tất cả");
  
  function changeSatate(){
    setIsOn((prev) => !prev); 
  }
// CALL API bật tắt
  useEffect(() => {
      const fetchState = async () => {
      const user_id = parseInt(localStorage.getItem("user_id") || "1");

        try {
          const response = await fetch(`/api/device/${name==="Quạt"?'fan':'light'}/${isOn?'on':'off'}`, {
            method: "POST",
            body: JSON.stringify({ user_id: 1, device_id: 0, action: isOn ? 1 : 0, level: 0, color: "" }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await response.json();
        } catch (e:any) {
          alert("Error: " + e.message);
        }
    }
    fetchState();
  }, [isOn]);

  return (
    <div className="bg-white rounded-xl p-4 ">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
          </div>
          <span className="font-medium">{name}</span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={isOn} onChange={changeSatate} />
          <div className="w-11 h-6 bg-gray-200 rounded-full 
                      peer peer-checked:bg-teal-600 peer-checked:after:translate-x-full 
                      after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>

      <div className= {`space-y-2 ${isOn?"":"opacity-50 pointer-events-none"}`} >
        <ControlRoom name={name} rooms={rooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
        {name ==="Đèn" ?(<ControlItem label="Màu" selectRoom={selectedRoom} name={name} />):null}
        <ControlItem label="Mức" selectRoom={selectedRoom} name={name} />
      </div>
    </div>
  )
}

function ControlRoom({ name, rooms, selectedRoom, setSelectedRoom }: { name:string, rooms: string[], selectedRoom: string, setSelectedRoom: (room: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
  <div className="relative">
    <div
      className="flex items-center justify-between p-2  rounded-md cursor-pointer hover:bg-gray-100"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="text-sm">{selectedRoom}</span>
      <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </div>
    <div className={`absolute left-0  mt-1 w-full bg-white shadow-md rounded-md border z-10 ${name==="Quạt"?'bottom-10':null}
                      overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}>
        <ul className="py-1">
          {rooms.map((room) => (
            <li
              key={room}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                console.log(room);
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
  )
}

function ControlItem({ label,name,selectRoom }: { label: string, selectRoom:string ,name?:string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState(()=>{if(name === "Quạt") return 100; else return 4;});
  const [selectLightColor, setSelectLightColor] = useState("");
  
  function handleSelectLightColor(LightColor: string) {
    console.log(LightColor);
    setSelectLightColor(LightColor);
    setIsOpen(false); 
  }
  useEffect(()=>{
    const fetchChangeLight = async () =>{
      const user_id = parseInt(localStorage.getItem("user_id") || "1");

      const fetchDevice_id = 0//TODO
      try{
        const response = await fetch(`api/device/light/color`,{
          method: "POST",
          body: JSON.stringify({ user_id: user_id, device_id: fetchDevice_id, action: 1 , level: speed, color: selectLightColor }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json()
      }catch (e:any) {
        alert("Error: " + e.message);
      }
    }
    fetchChangeLight()
  },[selectLightColor])

  function handleChangeSpeed(newSpeed: number) {
    setSpeed(newSpeed);
  }

  useEffect(()=>{
    const fetchChangeSpeed = async () =>{
      const user_id = parseInt(localStorage.getItem("user_id") || "1");
      const fetchDevice_id = 0//TODO
      try{
        const response = await fetch(`api/device/${name === "Quạt" ?'fan': 'light'}/${name === "Quạt" ?'speed': 'level'}`,{
          method: "POST",
          body: JSON.stringify({ user_id: user_id, device_id: fetchDevice_id, action: 1 , level: speed, color: "" }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json()
      }catch (e:any) {
        alert("Error: " + e.message);
      }
    }
    fetchChangeSpeed()
  },[speed])

  return (
    <div className="">
      {label === "Mức" ? (
        <div className="flex flex-row items-center">
          <input
            type="range"
            min={name === "Quạt" ? 10 :  1}
            max={name === "Quạt" ? 100 :  4}
            step={name === "Quạt" ? 10 :  1}
            value={speed}
            onChange={(e) => handleChangeSpeed(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-200 ease-in-out bg-gray-200`}
            style={{
              background: `linear-gradient(to right, #4caf50 ${(speed - (name === "Quạt" ? 10 : 1)) / ((name === "Quạt" ? 100 : 4) - (name === "Quạt" ? 10 : 1)) * 100}%, #ddd 0%)`,
              transition: "background 0.2s ease-in-out"
            }}
            
          />
          <span className="text-sm font-medium ml-3">{speed}</span>
        </div>
      ) : (
        <div className="relative">
          <div
            className="flex items-center justify-between p-2  rounded-md cursor-pointer hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-sm">{selectLightColor || "Mặc định"}</span>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>

          <div className={`absolute left-0 mt-1 w-full bg-white shadow-md rounded-md border z-10
                        overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}>
            <ul className="py-1">
                {lightColors.map((LightColor) => (
                <li
                    key={LightColor}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectLightColor(LightColor)}
                  >
                    {LightColor}
                </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

