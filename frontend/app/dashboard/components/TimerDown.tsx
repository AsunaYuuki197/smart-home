"use client"

import { useState, useEffect } from "react"
import { autoruleService } from "@/app/services/autoruleService"
import { Pause } from "lucide-react"


export default function Timer({isPaused, setIsPaused,seconds,setSeconds}: 
  {isPaused:boolean, setIsPaused(isPause:boolean):void,seconds:number,setSeconds: React.Dispatch<React.SetStateAction<number>> }) {


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (!isPaused && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1)
      }, 1000)
    }
    // else if (seconds <=0) {
    //   const turnOff = async () => {
    //     setIsPaused(true)
    //     await autoruleService.saveCoundown("off", 15)
    //   }
    //   turnOff()
    // }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPaused,seconds])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const timeDisplay = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`

  const handleClick = () => {
    const newState = !isPaused
    setIsPaused(newState)
    const status = newState?"off":"on";
    autoruleService.saveCoundown(status,seconds <= 0 ? 15:seconds)
  }
  return (
    <div className="bg-red-100 rounded-xl p-4 flex flex-col items-center justify-between h-full border-2 border-red-500">
      <div className="text-center text-red-600">
        <p>Trạng thái tự động sẽ</p>
        <p>tiếp tục sau:</p>
      </div>

      <button
        onClick={()=>setIsPaused(!isPaused)}
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

