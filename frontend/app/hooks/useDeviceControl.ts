import { useState, useEffect, useCallback,useRef } from "react";
import { deviceService } from "../services/deviceService";
import { notificationsService } from "../services/notificationsService";

export function useDeviceControl({
  user_ID,
  name,
  deviceID,
  isLoading,
  speed,setSpeed,
  selectLightColor,setSelectLightColor,
}: {
  user_ID: number;
  name?: string;
  deviceID: number;
  isLoading: boolean;
  speed:number;setSpeed:(Active:React.SetStateAction<number>)=>void;
  selectLightColor:string;setSelectLightColor:(Active:React.SetStateAction<string>)=>void;
}) {

  const [isOpen, setIsOpen] = useState(false)

  const deviceType = name === "Quạt" ? "fan" : "light";
  const endpoint = name === "Quạt" ? "speed" : "level";
  const initialMount = useRef(true); // chặn không cho post khi load trang
  const initialMountSpeed = useRef(true);

  const handleSelectLightColor = useCallback((lightColor: string) => {
    setSelectLightColor(lightColor);
    setIsOpen(false);
    notificationsService.saveNotification(deviceID,`Thông báo: Thay đổi màu đèn:  ${lightColor} `)

  }, []);

  const handleChangeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    // sessionStorage.setItem(`level_${user_ID}_${deviceID}`, JSON.stringify(newSpeed));
  }, []);

  
  // Gửi API khi thay đổi màu đèn
  useEffect(() => {
    if (isLoading) return; //chưa lấy dữ liệu xong
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
    if (isLoading) return; //chưa lấy dữ liệu xong
    if (initialMountSpeed.current) {
        initialMountSpeed.current = false;
        return; 
      }
    const timeout = setTimeout(async () => {
      try {
        await deviceService.setDeviceLevel(deviceType, endpoint, speed,selectLightColor, user_ID, deviceID);
      } catch (error: any) {
        console.error(error.message);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [speed,user_ID]);

  return {
    isOpen, setIsOpen,
    handleSelectLightColor,
    handleChangeSpeed,
  };
}
