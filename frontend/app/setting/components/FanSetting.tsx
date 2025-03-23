"use client";
import {useState, useEffect} from "react";
import ActiveControl from "./ActiveControl";
import { ChevronDown, Info } from "lucide-react";
function FanSetting() {
    const [isActive, setIsActive] = useState(false);
    const [isActiveTime, setIsActiveTime] = useState(false);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [frequency,setFrequency] = useState("tần suất")

    const freqs =["1 lần","2 lần","3 lần","4 lần"]

    return (
        <>
        <span className = "font-bold text-3xl ml-10 "> Quạt </span>
        
        <div className = "flex-1/5 flex items-center justify-between bg-white rounded-4xl pl-10 pr-10">
            <ActiveControl name = "Fan" title = "Tự động điều khiển" status={isActive} setStatus = {setIsActive} />
        </div>

        <div className = {`flex-4/5 flex flex-col justify-around gap-2 bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10
                            ${isActive ? "opacity-100" : "opacity-40 pointer-events-none" } `}>
            <ControlByTemp key={`temp-${isActive}`} isActive = {isActive}/> {/* Điều khiển qua nhiệt độ */}
            <span className=" border-1 border-gray-600 w-full"></span>
            {/* Ddieeuf khien theo thoi gian*/}
            <div className = "flex flex-row gap-8 w-ful">

                <div className="flex flex-col w-full items-start gap-2">
                    <span>Điều khiển theo thời gian </span>
                    <div className="flex w-full items-center gap-4">
                        <label htmlFor="Temp-input" className={`flex flex-1/2 gap-3 text-sm ${isActiveTime ?"opacity-90":"opacity-40"}`}>
                            <span className="font-bold">Từ:</span>
                            <input type="time" 
                                    className="appearance-none w-fit rounded-[5px] border-1 pl-1 border-[#000000]
                                    [&::-webkit-calendar-picker-indicator]:hidden" 
                                    value = {from || to }
                                    onChange = {(e) => setFrom(e.target.value)}
                                    />
                            <span className="font-bold">Đến:</span>
                            <input type="time" 
                                    className="appearance-none w-fit rounded-[5px] border-1 pl-1 border-[#000000]
                                    [&::-webkit-calendar-picker-indicator]:hidden"
                                    value = {to || from}
                                    onChange = {(e) => setTo(e.target.value) }
                                    />
                        </label>
                    
                        <DropDown isOpen = {isActiveTime} selectValue={frequency} setSelectValue={setFrequency} values={freqs}/>

                    </div>
                </div>
                <label className="relative inline-flex items-start cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isActiveTime} onChange={()=>setIsActiveTime(!isActiveTime)}  />
                        <div className="w-11 h-6 bg-gray-200
                                        rounded-full peer peer-checked:bg-teal-600 
                                        peer-checked:after:translate-x-full 
                                        after:content-[''] after:absolute 
                                        after:top-0.5 after:left-[2px]
                                        after:bg-white after:border-gray-300
                                        after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
            </div>
        </div>
        </>
    );
}


function ControlByTemp({isActive}:{isActive:boolean}) {
    const [selectConfig, setSelectConfig] = useState("Mặc định")
    const [selectLevel, setSelectLevel] = useState(1)
    const [isOpen,setIsOpen] = useState(false)
    const [temperature, setTemperature] = useState(0)
    const [humidity,setHumidity] = useState(23)


    const configs = ["Mặc định", "Tùy chỉnh"]
    const fanLevels = [1,2,3,4]
    return (
      <>
            <div className = "flex flex-row gap-8 w-ful">
                <div className = {`flex flex-col justify-around w-full font-bold gap-2 ${isOpen ? "cursor-pointer":"opacity-60"}`}>
                    <div className = "flex flex-row justify-between w-full font-bold gap-4">
                        <span className={`flex flex-1/2 items-center `}>Điều khiển theo nhiệt độ, độ ẩm</span>
                        <DropDown isOpen = {isOpen} selectValue={selectConfig} setSelectValue={setSelectConfig} values={configs}/>
                    </div>
                    <div className = "flex flex-row  w-full font-bold text-sm gap-4">
                        {!(selectConfig ==="Tùy chỉnh") ? (    <div className="flex items-center text-gray-800 hover:text-red-900">
                                        <Info  className="w-5 h-5" />
                                        <span className="ml-2">Tùy vào nhiệt độ và độ ẩm, quạt sẽ tự động điều chỉnh.</span>
                                        </div>) 
                                : (
                                <>
                                    <label htmlFor="Temp-input" className={`flex flex-1/2 gap-1 text-sm ${isOpen && (selectConfig ==="Tùy chỉnh") ?"opacity-90":"opacity-40"}`}>
                                        <span className="font-bold">Nhiệt độ từ:</span>
                                        <input type="number" 
                                                className="appearance-none w-[42px] rounded-[5px] border-1 pl-1 border-[#000000]" 
                                                min = {0}
                                                max = {50}
                                                value = {temperature}
                                                onChange = {(e) => setTemperature(parseInt(e.target.value))}
                                                />
                                        <span className="font-bold">Độ ẩm từ:</span>
                                        <input type="number" 
                                                className="appearance-none w-[42px] rounded-[5px] border-1 pl-1 border-[#000000]" 
                                                min = {0}
                                                max = {50}
                                                value = {humidity}
                                                onChange = {(e) => setHumidity(parseInt(e.target.value))}
                                                />
                                    </label>
                                    <div className="flex flex-1/2 flex-row gap-4 ">
                                        <span className={`w-fit `}>Mức Quạt: </span>
                                        <DropDown isOpen = {isOpen} selectValue={selectLevel} setSelectValue={setSelectLevel} values={fanLevels}/>
                                    </div>
                                </>
                                )
                        }
                    </div>
                </div>
                <label className="relative inline-flex items-start cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isOpen} onChange={()=>setIsOpen(!isOpen)}  />
                        <div className="w-11 h-6 bg-gray-200
                                        rounded-full peer peer-checked:bg-teal-600 
                                        peer-checked:after:translate-x-full 
                                        after:content-[''] after:absolute 
                                        after:top-0.5 after:left-[2px]
                                        after:bg-white after:border-gray-300
                                        after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
            </div> 
      </>    
    )
}

function DropDown({isOpen,selectValue,setSelectValue,values}
                :{isOpen:boolean,selectValue:any,setSelectValue:(selectValue:any)=>void,values:any[]}){

    const [dropDown, setDropDown] = useState(false)
    return(
                    <div className={`relative w-full flex flex-1/2 items-center rounded-[5px] pl-5 text-sm border-1  border-[#000000] 
                                 ${isOpen ? "cursor-pointer hover:bg-gray-100":"pointer-events-none opacity-40"}`}
                        onClick={() => setDropDown(!dropDown)}
                        >
                        {typeof(selectValue) === "string" ? selectValue : `Mức ${selectValue}`}
                        <ChevronDown size={20} 
                                    className={`absolute right-1 transition-transform 
                                                ${dropDown && isOpen ? "rotate-180" : ""}`} />

                        {/* DROPDOWN */}
                        <div className={`absolute left-0 top-full  mt-1 w-full bg-white rounded-md border z-[50]
                            overflow-hidden transition-all duration-300 ${
                                dropDown && isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            }`}>
                            <ul className="py-1">
                            {values.map((value) => (
                                <li
                                key={value}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectValue(value);
                                    setDropDown(false);
                                }}
                                >
                                {typeof(value) === "string" ? value : `Mức ${value}`}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
    );
}


export default FanSetting;