"use client"
import React, { useEffect, useState } from 'react';
export default function DateTimeWeather() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [temperature, setTemperature] = useState(20); //TODO: Call API lấy nhiệt độ từ cảm biến
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setDate(now.toLocaleDateString("vi-VN", { month: "short", day: "2-digit" }));
      setTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };

    updateDate(); // Gọi ngay lần đầu
    const interval = setInterval(updateDate, 86400000); // Cập nhật mỗi ngày

    return () => clearInterval(interval); 
  }, []);

  useEffect(()=>{
    const getTempe =async () => {
      const user_id = localStorage.getItem("user_id") || 1;
      try {
        const response = await fetch(`/api/device/temp_sensor?user_id=${user_id}`);
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu!");

        const data = await response.json();
        setTemperature(data['0']['value'])
      } catch (error: any) {
        console.error("Error fetching  status:", error.message);
      }
    };

    getTempe();
    const interval = setInterval(getTempe,15000) //15s lấy nhiệt độ mới
    return () =>clearInterval(interval)
  },[])

  return (
      <div 
          className="rounded-xl p-4 text-white flex flex-col justify-between h-full"
          style={{
            background: 'linear-gradient(226.54deg, rgba(234, 50, 50, 0) 3.33%, rgba(234, 50, 50, 0.380622) 67.29%, rgba(234, 50, 50, 0.4) 73.26%), rgba(97, 122, 215, 0.51)',
            backgroundBlendMode: 'multiply, normal'
          }}
        >
      <div className="text-left">
        <div className="text-xl">{date}</div>
        <div className="text-4xl font-bold">
           {time}
        </div>
      </div>
      <div className="flex justify-center items-center">
          <img src="./OIP.png" className=" w-30 h-30 " alt="Weather Icon" />
      </div>
      <div className="flex items-center justify-between mt-8">
      
          <div className="text-2xl font-bold">Hồ Chí Minh</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-yellow-300 rounded-full" />
            </div>
            <div className="text-3xl font-bold">{temperature}°C</div>
          </div>
        
      </div>
    </div>
  )
}


