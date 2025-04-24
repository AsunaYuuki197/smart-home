import { useState, useEffect, useCallback, useRef } from "react";
import { deviceService } from "../services/deviceService";
import { notificationsService } from "../services/notificationsService";
// Custom hook for device state
export function  useDeviceState(name: string,id_user:number,id_device:number,isLoading:boolean,color:string,level:number,
            isOn:boolean|null,setIsOn:(Active:React.SetStateAction<boolean|null>)=>void) {
    const deviceType = name === "Quạt" ? 'fan' : 'light';
    const [selectedRoom, setSelectedRoom] = useState("Tất cả");
    const initialMount = useRef(true);
    const toggleDeviceState = useCallback(() => {
        setIsOn(prev => {
          const newState = !prev;
          notificationsService.saveNotification(id_device,`Thông báo: ${newState ? "Bật" : "Tắt"} ${name}`)
          return newState;
        });
        
    }, [deviceType]);

    useEffect(() => {
      if(isLoading) return //chưa lấy dữ liệu xong
      if (initialMount.current) // lấy dữ liệu xong và bỏ qua việc call API lần đầu
      {
        initialMount.current = false;
        return; 
      }
      let isMounted = true; // Kiểm tra component có bị unmount không
    
      const toggleDevice = async () => {
        try {
          await deviceService.toggleDevice(deviceType, isOn!==null?isOn:true, level,color,id_user);
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

    return { isOn,selectedRoom, setSelectedRoom, toggleDeviceState, id_user};
  }
  