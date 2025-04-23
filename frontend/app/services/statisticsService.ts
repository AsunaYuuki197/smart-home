// Service API
import axiosClient from "../utils/axiosClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
export interface StatisticsData {
    [deviceId: string]: {
      [date: string]: {
        [hour: string]: number;
      };
    };
  }
// const token = sessionStorage.getItem("access_token");
export const statisticsService = {
    getDeviceStatistics: async (deviceType: string, userId: string | number): Promise<StatisticsData> => {
      try {
  
        const response = await axiosClient.get(`${API_BASE_URL}/device/${deviceType}/usage?user_id=${userId}`,{
          // method: "GET",
          headers: { "Content-Type": "application/json", },
        });
        if (!response) {
          throw new Error(`Lỗi khi lấy dữ liệu thống kê cho ${deviceType}`);
        }
        const data = await response.data
        // sessionStorage.setItem(`statistics_${deviceType}`, JSON.stringify(data));
  
  
        return data;
      } catch (error: any) {
        console.error(`Error fetching ${deviceType} statistics:`, error.message);
  
        throw error;
      }
      // }
    }
  };
  