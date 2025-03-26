import { useState, useEffect, useCallback,useRef } from "react";
import { deviceService } from "../services/deviceService";

export function useDeviceControl({
  user_ID,
  speedDevice,
  color,
  name,
  deviceID,
}: {
  user_ID?: number;
  speedDevice?: number;
  color?: string;
  name?: string;
  deviceID: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Chọn màu đèn
  const [speed, setSpeed] = useState<number>(speedDevice || (name === "Quạt" ? 100 : 4));
  const [selectLightColor, setSelectLightColor] = useState<string>(color || "");
  const [userId] = useState<number>(user_ID || 1);

  const deviceType = name === "Quạt" ? "fan" : "light";
  const endpoint = name === "Quạt" ? "speed" : "level";

   
  const initialMount = useRef(true);
  const initialMountSpeed = useRef(true);

  

  const handleSelectLightColor = useCallback((lightColor: string) => {
    setSelectLightColor(lightColor);
    setIsOpen(false);
  }, []);

  const handleChangeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  
  // Gửi API khi thay đổi màu đèn
  useEffect(() => {
    if (initialMount.current) {
        initialMount.current = false;
        return; // Bỏ qua việc gọi API toggleDevice trong lần render đầu tiên (reload)
      }
    if (!selectLightColor) return;

    const changeLightColor = async () => {
      try {
        await deviceService.setLightColor(selectLightColor, speed, userId);
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
        await deviceService.setDeviceLevel(deviceType, endpoint, speed, userId, deviceID);
      } catch (error: any) {
        console.error(error.message);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [speed]);

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
