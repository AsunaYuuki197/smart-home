//API
const token = sessionStorage.getItem("access_token");
export const notificationsService = {
    getListNotifies: async () => {
        try {
            const response = await fetch(`/api/notifications`,{
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error(`Lỗi khi lấy dữ liệu thông báo...`);
            }
            const data = await response.json();
            sessionStorage.setItem(`list_notify`, JSON.stringify(data));
            return data;
        } catch (error: any) {
            console.error(`Error fetching notifications:`, error.message);
            throw error;
        }
    },
    queryNotify: async(query:string)=>{
        try {
  
            const response = await fetch(`/api/notifications/search?query=${query}`,{
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            });
            if (!response.ok) {
              throw new Error(`Lỗi khi lấy query notify...`);
            }
            const data = await response.json()
      
      
            return data;
          } catch (error: any) {
            console.error(`Error fetching query notify:`, error.message);
      
            throw error;
          }
    }
}