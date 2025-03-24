"use client"

import React, { useEffect, useState, useCallback ,useRef} from 'react';

// Component chính
export default function DateTimeWeather() {
  const { date, time } = useDateTime();
  const { temperature, isLoading, error } = useTemperature();

  // Gradient background styles
  const backgroundStyle = {
    background: 'linear-gradient(226.54deg, rgba(234, 50, 50, 0) 3.33%, rgba(234, 50, 50, 0.380622) 67.29%, rgba(234, 50, 50, 0.4) 73.26%), rgba(97, 122, 215, 0.51)',
    backgroundBlendMode: 'multiply, normal'
  };

  return (
    <div 
      className="rounded-xl p-4 text-white flex flex-col justify-between h-full"
      style={backgroundStyle}
    >
      <div className="text-left">
        <div className="text-xl">{date}</div>
        <div className="text-4xl font-bold">{time}</div>
      </div>
      
      <WeatherIcon />
      
      <div className="flex items-center justify-between mt-8">
        <div className="text-2xl font-bold">Hồ Chí Minh</div>
        
        {isLoading ? (
          <div className="text-lg">Đang tải...</div>
        ) : error ? (
          <div className="text-sm text-red-300">Lỗi: không thể lấy nhiệt độ</div>
        ) : (
          <TemperatureDisplay temperature={temperature} />
        )}
      </div>
    </div>
  );
}


// Service cho việc gọi API
const weatherService = {
  getTemperature: async (userId: string | number) => {
    try {
      const response = await fetch(`/api/device/temp_sensor?user_id=${userId}`);
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu nhiệt độ!");
      const data = await response.json();
      sessionStorage.setItem("temp_realtime", JSON.stringify(data['0']['value']));
      return data['0']['value'];
    } catch (error: any) {
      console.error("Lỗi khi lấy dữ liệu nhiệt độ:", error.message);
      throw error;
    }
  }
};

// Custom hook để quản lý thời gian
function useDateTime() {
  const [dateTime, setDateTime] = useState({
    date: "",
    time: ""
  });

  const updateDateTime = useCallback(() => {
    const now = new Date();
    setDateTime({
      date: now.toLocaleDateString("vi-VN", { month: "short", day: "2-digit" }),
      time: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: true })
    });
  }, []);

  useEffect(() => {
    updateDateTime(); // Cập nhật ngay lần đầu
    
    // Cập nhật thời gian mỗi phút thay vì mỗi ngày để đồng hồ chính xác hơn
    const interval = setInterval(updateDateTime, 60000); 
    
    return () => clearInterval(interval);
  }, [updateDateTime]);

  return dateTime;
}

// Custom hook để quản lý nhiệt độ
function useTemperature() {
  const [temperature, setTemperature] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const savedTemp = sessionStorage.getItem("temp_realtime");
    if (savedTemp) {
      setTemperature(JSON.parse(savedTemp));
    }
  }, []);

  useEffect(() => {
    const getUserId = () => {
      try {
        return parseInt(localStorage.getItem("user_id")|| "1") ;
      } catch (e) {
        // Xử lý trường hợp localStorage không khả dụng (ví dụ: trong SSR)
        console.warn("Không thể truy cập localStorage, sử dụng user_id mặc định");
        return 1;
      }
    };

    const fetchTemperature = async () => {
      setIsLoading(true);
      try {
        const userId = getUserId();
        const temp = await weatherService.getTemperature(userId);
        setTemperature(temp);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error("Lỗi khi lấy nhiệt độ:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if(!temperature){ // nếu không có dữ liệu thì fetch -> fetch lần đầu tiên
        fetchTemperature();
    }
    
    // Cập nhật nhiệt độ mỗi 15 giây
    intervalRef.current = setInterval(fetchTemperature, 15000);

    // Cleanup khi component unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { temperature, isLoading, error };
}

// Thành phần giao diện
const WeatherIcon = () => (
  <div className="flex justify-center items-center">
    <img src="/OIP.png" className="w-30 h-30" alt="Biểu tượng thời tiết" />
  </div>
);

const TemperatureDisplay = ({ temperature }: { temperature: any }) => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
      <div className="w-5 h-5 bg-yellow-300 rounded-full" />
    </div>
    <div className="text-3xl font-bold">{temperature}°C</div>
  </div>
);

