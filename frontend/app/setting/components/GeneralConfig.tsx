"use client";
import {useState, useEffect} from "react";
import ActiveControl from "./ActiveControl";

function GeneralConfig() {
  return (
    <>
    <span className = "font-bold text-3xl ml-10 "> Cấu hình chung </span>
    <div className = "flex-2/5 flex flex-col justify-around bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10 ">
        <CountDown/>
    </div>
    <div className = "flex-3/5 flex flex-col justify-around bg-white rounded-4xl pt-2 pb-2 pl-10 pr-10">
        <ConfigAI/>
    </div>
    </>
  );
}
function ConfigAI() {
    const [isActive, setIsActive] = useState(false);
    const [currentCommand, setCurrentCommand] = useState(""); //call API lấy lệnh hiện tại trả về
    function handleClick(){
        //call API cập nhật lệnh hiện tại
        //updateCommand(currentCommand);
        console.log("Cập nhật lệnh hiện tại: " + currentCommand);
        alert("Cập nhập thành công " + currentCommand)
    }
    return(
        <>
            <div className = "flex items-center justify-between w-full">
                <ActiveControl key={isActive.toString()} name = "Settting" title = "Yêu cầu lệnh đánh thức" status={isActive} setStatus = {setIsActive} />
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
                onClick ={handleClick}
                disabled={!isActive}
                >
                    <span>Sửa</span>
                </button>
                <button className={`w-[52px] h-[35px] rounded-[10px] font-bold text-black bg-[#E2E8F1] hover:opacity-50 cursor-pointer `}
                onClick ={()=>setCurrentCommand("")}
                disabled={!isActive}
                >
                    <span>Xóa</span>
                </button>
            </div>
        </>
    )
}

function CountDown() {
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); //call API lấy thời gian tự động trả về

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        
        if (timeLeft > 0  && isRunning ) {
          interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
          }, 1000)
        }
        else if(timeLeft < 0){
            //TODO: Call API thông báo trả về trạng thái tự động
            setIsRunning(false);
            setTimeLeft(0);
        }
        return () => {
          if (interval) clearInterval(interval)
        }
      }, [isRunning,timeLeft])
    
    const handleChangeTime = (e: string) => {
        setTimeLeft(Number(e.split(":")[0])*3600 + Number(e.split(":")[1])*60);
        //call API POST cập nhật thời gian tự động
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
                <ActiveControl key={isRunning.toString()} name = "Settting" title = "Tự trở về trạng thái tự động" status={isRunning} setStatus = {setIsRunning} />
            </div>
            <div className = {`flex items-center justify-between w-full font-bold
                            ${isRunning?"":"opacity-50"}`}>
                <span className=" text-sm">Trở về trạng thái tự động sau</span>
                <input  
                type="time"
                min="00:00:00"
                max="00:59:00" 
                className=" [&::-webkit-calendar-picker-indicator]:hidden"
                onChange={(e) => {handleChangeTime(e.target.value)}}
                disabled={!isRunning}
                />
            </div>
            <span className={`font-mono ml-auto text-black ${isRunning?"":"opacity-50"}`}>
                  {formatTime(timeLeft)}
            </span>
                {/* <button onClick={()=>{setTimeLeft(900); setisRunning(isRunning)}} className="rounded cursor-pointer">
                <RotateCw size={24} className="text-gray-600" />
                </button> */}
        </>
    )
}

export default GeneralConfig;