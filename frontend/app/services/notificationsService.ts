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
            sessionStorage.setItem(`list_notify`, JSON.stringify(data));
            return data;
        } catch (error: any) {
            console.error(`Error fetching notifications:`, error.message);
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