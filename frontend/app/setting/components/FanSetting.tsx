"use client";
import {useState, useEffect,useRef} from "react";
import ActiveControl from "./ActiveControl";
import { ChevronDown, Info } from "lucide-react";
import {fan_autorule} from "../../models/fan_autorule";
import { autoruleService } from "@/app/services/autoruleService";

function FanSetting({fanObj}:{fanObj:fan_autorule}) {
    const [isActive, setIsActive] = useState(Object.keys(fanObj).length == 0 ? false : true);
    const handleActiveChange = async () => {
        const newState = !isActive;
        setIsActive(newState);
        if (!newState) {
            await autoruleService.deleteHTSensor(fanObj["deviece_id"] || 1); // device_id = 1 quajt ?
            await autoruleService.deleteTimeFrame(fanObj["deviece_id"] || 1);
        }
    }
    return (
        <>
        <span className = "font-bold text-3xl ml-10 "> Quạt </span>
        
        <div className = "flex-1/5 flex items-center justify-between bg-white rounded-4xl pl-10 pr-10">
            <ActiveControl name = "Fan" title = "Tự động điều khiển" status={isActive} setStatus = {setIsActive} handleChange={handleActiveChange} />
        </div>

        <div className = {`flex-4/5 flex flex-col justify-around gap-2 bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10
                            ${isActive ? "opacity-100" : "opacity-40 pointer-events-none" } `}>
            <ControlByTemp key={`temp`} fanObj={fanObj} isActive = {isActive}/> {/* Điều khiển qua nhiệt độ */}
            <span className=" border-1 border-gray-600 w-full"></span>
            {/* Ddieeuf khien theo thoi gian*/}
            <ControlByTime key={`time`} fanObj={fanObj} isActive = {isActive}/>
        </div>
        </>
    );
}

