export // API service

const deviceService = {
  toggleDevice: async (deviceType: string, isOn: boolean, userId: number) => {
    try {
      const response = await fetch(`/api/device/${deviceType}/${isOn ? 'on' : 'off'}`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, device_id: deviceType =='fan'?1:2, action: isOn ? 1 : 0, level: 0, color: "" }),
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error: any) {
      throw new Error(`Error toggling device: ${error.message}`);
    }
  },
  setDeviceLevel: async (deviceType: string, endpoint: string, level: number, userId: number,deviceID:number) => {
    try {
      const response = await fetch(`/api/device/${deviceType}/${endpoint}`, {
        method: "POST",
        body: JSON.stringify({ user_id: deviceID, device_id: deviceType =='fan'?1:2, action: 1, level, color: "" }),
        headers: { "Content-Type": "application/json" },
      });
      sessionStorage.setItem(`level_${userId}_${deviceID}`, JSON.stringify(level));
      return await response.json();
    } catch (error: any) {
      throw new Error(`Error setting device level: ${error.message}`);
    }
  },
  
  setLightColor: async (color: string, level: number, userId: number) => {
    try {
      const response = await fetch(`/api/device/light/color`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, device_id: 2, action: 1, level, color:color }),
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error: any) {
      throw new Error(`Error setting light color: ${error.message}`);
    }
  },
  getDeviceStatus: async (userID :number, deviceID:number) =>{
    try {
      const response = await fetch(`/api/device/status?user_id=${userID}&device_id=${deviceID}`);
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu ban đầu");
      const data = await response.json();
      if (data) {
        if (data["action"]) sessionStorage.setItem(`action_${userID}_${deviceID}`, JSON.stringify(data["action"] ==1 ?true:false));
        if (data["level"]) sessionStorage.setItem(`level_${userID}_${deviceID}`, JSON.stringify(data["level"]));
        if (data["color"]) sessionStorage.setItem(`color_${userID}_${deviceID}`, JSON.stringify(data["color"]));
      }
      console.log("Dữ liệu fetch được: ", data["action"],data["level"],data["color"])
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
