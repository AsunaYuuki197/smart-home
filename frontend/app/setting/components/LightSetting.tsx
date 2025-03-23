"use client";
import {useState, useEffect} from "react";
import ActiveControl from "./ActiveControl";
import { ChevronDown, Info } from "lucide-react";
function LightSetting() {
    const [isActive, setIsActive] = useState(false);
    const [isActiveTime, setIsActiveTime] = useState(false);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [frequency,setFrequency] = useState("tần suất")
    const [isMove, setIsMove] = useState(false);

    const freqs =["1 lần","2 lần","3 lần","4 lần"]

    return (
        <>
        <span className = "font-bold text-3xl ml-10 "> Đèn </span>
        <div className = "flex-1/5 flex items-center justify-between bg-white rounded-4xl pl-10 pr-10">
            <ActiveControl name = "Fan" title = "Tự động điều khiển" status={isActive} setStatus = {setIsActive} />
        </div>
        
        <div className = {`flex-4/5 flex flex-col justify-around gap-3 bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10
                            ${isActive ? "opacity-100" : "opacity-40 pointer-events-none" } `}>
            
            <ActiveControl name = "Move" title = "Điều khiển khi thấy chuyển động" status={isMove} setStatus = {setIsMove} />
            <span className=" border-1 border-gray-600 w-full"></span>
            
            <Control key={`temp-${isActive}`} isActive = {isActive}/> 
            <span className=" border-1 border-gray-600 w-full"></span>

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


function Control({isActive}:{isActive:boolean}) {
    const [selectConfig, setSelectConfig] = useState("Mặc định")
    const [selectLevel, setSelectLevel] = useState(1)
    const [selectColor, setSelectColor] = useState("Màu")

    const [isOpen,setIsOpen] = useState(false)
    const [light,setLight] = useState(23)
    

    const configs = ["Mặc định", "Tùy chỉnh"]
    const lightLevels = [1,2,3,4]
    const lightColors = ["Trắng","Xanh","Vàng"]
    return (
      <>
            <div className = "flex flex-row gap-8 w-ful">
                <div className = {`flex flex-col justify-around w-full font-bold gap-2 `}>
                    <div className = {`flex flex-row justify-between w-full font-bold gap-4 ${isOpen ? "cursor-pointer":"opacity-60 pointer-events-none"}`}>
                        <span className={`flex flex-2/3 items-center `}>Điều khiển theo cường độ ánh sáng</span>
                        <DropDown isOpen = {isOpen} selectValue={selectConfig} setSelectValue={setSelectConfig} values={configs} size ="flex-1/3"/>
                    </div>
                    <div className ={`flex flex-row justify-between w-full font-bold text-sm gap-4 z-50 ${isOpen ? "cursor-pointer":"opacity-60 pointer-events-none"}`}>
                        {!(selectConfig ==="Tùy chỉnh") ? (    
                                        <>
                                            <div className="flex flex-2/3 items-center text-gray-800 hover:text-red-900">
                                                <Info  className="w-5 h-5" />
                                                <span className="ml-2">Tùy vào cường độ ánh sáng, đèn sẽ tự động điều chỉnh theo từng mức độ.</span>
                                            </div>
                                            <DropDown isOpen = {true} selectValue={selectColor} setSelectValue={setSelectColor} values={lightColors} size="flex-1/3"/>
                                        </>
                                    ) 
                                : (
                                <>
                                    <label htmlFor="Temp-input" className={`flex  text-sm ${isOpen && (selectConfig ==="Tùy chỉnh") ?"":"opacity-40"}`}>
                                        <span className="font-bold">Cường độ ánh sáng từ từ:</span>
                                        <input type="number" 
                                                className="appearance-none w-[42px] rounded-[5px] border-1 pl-1 border-[#000000]" 
                                                min = {0}
                                                max = {1000}
                                                value = {light}
                                                onChange = {(e) => setLight(parseInt(e.target.value))}
                                                disabled={!isOpen || !(selectConfig ==="Tùy chỉnh")}
                                                />
                                    </label>
                                    <div className="flex flex-2 flex-row  ">
                                        <span className={`w-fit `}>Màu: </span>
                                        <DropDown isOpen = {isOpen} selectValue={selectColor} setSelectValue={setSelectColor} values={lightColors}/>
                                    </div>
                                    <div className="flex flex-3 flex-row  ">
                                        <span className={`w-fit `}>Mức đèn: </span>
                                        <DropDown isOpen = {isOpen} selectValue={selectLevel} setSelectValue={setSelectLevel} values={lightLevels}/>
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

function DropDown({isOpen,selectValue,setSelectValue,values,size}
                :{isOpen:boolean,selectValue:any,setSelectValue:(selectValue:any)=>void,values:any[],size?:string}){

    const [dropDown, setDropDown] = useState(false)
    return(
                    <div className={`relative flex ${size ||"flex-1/2"} items-center rounded-[5px] pl-2 text-sm border-1 border-[#000000]  
                                 ${isOpen ? "cursor-pointer hover:bg-gray-100":"pointer-events-none opacity-40"}`}
                        onClick={() => setDropDown(!dropDown)}
                        >
                        {typeof(selectValue) === "string" ? selectValue : `Mức ${selectValue}`}
                        <ChevronDown size={20} 
                                    className={`absolute right-1 transition-transform 
                                                ${dropDown && isOpen ? "rotate-180" : ""}`} />

                        {/* DROPDOWN */}
                        <div className={`absolute left-0 top-full  mt-1 w-full bg-white rounded-md border z-[100]
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


export default LightSetting;