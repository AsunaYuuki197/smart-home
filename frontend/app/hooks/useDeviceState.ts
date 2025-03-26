import { useState, useEffect, useCallback, useRef } from "react";
import { deviceService } from "../services/deviceService";

// Custom hook for device state
export function  useDeviceState(name: string,id_user:number,id_device:number) {
    const deviceType = name === "Quạt" ? 'fan' : 'light';
    const [selectedRoom, setSelectedRoom] = useState("Tất cả");
    const [isOn, setIsOn] = useState<boolean>(true)
    
    useEffect(() => {
      async function fetchDeviceStatus() {
        try {
          const { action } = await deviceService.getDeviceStatus(id_user, id_device);
          setIsOn(action ? true : false);
        } catch (error) {
          console.error(error);
        }
      }
      const storedAction = sessionStorage.getItem(`action_${id_user}_${id_device}`);
      if (storedAction !== null) {
        setIsOn(JSON.parse(storedAction))
      }
      // Chỉ gọi API nếu chưa có dữ liệu trong sessionStorage
      if (storedAction === null) {
        fetchDeviceStatus();
      }
    }, [id_user, id_device]);
  
  
    const toggleDeviceState = useCallback(() => {
  
      setTimeout(() => {
        setIsOn(prev => {
          const newState = !prev;
          sessionStorage.setItem(`action_${id_user}_${id_device}`, JSON.stringify(newState));
          return newState;
        });
      }, 300);
    }, [deviceType]);
    
  
    const initialMount = useRef(true);
  
    useEffect(() => {
      if (initialMount.current) {
        initialMount.current = false;
        return; // Bỏ qua việc gọi API toggleDevice trong lần render đầu tiên (reload)
      }
      let isMounted = true; // Kiểm tra component có bị unmount không
    
      const toggleDevice = async () => {
        try {
          await deviceService.toggleDevice(deviceType, isOn, id_user);
        } catch (error: any) {
          console.error(error.message);
          if (isMounted) {
            alert("Lỗi khi kết nối với thiết bị hoặc tại bản chuyển trang nhanh quá :). Vui lòng thử lại sau. toggleDevice " + deviceType);
          }
        }
      };
    
      toggleDevice();
    
      return () => {
        isMounted = false; // Cleanup khi unmount
      };
    }, [isOn]); 
    
    return { isOn, setIsOn, selectedRoom, setSelectedRoom, toggleDeviceState, id_user};
  }
  