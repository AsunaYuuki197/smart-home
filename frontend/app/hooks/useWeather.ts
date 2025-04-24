import { useEffect, useRef, useState } from "react";
import {weatherService} from "@/app/services/weatherService";

  
  // Custom hook để quản lý nhiệt độ
  export function useWeather() {
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  
    useEffect(() => {
  
      const fetchWeather = async () => {
        setIsLoading(true);
        try {
          // const userId = 1;
          const weather = await weatherService.getWeather();
  
          setTemperature(weather['temperature']);
          setHumidity(weather['humidity']);
  
          setError(null);
        } catch (err: any) {
          setError(err.message);
          console.error("Lỗi khi lấy nhiệt độ & độ ẩm:", err);
        } finally {
          setIsLoading(false);
        }
      };
      if(!temperature){ // nếu không có dữ liệu thì fetch -> fetch lần đầu tiên
          fetchWeather();
      }
      
      // Cập nhật nhiệt độ mỗi 15 giây
      intervalRef.current = setInterval(fetchWeather, 15000);
  
      // Cleanup khi component unmount
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, []);
  
    return { temperature, humidity, isLoading, error };
  }
  