function ControlByTime ({fanObj, isActive}:{fanObj:fan_autorule, isActive:boolean}) {
    const [isActiveTime, setIsActiveTime] = useState(fanObj["time_rule"] == undefined ? false : true);
    
    const [from, setFrom] = useState(fanObj["time_rule"] == undefined ? "" : String(new Date(fanObj["time_rule"]["start_time"]).toTimeString().slice(0, 5)));
    const [to, setTo] = useState(fanObj["time_rule"] == undefined ? "" : String(new Date(fanObj["time_rule"]["end_time"]).toTimeString().slice(0, 5)));
    const [frequency,setFrequency] = useState("tần suất")
    const freqs =["Hàng ngày","1 lần","2 lần","3 lần","4 lần"]

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const deleteTimeFrame = async () => {
            await autoruleService.deleteTimeFrame(fanObj["deviece_id"] || 1);
        }
        const createTimeFrame = async () => {
            const timeFrame = {
                deviece_id: fanObj["deviece_id"] || 1,
                start_time: "07:00",
                end_time: "11:00",
                repeat: frequency
            }
            try{
                await autoruleService.createTimeFrame(1,timeFrame.start_time,timeFrame.end_time, 1).then((response) => {
                    console.log("Create time frame successfully");
                })
            }
            catch (error:any){
                console.error(`Error creating time frame:`, error.message);
            }
            
        }
        if(!isActive || !isActiveTime) {
            setFrom("07:00");
            setTo("11:00");
            setFrequency("tần suất")
            setIsActiveTime(false);
            deleteTimeFrame();
        }
        if (isActive && isActiveTime) {
            // Bật ở chế độ mặc định
            createTimeFrame();
        }
    },[isActive, isActiveTime])

    const handleSaveTime = async () => {
        const timeFrame = {
            deviece_id: fanObj["deviece_id"] || 1,
            start_time: from,
            end_time: to,
            repeat: frequency
        }
        await autoruleService.createTimeFrame(1,timeFrame.start_time,timeFrame.end_time, 1)
    }
    return (
        <div className = "flex flex-row gap-8 w-ful">

        <div className="flex flex-col w-full items-start gap-2 font-bold">
            <span>Điều khiển theo thời gian </span>
            <div className="flex w-full items-center gap-4">
                <label htmlFor="Temp-input" className={`flex flex-1/2 gap-3 text-sm ${isActiveTime ?"opacity-90":"opacity-40"}`}>
                    <span className="font-bold">Từ:</span>
                    <input type="time" 
                            className="appearance-none w-fit rounded-[5px] border-1 pl-1 border-[#000000]
                            [&::-webkit-calendar-picker-indicator]:hidden" 
                            value = {from}
                            onChange = {(e) => {setFrom(e.target.value)} }
                            />
                    <span className="font-bold">Đến:</span>
                    <input type="time" 
                            className="appearance-none w-fit rounded-[5px] border-1 pl-1 border-[#000000]
                            [&::-webkit-calendar-picker-indicator]:hidden"
                            value = {to}
                            onChange = {(e) => {setTo(e.target.value) } }
                            />
                </label>
            
                <DropDown isOpen = {isActiveTime} selectValue={frequency} setSelectValue={setFrequency} values={freqs}/>

            </div>
        </div>
        <div className = "flex flex-col justify-start  gap-2">
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
               <button className={`w-fit text-sm font-bold text-black bg-[#E2E8F1]
                                                     rounded-[5px] px-2 py-1 cursor-pointer hover:opacity-50
                                        ${isActiveTime ? "opacity-100 ":"opacity-40 pointer-events-none"}`}
                                            onClick = {handleSaveTime}>
                                            Lưu
                </button>
                
                </div>
    </div>
    )
}
function ControlByTemp({fanObj, isActive}:{fanObj:fan_autorule, isActive:boolean}) {
    const [selectConfig, setSelectConfig] = useState(fanObj["htsensor_rule"] == undefined ? "Mặc định" : "Tùy chỉnh");
    const [selectLevel, setSelectLevel] = useState(fanObj["htsensor_rule"] == undefined ? 95 : fanObj["htsensor_rule"]["level"]);
    const [isOpen,setIsOpen] = useState(fanObj["htsensor_rule"] == undefined ? false : true);
    const [temperature, setTemperature] = useState(fanObj["htsensor_rule"] == undefined ? 25 : fanObj["htsensor_rule"]["temperature"]);
    const [humidity,setHumidity] = useState(fanObj["htsensor_rule"] == undefined ? 50 : fanObj["htsensor_rule"]["humidity"]);


    const configs = ["Mặc định", "Tùy chỉnh"]
    const fanLevels = [1,2,3,4]

    const isFirstRender = useRef(true);

    const handleSaveTempConfig = () => {
        const tempConfig = {
            deviece_id: fanObj["deviece_id"] || 1,
            temperature: temperature || 25,
            humidity: humidity || 50,
            level: selectLevel || 95
        }
        autoruleService.createHTSensor(1,tempConfig.temperature,tempConfig.humidity, tempConfig.level).then((response) => {
            alert("Lưu cấu hình thành công");
        })
        .catch((error:any) => {
            console.error(`Error creating time frame:`, error.message);
        })
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const deleteTemp = async () => {
            await autoruleService.deleteHTSensor(fanObj["deviece_id"] || 1);
        }
        const createTemp = async () => {
            const tempConfig = {
                deviece_id: fanObj["deviece_id"] || 1,
                temperature: 25,
                humidity: 50,
                level: 95
            }
            try{
                await autoruleService.createHTSensor(1,tempConfig.temperature,tempConfig.humidity, tempConfig.level).then((response) => {
                    console.log("Create temp config successfully");
                })
            }
            catch (error:any){
                console.error(`Error creating time frame:`, error.message);
            }
            
        }
        if(!isActive || !isOpen) {
            setSelectConfig("Mặc định");
            setSelectLevel(95);
            setTemperature(25);
            setHumidity(50);
            setIsOpen(false);
            deleteTemp();
        }
        if (isActive && isOpen) {
            // Bật ở chế độ mặc định
            createTemp();
        }
    },[isActive, isOpen])
    return (
      <>
            <div className = "flex flex-row gap-8 w-ful">
                <div className = {`flex flex-col justify-around w-full font-bold gap-2 ${isOpen ? "cursor-pointer":"opacity-60"}`}>
                    <div className = "flex flex-row justify-between w-full font-bold gap-4">
                        <span className={`flex flex-2/3 items-center `}>Điều khiển theo nhiệt độ, độ ẩm</span>
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
                                        <span className="font-bold">Nhiệt độ:</span>
                                        <input type="number" 
                                                className="appearance-none w-[42px] rounded-[5px] border-1 pl-1 border-[#000000]" 
                                                min = {0}
                                                max = {50}
                                                value = {temperature}
                                                onChange = {(e) => setTemperature(parseInt(e.target.value))}
                                                />
                                        <span className="font-bold">Độ ẩm:</span>
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
                <div className = "flex flex-col justify-start  gap-2">
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
                {selectConfig ==="Tùy chỉnh" ? (<button className={`w-fit text-sm font-bold text-black bg-[#E2E8F1]
                                                     rounded-[5px] px-2 py-1 cursor-pointer hover:opacity-50
                                        ${isOpen && (selectConfig ==="Tùy chỉnh") ? "opacity-100 ":"opacity-40 pointer-events-none"}`}
                                            onClick = {handleSaveTempConfig}>
                                            Lưu
                </button>) : <div></div>} 
                
                </div>
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