 // API service
import axiosClient from "../utils/axiosClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

 export const deviceService = {
  toggleDevice: async (deviceType: string, isOn: boolean, level:number,color:string, userId: number) => {
    try {
      
      const response = await axiosClient.post(
        `${API_BASE_URL}/device/${deviceType}/${isOn ? "on" : "off"}`,
        {
          user_id: userId,
          device_id: deviceType === "fan" ? 1 : 2,
          action: isOn ? 1 : 0,
          level,
          color,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      return await response.data;
    } catch (error: any) {
      throw new Error(`Error toggling device: ${error.message}`);
    }
  },
  setDeviceLevel: async (deviceType: string, endpoint: string, level: number,color:string, userId: number,deviceID:number) => {
    try {
      const response = await axiosClient.post(`${API_BASE_URL}/device/${deviceType}/${endpoint}`, {
        user_id: userId,
        device_id: deviceType == "fan" ? 1 : 2,
        action: 1,
        level: level,
        color: color,
        }, {
          headers: {
            "Content-Type": "application/json",
            },
            }
            );
      // const response = await fetch(`/api/device/${deviceType}/${endpoint}`, {
      //   method: "POST",
      //   body: JSON.stringify({ user_id: userId, device_id: deviceType =='fan'?1:2, action: 1, level:level, color: color }),
      //   headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
      // });
      // sessionStorage.setItem(`level_${userId}_${deviceID}`, JSON.stringify(level));
      return await response.data;
    } catch (error: any) {
      throw new Error(`Error setting device level: ${error.message}`);
    }
  },
  
  setLightColor: async (color: string, level: number, userId: number) => {
    try {
      const response = await axiosClient.post(`${API_BASE_URL}/device/light/color`, {
        user_id: userId,
        device_id: 2,
        action: 1,
        level:level,
        color: color },{
          headers: { 
            "Content-Type": "application/json",
          },
        })
      // const response = await fetch(`/api/device/light/color`, {
      //   method: "POST",
      //   body: JSON.stringify({ user_id: userId, device_id: 2, action: 1, level:level, color: color }),
      //   headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
      // });
      return await response.data;
    } catch (error: any) {
      throw new Error(`Error setting light color: ${error.message}`);
    }
  },
  getDeviceStatus: async (userID :number, deviceID:number) =>{
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/device/status?user_id=${userID}&device_id=${deviceID}`,{
        headers: { "Content-Type": "application/json" },
      });
      if (!response) throw new Error("Lỗi khi lấy dữ liệu ban đầu");
      const data = await response.data;
      
      // if (data) {
      //   if (data["action"]) sessionStorage.setItem(`action_${userID}_${deviceID}`, JSON.stringify(data["action"] ==1 ?true:false));
      //   if (data["level"]) sessionStorage.setItem(`level_${userID}_${deviceID}`, JSON.stringify(data["level"]));
      //   if (data["color"]) sessionStorage.setItem(`color_${userID}_${deviceID}`, JSON.stringify(data["color"]));
      // }
      return {
        action: data["action"],
        level: data["level"],
        color: data["color"]
      };
      
    }catch(error:any){
      throw new Error(`Error get device's status: ${error.message}`);
    }
  },
};
