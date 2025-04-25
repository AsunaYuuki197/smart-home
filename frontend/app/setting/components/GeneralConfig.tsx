"use client";
import {useState, useEffect} from "react";
import ActiveControl from "./ActiveControl";
import { autoruleService } from "@/app/services/autoruleService";

function GeneralConfig({isCountDown,time,isWakeup,text,remaining_time}:
    {isCountDown:boolean,time:number,isWakeup:boolean,text:string,remaining_time:any}) {
    return (
    <>
    <span className = "font-bold text-3xl ml-10 "> Cấu hình chung </span>
    <div className = "flex-2/5 flex flex-col justify-around bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10 ">
        <CountDown isCountDown ={isCountDown} time = {time} remaining_time = {remaining_time}/>
    </div>
    <div className = "flex-3/5 flex flex-col justify-around bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10">
        <ConfigAI status = {isWakeup} text = {text} />
    </div>
    </>
  );
}
function ConfigAI({status,text,}:{status:boolean,text:string}) {
    const [isActive, setIsActive] = useState(status);
    const [currentCommand, setCurrentCommand] = useState(text || ""); //call API lấy lệnh hiện tại trả về
    const handleChange = () => {   
        const newState = !isActive
        setIsActive(newState);
        const status = newState?"on":"off";
        autoruleService.saveWakeword(status,currentCommand)
    }
    function handleSubmit(){
        const status = isActive?"on":"off";
        autoruleService.saveWakeword(status,currentCommand)
        .then((response) => {
            alert("Lưu lệnh thành công");
        })
    }
    function handleRemove(){
        const status = isActive?"on":"off";
        setCurrentCommand("");
        autoruleService.saveWakeword(status,currentCommand)
    }
    return(
        <>
            <div className = "flex items-center justify-between w-full">
                <ActiveControl key={isActive.toString()} name = "Settting" title = "Yêu cầu lệnh đánh thức"
                 status={isActive} setStatus = {setIsActive}
                 handleChange={handleChange}/>
            </div>
            <label className={`flex items-center justify-between w-full font-normal 
                            ${isActive?"opacity-90":"opacity-40"}`}>
                <span className="font-bold">Lệnh Hiện Tại: </span>
                <input type="text" 
                className={`AI-input pl-4 w-[250px] h-[35px] rounded-[10px] border-2 border-black`}
                value={currentCommand}
                onChange={(e) => {setCurrentCommand(e.target.value)}}
                disabled={!isActive}
                />
            </label>
            <div className={`flex justify-around w-full ${isActive?"opacity-90":"opacity-40 pointer-events-none"}`}>
                <button className={`w-[52px] h-[35px] rounded-[10px] font-bold text-black bg-[#E2E8F1] hover:opacity-50 cursor-pointer `}
                onClick ={handleSubmit}
                disabled={!isActive}
                >
                    <span>Sửa</span>
                </button>
                <button className={`w-[52px] h-[35px] rounded-[10px] font-bold text-black bg-[#E2E8F1] hover:opacity-50 cursor-pointer `}
                onClick ={handleRemove}
                disabled={!isActive}
                >
                    <span>Xóa</span>
                </button>
            </div>
        </>
    )
}

function CountDown({isCountDown,time,remaining_time}:{isCountDown:boolean,time:number,remaining_time:number}) {
    const [isRunning, setIsRunning] = useState(isCountDown);
    const [timeConfig, setTimeConfig] = useState(remaining_time < 0 ? time: remaining_time); //call API lấy thời gian tự động trả về
    const [timeLeft, setTimeLeft] = useState<number>(remaining_time < 0 ? 0: remaining_time); 
    console.log("Time left:", timeLeft);
    console.log("remaintime:", remaining_time);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (timeLeft > 0  && isRunning ) {
          interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
                sessionStorage.setItem("timeLeft", String(timeLeft));
                sessionStorage.setItem("isRunning", String(isRunning? "on":"off"));
            }, 1000)

        }
        // else if(timeLeft <= 0){
        //     //TODO: Call API thông báo trả về trạng thái tự động
        //     const turnOff = async () => {
        //         await autoruleService.saveCoundown("off",15)
        //         setIsRunning(false);
        //     }
        //     turnOff();
        // }
        return () => {
          if (interval) clearInterval(interval)
        }
      }, [isRunning,timeLeft])

      const handleChange = async () => {
          const newState = !isRunning
          setIsRunning(newState);
          const status = newState?"on":"off";
          await autoruleService.saveCoundown(status,timeLeft < 0 ? 15:timeLeft)
        }
        const handleChangeTime = (e: string) => {
            setTimeConfig(Number(e.split(":")[0])*3600 + Number(e.split(":")[1])*60 + Number(e.split(":")[2]));
            //call API POST cập nhật thời gian tự động
        }
        const handleSaveTime = async () => {
            const status = isRunning?"on":"off";
            await autoruleService.saveCoundown(status,timeConfig)
            setTimeLeft(timeConfig);
            alert("Lưu thời gian thành công");
        }
        const formatTime = (seconds: number) => {
            const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
            const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
            const ss = String(seconds % 60).padStart(2, "0");
        return `${hh}:${mm}:${ss}`; 
        };

    return(
        <>
            <div className = "flex items-center justify-between w-full">
                <ActiveControl key={isRunning.toString()} name = "Settting"
                 title = "Tự trở về trạng thái tự động" status={isRunning} setStatus = {setIsRunning} 
                 handleChange = {handleChange}/>
            </div>
            <div className = {`flex items-center justify-between w-full font-bold
                            `}>
                <span className=" text-sm">Trở về trạng thái tự động sau</span>
                <input
                type="time"
                step="1" // Cho phép nhập giây
                min="00:00:01"
                max="00:59:59"
                className="w-24 [&::-webkit-datetime-edit-hour-field]:hidden [&::-webkit-datetime-edit-hour-field]:w-0 [&::-webkit-calendar-picker-indicator]:hidden"
                onChange={(e) => handleChangeTime(e.target.value)}
                />
            </div>
            <div className = {`flex justify-between w-full`}>
            <button onClick={handleSaveTime}
                 className={`w-[52px] h-[35px] rounded-[10px] font-bold text-black bg-[#E2E8F1] hover:opacity-50 cursor-pointer`}
                 >
                    <span>Lưu</span>
            </button>
            <span className={`font-medium ml-auto text-black ${isRunning?"":"opacity-50"}`}>
                  {formatTime(timeLeft)}
            </span>
            </div>
        </>
    )
}

export default GeneralConfig;