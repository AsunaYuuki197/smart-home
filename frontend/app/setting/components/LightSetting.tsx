"use client";
import {useState, useEffect, useRef} from "react";
import ActiveControl from "./ActiveControl";
import { ChevronDown, Info } from "lucide-react";
import { light_autorule } from "@/app/models/light_autorule";
import { autoruleService } from "@/app/services/autoruleService";

const LIGHT_COLORS: Record<string, string> = {
    "white": "Trắng",
    "yellow": "Vàng",
    "red": "Đỏ",
    "orange": "Cam",
    "blue": "Xanh Dương",
    "green": "Xanh lá",
   "purple": "Tím",
}
const LIGHT_COLOR_KEYS = Object.entries(LIGHT_COLORS).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);

function LightSetting({lightObj}:{lightObj:light_autorule}) {
    const [isActive, setIsActive] = useState(Object.keys(lightObj).length == 0 ? false : true);
    const [isMove, setIsMove] = useState(lightObj.motion_rule?.motion_trigger == "on" ? true : false);

    const handleChange = async () => {
        const newStatus = !isActive;
        setIsActive(newStatus);
        if(!newStatus){
            setIsMove(false);
            await autoruleService.deleteMotion(2); //DEVICE ID
            await autoruleService.deleteTimeFrame(2); //DEVICE ID
            await autoruleService.deleteLightSensor(2); //DEVICE ID
        }
    }
    const handleMove = async () => {
        const newStatus = !isMove;
        setIsMove(newStatus);
        if(!newStatus){
            await autoruleService.deleteMotion(2); //DEVICE ID
        }else{
            try {
                await autoruleService.createMotion(2); //DEVICE ID
            } catch (error) {
                console.error("Error saving motion rule:", error);
            }
        }
    }
    return (
        <>
        <span className = "font-bold text-3xl ml-10 "> Đèn </span>
        <div className = "flex-1/5 flex items-center justify-between bg-white rounded-4xl pl-10 pr-10">
            <ActiveControl name = "Fan" title = "Tự động điều khiển" status={isActive} setStatus = {setIsActive} handleChange = {handleChange} />
        </div>
        
        <div className = {`flex-4/5 flex flex-col justify-around gap-3 bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10
                            ${isActive ? "opacity-100" : "opacity-40 pointer-events-none" } `}>
            
            <ActiveControl name = "Move" title = "Điều khiển khi thấy chuyển động" status={isMove} setStatus = {setIsMove} handleChange = {handleMove}/>

            <span className=" border-1 border-gray-600 w-full"></span>
            <Control key={`light`} lightObj = {lightObj} isActive = {isActive}/>

            <span className=" border-1 border-gray-600 w-full"></span>
            {/* ĐIỀU KHIỂN THEO THỜI GIAN */}
            <TimeControl key={`time`} lightObj = {lightObj} isActive = {isActive}/>
        </div>
        </>
    );
}

