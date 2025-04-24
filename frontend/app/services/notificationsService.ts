//API
import axiosClient from "../utils/axiosClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

export const notificationsService = {
    getListNotifies: async () => {
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/notifications`,{
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Lỗi khi lấy dữ liệu thông báo...`);
            }
            const data = await response.data;
            // sessionStorage.setItem(`list_notify`, JSON.stringify(data));
            return data;
        } catch (error: any) {
            console.error(`Error fetching notifications:`, error.message);
            throw error;
        }
    },
    saveNotification: async (device_id:number, message: string): Promise<any> => {
        try{
            const response = await axiosClient.post(`${API_BASE_URL}/save/notification`, {
                user_id: 1,
                device_id: device_id,
                message: message,
                timestamp: new Date().toISOString(),
            }, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Lỗi khi lưu thông báo...`);
            }
            return response.data;
        }catch (error: any) {
            console.error(`Error saving notification:`, error.message);
            throw error;
        }
    },
    queryNotify: async(query:string)=>{
        try {
  
            const response = await axiosClient.get(`${API_BASE_URL}/notifications/search?query=${query}`,{
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
              throw new Error(`Lỗi khi lấy query notify...`);
            }
            const data = await response.data;
            return data;
          } catch (error: any) {
            console.error(`Error fetching query notify:`, error.message);
      
            throw error;
          }
    }
}