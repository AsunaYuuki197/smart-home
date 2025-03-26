import { useState, useEffect, useCallback,useRef } from "react";
import { deviceService } from "../services/deviceService";

export function useDeviceControl({
  user_ID,
  speedDevice,
  color,
  name,
  deviceID,
}: {
  user_ID: number;
  speedDevice?: number;
  color?: string;
  name?: string;
  deviceID: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Chọn màu đèn
  const [speed, setSpeed] = useState<number>(speedDevice || (name === "Quạt" ? 100 : 4));
  const [selectLightColor, setSelectLightColor] = useState<string>(color || "");

  const deviceType = name === "Quạt" ? "fan" : "light";
  const endpoint = name === "Quạt" ? "speed" : "level";

   
  const initialMount = useRef(true); // chặn không cho post khi load trang
  const initialMountSpeed = useRef(true);

// lấy dữ liệu khi load trang
  useEffect(() => {
    async function fetchDeviceStatus() {
      try {
        const { level,color } = await deviceService.getDeviceStatus(user_ID, deviceID);
        setSelectLightColor(color)
        setSpeed(level)
      } catch (error) {
        console.error(error);
      }
    }
    async function getData(){
      
    }
    const storedLevel = sessionStorage.getItem(`level_${user_ID}_${deviceID}`);
    const storedColor = sessionStorage.getItem(`color_${user_ID}_${deviceID}`);

    if (storedLevel !== null && storedColor !== null) {
      setSpeed(JSON.parse(storedLevel))
      setSelectLightColor(JSON.parse(storedColor))
      console.log("GỌI LCAL STORGE", storedLevel,storedLevel )
    }
    // Chỉ gọi API nếu chưa có dữ liệu trong sessionStorage
    if (!storedLevel || ! storedColor ) {
      fetchDeviceStatus();
      console.log("GỌI fetch", storedLevel,storedLevel )

    }
  }, [user_ID, deviceID]);
  

  const handleSelectLightColor = useCallback((lightColor: string) => {
    setSelectLightColor(lightColor);
    setIsOpen(false);
    sessionStorage.setItem(`color_${user_ID}_${deviceID}`, JSON.stringify(lightColor));
  }, []);

  const handleChangeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    sessionStorage.setItem(`level_${user_ID}_${deviceID}`, JSON.stringify(newSpeed));
  }, [user_ID, deviceID]);

  
  // Gửi API khi thay đổi màu đèn
  useEffect(() => {
    if (initialMount.current) {
        initialMount.current = false;
        return; 
      }

    const changeLightColor = async () => {
      try {
        await deviceService.setLightColor(selectLightColor, speed, user_ID);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    changeLightColor();
  }, [selectLightColor]);

  // Gửi API khi thay đổi tốc độ / mức độ
  useEffect(() => {
    if (initialMountSpeed.current) {
        initialMountSpeed.current = false;
        return; // Bỏ qua việc gọi API toggleDevice trong lần render đầu tiên (reload)
      }
    const timeout = setTimeout(async () => {
      try {
        await deviceService.setDeviceLevel(deviceType, endpoint, speed, user_ID, deviceID);
      } catch (error: any) {
        console.error(error.message);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [speed,user_ID]);

  return {
    isOpen,
    setIsOpen,
    speed,
    setSpeed,
    selectLightColor,
    setSelectLightColor,
    handleSelectLightColor,
    handleChangeSpeed,
  };
}
