// Service API

export interface StatisticsData {
    [deviceId: string]: {
      [date: string]: {
        [hour: string]: number;
      };
    };
  }
export const statisticsService = {
    getDeviceStatistics: async (deviceType: string, userId: string | number): Promise<StatisticsData> => {
      try {
  
        const response = await fetch(`/api/device/${deviceType}/statistics?user_id=${userId}`);
        if (!response.ok) {
          throw new Error(`Lỗi khi lấy dữ liệu thống kê cho ${deviceType}`);
        }
        const data = await response.json()
        sessionStorage.setItem(`statistics_${deviceType}`, JSON.stringify(data));
  
  
        return data;
      } catch (error: any) {
        console.error(`Error fetching ${deviceType} statistics:`, error.message);
  
        throw error;
      }
      // }
    }
  };
  