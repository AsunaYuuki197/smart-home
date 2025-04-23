//API
import axiosClient from "../utils/axiosClient";

export const notificationsService = {
    getListNotifies: async () => {
        try {
            const response = await axiosClient.get(`/api/notifications`,{
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Lỗi khi lấy dữ liệu thông báo...`);
            }
            const data = await response.data;
            sessionStorage.setItem(`list_notify`, JSON.stringify(data));
            return data;
        } catch (error: any) {
            console.error(`Error fetching notifications:`, error.message);
            throw error;
        }
    },
    queryNotify: async(query:string)=>{
        try {
  
            const response = await axiosClient.get(`/api/notifications/search?query=${query}`,{
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