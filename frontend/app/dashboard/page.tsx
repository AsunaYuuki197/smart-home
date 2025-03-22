"use client"

import { useState, useEffect } from "react"
import UserGreeting from "./components/UserGreeting"
import StatusMessage from "./components/StatusMessage"
import DateTimeWeather from "./components/DateTimeWeather"
import Control from "./components/Control_Light_Fan"
import StatsBar from "./components/StatsBar"
import Timer from "./components/TimerDown"

export default function Dashboard() {
  const [lightsOn, setLightsOn] = useState(true)
  const [fanOn, setFanOn] = useState(true)
  // Khởi tạo ngày theo định dạng "vi-VN"
  const [formattedDate, setFormattedDate] = useState(new Date().toLocaleDateString("vi-VN"))

  // Cập nhật lại ngày mỗi 60 giây
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFormattedDate(new Date().toLocaleDateString("vi-VN"))
    }, 60000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-8 h-full">
      {/* Row trên: dành cho desktop sẽ hiển thị 3 cột theo grid 12 cột */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Cột trái: UserGreeting và StatusMessage */}
        <div className="md:col-span-3 grid grid-rows-3 gap-4">
          <div className="row-span-1">
            <UserGreeting />
          </div>
          <div className="row-span-2">
            <StatusMessage />
          </div>
        </div>
        {/* Cột giữa: DateTimeWeather */}
        <div className="md:col-span-3">
          <DateTimeWeather />
        </div>
        {/* Cột phải: FanStats (Quạt) */}
        <div className="md:col-span-6">
          <StatsBar title="Quạt" date={formattedDate} color="teal" />
        </div>
      </div>

      {/* Row dưới */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Cột trái: LightControl và FanControl */}
        <div className="md:col-span-4 grid gap-4">
          <Control name={'Đèn'} />
          <Control name={'Quạt'}  />
        </div>
        {/* Cột giữa: Timer */}
        <div className="md:col-span-2">
          <Timer />
        </div>
        {/* Cột phải: FanStats (Đèn) */}
        <div className="md:col-span-6">
          <StatsBar title="Đèn" date={formattedDate} color="pink" />
        </div>
      </div>
    </div>
  )
}
