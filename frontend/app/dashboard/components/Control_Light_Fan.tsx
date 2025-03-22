"use client"

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const rooms = ["Tất cả", "Phòng khách", "Phòng ngủ", "Phòng bếp", "Phòng tắm"]
const lightColors =["Trắng", "Vàng", "Xanh"]
const fanSpeeds = [10,20,30,40,50,60,70,80,90,100]
const lightLevels = [1,2,3,4]


export default function Control({ name }: {name: string}) {
  const [isOn, setIsOn] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState("Tất cả");

  function changeSatate(){
    setIsOn(!isOn);
    if(name === "Đèn"){
      console.log("Tắt/Bật đèn");
      //TODO: Call APT  Tăt/Bật đèn
    }
    else{
      console.log("Tắt/Bật quạt");
      //TODO: Call API Tắt/Bật quạt
    }
  }

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
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>

      <div className="space-y-2">
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

    {isOpen && (
      <div className={`absolute left-0  mt-1 w-full bg-white shadow-md rounded-md border z-10 ${name==="Quạt"?'bottom-10':null}`}>
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
    )}
  </div>
  )
}

function ControlItem({ label,name,selectRoom }: { label: string, selectRoom:string ,name?:string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState(()=>{if(name === "Quạt") return 100; else return 4;});
  const [selectOption, setSelectOption] = useState(label);
  function handleSelectOption(option: string) {
    console.log(option);
    setSelectOption(option);
    //TODO: Call API update Light color

    setIsOpen(false);
  }
  function handleChangeSpeed(newSpeed: number) {
    setSpeed(newSpeed);
    if(selectRoom ==="Tất cả"){
      if(name === "Quạt"){
        console.log("Điều chỉnh tất cả tốc độ quạt: ", newSpeed);
        //TODO: Call API update
      }
      else{
        console.log("Điều chỉnh tất cả mức sáng: ", newSpeed);
        //TODO: Call API update
      }
    }
    else{
      if(name==="Quạt"){
        console.log("Điều chỉnh phòng ",selectRoom," tốc độ quạt: ", newSpeed);
        //TODO: Call API update
        
      }
      else{
        console.log("Điều chỉnh phòng ",selectRoom," mức sáng: ", newSpeed);
        //TODO: Call API update
      }
    }
  }

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
            className="w-full h-2 bg-green-300 rounded-lg appearance-none cursor-pointer hover:bg-gray-100"
          />
          <span className="text-sm font-medium ml-3">{speed}</span>
        </div>
      ) : (
        <div className="relative">
          <div
            className="flex items-center justify-between p-2  rounded-md cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-sm">{selectOption}</span>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>

          {isOpen && (
            <div className="absolute left-0 mt-1 w-full bg-white shadow-md rounded-md border z-10">
              <ul className="py-1">
                {lightColors.map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectOption(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

