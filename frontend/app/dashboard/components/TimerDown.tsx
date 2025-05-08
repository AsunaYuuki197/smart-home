"use client"

import { useState, useEffect,useRef } from "react"
import { autoruleService } from "@/app/services/autoruleService"

// import { Pause } from "lucide-react"


export default function Timer({lastChanged}:{lastChanged:number | null}) {
  const [isPaused, setIsPaused] = useState<boolean>(true)
  const [seconds, setSeconds] = useState<number>(0)
  const timeRef = useRef<number | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await autoruleService.getCoundown()
        const data = await response
        console.log("Data fetched:", data.countdown.status)
        setIsPaused(data.countdown.status != "on")
        timeRef.current = data.countdown.time
        const timeCountdown = Number.isNaN(Math.floor(data.countdown.remaining_time)) ? data.countdown.time : Math.floor(data.countdown.remaining_time)
        setSeconds(timeCountdown)
      } catch (error) {
        console.error("Error fetching countdown:", error);
      }
    };
    fetchData();
  }, [])


  useEffect(() => {
    if (lastChanged === null) return;
    // console.log("lastChanged", lastChanged)
    if(!isPaused) {
      setIsPaused(false)
      setSeconds(timeRef.current || 0)
    }
    },[lastChanged])

    useEffect(() => {
      if (isPaused) return;
    
      const interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 0) {
            // clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    
      return () => clearInterval(interval);
    }, [isPaused]);

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const timeDisplay = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
 
  const handleClick = () => {
    const newState = !isPaused
    setIsPaused(newState)
    const status = newState?"off":"on";
    autoruleService.saveCoundown(status,seconds <= 0 ? timeRef.current||15:seconds)
  }
  return (
    <div className="bg-red-100 rounded-xl p-4 flex flex-col items-center justify-between h-full border-2 border-red-500">
      <div className="text-center text-red-600">
        <p>Trạng thái tự động sẽ</p>
        <p>tiếp tục sau:</p>
      </div>

      <button
        onClick={handleClick}
        className="w-18 h-18 bg-white rounded-full border-3 border-red-600 flex items-center justify-center 
                  text-red-600 my-4 transition-transform transform hover:scale-110"
      >
        {!isPaused ? (
          <div className="w-8 h-8 flex items-center justify-center ">
            <div className="w-3 h-10 bg-red-600 mx-1"></div>
            <div className="w-3 h-10 bg-red-600 mx-1"></div>
          </div>
        ) : (
          <div className="w-0 h-0 border-l-30 border-l-red-600 border-t-20 border-t-transparent border-b-20 border-b-transparent ml-2.5">
          </div>
        )}
      </button>

      <div className="text-5xl font-bold text-red-600">{timeDisplay}</div>
    </div>
  )
}

