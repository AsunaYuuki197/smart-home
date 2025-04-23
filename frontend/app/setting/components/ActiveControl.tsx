"use client";
import {useState} from "react";
function ActiveControl({ name,title,status,setStatus,handleChange }: 
    { name: string , title:string, status:boolean, setStatus: (status: boolean) => void, handleChange?: () => void }) {
    const [isOn, setIsOn] = useState(status ? status: false);

    function handleClick(){
        if(setStatus){
            setStatus(!status);
        }
        setIsOn(!isOn);
        if(isOn){
            console.log("Tắt tự động điều khiển " + name);
        }
    }
     // Thẻ cha là flex items-center
  return (
    <div className = {`flex items-center justify-between w-full ${status?"":"opacity-50"}`}>
        <span className="font-bold nt-bold text-black">{title}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={status} onChange={handleChange || handleClick}  />
            <div className="w-11 h-6 bg-gray-200
                        rounded-full peer peer-checked:bg-teal-600 
                        peer-checked:after:translate-x-full 
                        after:content-[''] after:absolute 
                        after:top-0.5 after:left-[2px]
                        after:bg-white after:border-gray-300
                        after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
    </div>
  );
}
export default ActiveControl;