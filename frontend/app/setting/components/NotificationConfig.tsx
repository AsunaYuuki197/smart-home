"use client";
import {useState, useEffect} from "react";
import ActiveControl from "./ActiveControl";
import { ChevronDown } from "lucide-react";
import {autoruleService} from "@/app/services/autoruleService";
import { notify_autorule } from "@/app/models/notify_autorule"; 

function NotificationConfig({notifyObj}:{notifyObj:notify_autorule}) {
    console.log("NOTIFY OBJ",notifyObj);
    const status = notifyObj["status"] == "on" ? true : false;
    const hot_notify = notifyObj["hot_notif"] == "on" ? true : false;
    const platform = notifyObj["platform"]
    const temp= notifyObj["temp"]

    const [isActive, setIsActive] = useState(status);
    const handleActiveChange = async () => {
        const newStatus = isActive ? "off" : "on";
        setIsActive(!isActive);
        await autoruleService.postNotify(newStatus, "Website");
    }
    return (
        <>
        <span className = "font-bold text-3xl ml-10 "> Thông báo </span>
        <div className = "flex-1/5 flex items-center justify-between bg-white rounded-4xl pl-10 pr-10">
            <ActiveControl name = "Notyfi" title = "Cho phép thông báo" status={isActive} setStatus = {setIsActive} />
        </div>
        <div className = {`flex-4/5 flex flex-col justify-around bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10
                            ${isActive ? "opacity-80" : "opacity-40 pointer-events-none" } `}>
            <DeviceNotification key={`device-notify`} isActive = {isActive} platform={platform}/> {/* Nhận thông báo qua ? */}
            <span className=" border-1 border-gray-600 w-full"></span>
            <HotNotification key={`hot-notify`} isActive = {isActive} hot_notify={hot_notify} temp = {temp}/> {/* THÔNG BÁO NÓNG */}
        </div>
        </>
    );
}

function DeviceNotification({isActive,platform}:{isActive:boolean,platform:string}) {
    const [deviceNotify, setDeviceNotify] = useState(platform || "Tất cả")
    const [isOpen,setIsOpen ] = useState(false)
    const devices = ["Website", "Telegram", "Tất cả"]
    return (
      <>
        <div className = "Nhan_thong_bao flex justify-between w-full font-bold  ">
            <span className="flex flex-1/2 items-center ">Nhận thông báo qua </span>
            <div className=" relative flex flex-1/2 items-center rounded-[5px] border-1  
                            border-[#000000]  cursor-pointer hover:bg-gray-100 overflow-visible"
                onClick={() => setIsOpen(!isOpen)}
                >
                <span className="flex items-center pl-3 text-sm ">{deviceNotify}</span>
                <ChevronDown size={20} className={`absolute right-1 transition-transform ${isOpen && isActive ? "rotate-180" : ""}`} 
                            />
                
                {/* DROPDOWN */}
                <div className={`absolute left-0 top-full text-sm  mt-1 w-full bg-white rounded-md border z-[50]
                      overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}>
                    <ul className="py-1">
                    {devices.map((device) => (
                        <li
                        key={device}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            console.log(device);
                            setDeviceNotify(device);
                            setIsOpen(false);
                        }}
                        >
                        {device}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>        
      </>    
    )
}

function HotNotification({isActive,hot_notify,temp}:{isActive:boolean,hot_notify:boolean,temp:number}) {
    const [hotNotify, setHotNotify] = useState("Mặc định")
    const [isHotNotify, setIsHotNotify] = useState(false)   
    const [isOpen,setIsOpen] = useState(hot_notify || false)
    const [temperature, setTemperature] = useState(temp || 25)

    const configs = ["Mặc định", "Tùy chỉnh"]

    const handleHotNotifyChange = () => {
        console.log("LUUWUW THONG BAO NONG");
    }
    return (
      <>
            <div className = "flex justify-between w-full font-bold ">
                <span className={`flex items-center ${isOpen ? "cursor-pointer":"opacity-40"}`}>
                        Thông báo nóng
                </span>

                <div className={`relative flex w-40 items-center rounded-[5px] pl-3 text-sm border-1  border-[#000000] 
                                 ${isOpen ? "cursor-pointer hover:bg-gray-100":"pointer-events-none opacity-40"}`}
                        onClick={() => setIsHotNotify(!isHotNotify)}
                        >
                        {hotNotify}
                    <ChevronDown size={20} 
                                    className={`absolute right-1 transition-transform 
                                                ${isHotNotify && isActive ? "rotate-180" : ""}`} />
                        {/* DROPDOWN */}
                        
                    <div className={`absolute left-0 top-full  mt-1 w-full bg-white rounded-md border z-[50]
                            overflow-hidden transition-all duration-300 ${
                                isHotNotify ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            }`}>
                        <ul className="py-1">
                            {configs.map((config) => (
                            <li
                                key={config}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setHotNotify(config);
                                    setIsHotNotify(false);
                                }}
                                >
                                {config}
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <label className="relative thong_bao_nong  inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isOpen} onChange={()=>setIsOpen(!isOpen)}  />
                    <div className="w-11 h-6 bg-gray-200
                                    rounded-full peer peer-checked:bg-teal-600 
                                    peer-checked:after:translate-x-full 
                                    after:content-[''] after:absolute 
                                    after:top-0.5 after:left-[2px]
                                    after:bg-white after:border-gray-300
                                    after:border after:rounded-full after:h-5 after:w-5 after:transition-all">

                    </div>
                </label>
            </div>
            {isOpen && (hotNotify ==="Tùy chỉnh")?(<div className = {` flex justify-between w-full font-bold }`}>
                <label htmlFor="Temp-input" className={`flex gap-2 `}>
                    <span className="font-bold">Nhiệt độ:</span>
                    <input type="number" 
                            className="appearance-none w-[45px] rounded-[5px] border-1 pl-2 border-[#000000]" 
                            min = {0}
                            max = {50}
                            value = {isNaN(temperature) ? 0 : temperature}
                            onChange = {(e) => setTemperature(parseInt(e.target.value))}
                            disabled={!isOpen}
                            />
                    <span className=" font-bold"> °C</span>
                </label>
                <button className="bg-[#E2E8F1] text-black rounded-[10px] px-2 py-1 font-bold cursor-pointer hover:opacity-50"
                        onClick={handleHotNotifyChange}
                        >
                    Lưu
                </button>
            </div>):<div></div>} 
            
            
        
      </>    
    )
}


export default NotificationConfig;