function TimeControl({lightObj,isActive}:{lightObj:light_autorule,isActive:boolean}) {
    const [isActiveTime, setIsActiveTime] = useState(lightObj["time_rule"] != undefined ? true : false);
    const [from, setFrom] = useState(lightObj["time_rule"] == undefined ? "07:00" : String(new Date(lightObj["time_rule"]["start_time"]).toTimeString().slice(0, 5)));
    const [to, setTo] = useState(lightObj["time_rule"] == undefined ? "11:00" : String(new Date(lightObj["time_rule"]["end_time"]).toTimeString().slice(0, 5)));
    const [frequency,setFrequency] = useState("tần suất")
    const freqs =["hàng ngày","1 lần","2 lần","3 lần","4 lần"]
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const deleteTimeFrame = async () => {
            await autoruleService.deleteTimeFrame( 2);
        }
        const createTimeFrame = async () => {
            const timeFrame = {
                deviece_id:  2,
                start_time: from,
                end_time: to,
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
            // setFrom("07:00");
            // setTo("11:00");
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
        try {
            await autoruleService.createTimeFrame(2, from, to, 1);
            alert("Lưu thời gian thành công");
        } catch (error) {
            console.error("Error saving time rule:", error);
        }
    }

   
    return(
        <div className = "flex flex-row gap-8 w-ful">
                <div className="flex flex-col w-full items-start gap-2 font-bold">
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
function Control({lightObj,isActive}:{lightObj:light_autorule,isActive:boolean}) {

    const [selectConfig, setSelectConfig] = useState(lightObj["lightsensor_rule"] == undefined ? "Mặc định" : lightObj["lightsensor_rule"]["mode"])
    const [selectLevel, setSelectLevel] = useState(lightObj["lightsensor_rule"] == undefined ? 3 : lightObj["lightsensor_rule"]["level"])
    const [selectColor, setSelectColor] = useState(lightObj["lightsensor_rule"] == undefined ? "Trắng" : LIGHT_COLORS[lightObj["lightsensor_rule"]["color"]])

    const [light,setLight] = useState(lightObj["lightsensor_rule"] == undefined ? 40 : lightObj["lightsensor_rule"]["light_intensity"])
    const [isOpen,setIsOpen] = useState(isActive && lightObj["lightsensor_rule"] ? true : false)
    

    const configs = ["Mặc định", "Tùy chỉnh"]
    const lightLevels = [1,2,3,4]

    const isFirstRender = useRef(true);
    useEffect( () => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const createLightSensor = async (selectConfig:any) => {
            try {
                await autoruleService.createLightSensor(2, selectConfig, light, LIGHT_COLOR_KEYS[selectColor], selectLevel); //DEVICE ID
            } catch (error) {
                console.error("Error saving light sensor rule:", error);
            }
        }
        const deleteLightSensor = async () => {
            try {
                setIsOpen(false);
                await autoruleService.deleteLightSensor(2); //DEVICE ID
            } catch (error) {
                console.error("Error deleting light sensor rule:", error);
            }
        }
        if(!isActive || !isOpen){
            deleteLightSensor()
        }
        if(isActive && isOpen){
            createLightSensor(selectConfig)
        }
    }, [isActive,isOpen,selectConfig]);
    
    const handleChangeColor = async(value:any) => {
        try {
            await autoruleService.createLightSensor(2, selectConfig, light, LIGHT_COLOR_KEYS[value], selectLevel); //DEVICE ID
        } catch (error) {
            console.error("Error saving light sensor rule:", error);
        }
    }

    const handleSubmit = async () => { 
        try {
            await autoruleService.createLightSensor(2, selectConfig, light, LIGHT_COLOR_KEYS[selectColor], selectLevel); //DEVICE ID
            alert("Lưu cài đặt thành công");
        } catch (error) {
            console.error("Error saving light sensor rule:", error);
        }
    }

    return (
      <>
            <div className = "flex flex-row gap-8 w-ful">
                <div className = {`flex flex-col justify-around w-full font-bold gap-2 `}>
                    <div className = {`flex flex-row justify-between w-full font-bold gap-4 ${isOpen ? "cursor-pointer":"opacity-60 pointer-events-none"}`}>
                        <span className={`flex flex-2/3 items-center `}>Điều khiển theo cường độ ánh sáng</span>
                        <DropDown isOpen = {isOpen} selectValue={selectConfig} setSelectValue={setSelectConfig} 
                            values={configs} size ="flex-1/3"/>
                    </div>
                    <div className ={`flex flex-row justify-between w-full font-bold text-sm gap-4 z-50 ${isOpen ? "cursor-pointer":"opacity-60 pointer-events-none"}`}>
                    {!(selectConfig ==="Tùy chỉnh") ? (    
                                        <>
                                            <div className="flex flex-2/3 items-center text-gray-800 hover:text-red-900">
                                                <Info  className="w-5 h-5" />
                                                <span className="ml-2">Tùy vào cường độ ánh sáng, đèn sẽ tự động điều chỉnh theo từng mức độ.</span>
                                            </div>
                                            <DropDown isOpen = {isOpen} selectValue={selectColor}
                                             setSelectValue={setSelectColor} values={Object.values(LIGHT_COLORS)}
                                            handleClick={handleChangeColor}
                                             size="flex-1/3"/>
                                        </>
                                    ) 
                                : (
                                <>
                                    <label htmlFor="Temp-input" className={`flex  text-sm ${isOpen && (selectConfig ==="Tùy chỉnh") ?"":"opacity-40"}`}>
                                        <span className="font-bold">Cường độ ánh sáng:</span>
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
                                        <DropDown isOpen = {isOpen} selectValue={selectColor} setSelectValue={setSelectColor} values={Object.values(LIGHT_COLORS)}/>
                                    </div>
                                    <div className="flex flex-2 flex-row  ">
                                        <span className={`w-fit `}>Mức đèn: </span>
                                        <DropDown isOpen = {isOpen} selectValue={selectLevel} setSelectValue={setSelectLevel} values={lightLevels}/>
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
                {selectConfig ==="Tùy chỉnh" ? (<button className={`w-fit text-sm font-bold text-black bg-[#E2E8F1] rounded-[5px] px-2 py-1 cursor-pointer hover:opacity-50
                                        ${isOpen && (selectConfig ==="Tùy chỉnh") ? "opacity-100 ":"opacity-40 pointer-events-none"}`}
                                            onClick = {handleSubmit}>
                                            Lưu
                </button>) : <div></div>} 
                
                </div>
            </div> 
      </>    
    )
}

function DropDown({isOpen,selectValue,setSelectValue,values,size,handleClick}
                :{isOpen:boolean,
                selectValue:any,
                setSelectValue:(selectValue:any)=>void,
                values:any[],
                size?:string,
                handleClick?:(param:any)=>void
                }) {
    const [dropDown, setDropDown] = useState(false)
    return(
                    <div className={`relative flex ${size ||"flex-1/2"} items-center rounded-[5px] pl-2 text-sm border-1 border-[#000000]  
                                 ${isOpen ? "cursor-pointer hover:bg-gray-100":"pointer-events-none opacity-40"}`}
                        onClick={() => setDropDown(!dropDown)}
                        >
                        <span>{typeof(selectValue) === "string" ? selectValue : `${selectValue}`}</span>
                        <ChevronDown size={20} 
                                    className={`absolute right-1 transition-transform 
                                                ${dropDown && isOpen ? "rotate-180" : ""}`} />

                        {/* DROPDOWN */}
                        <div className={`absolute left-0 top-full  mt-1 w-full bg-white rounded-md border z-[100]
                            overflow-hidden transition-all duration-300 ${
                                dropDown && isOpen ? " opacity-100" : "max-h-0 opacity-0"
                            }`}>
                            <ul className="py-1">
                            {values.map((value) => (
                                <li
                                key={value}
                                className="px-4 py-2  hover:bg-gray-100 cursor-pointer"
                                onClick={()=>{
                                    setSelectValue(value);
                                    setDropDown(false);
                                    handleClick && handleClick(value);
                                } }
                                >
                                <span>{typeof(value) === "string" ? value : `${value}`}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
    );
}


export default LightSetting;