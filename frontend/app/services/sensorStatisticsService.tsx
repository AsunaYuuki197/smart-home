// services/sensorStatisticsService.ts

export interface SensorStatItem {
    device_id: string;
    value: number;
    timestamp: string;
  }
  
  export const sensorStatisticsService = {
    getSensorStatistics: async (
      deviceType: "temp_sensor" | "humid_sensor",
      userId: number | string
    ): Promise<SensorStatItem[]> => {
      try {
        const response = await fetch(`/api/device/${deviceType}/statistics?user_id=${userId}`);
        if (!response.ok) {
          throw new Error(`Lỗi khi lấy dữ liệu thống kê từ ${deviceType}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error(`Lỗi khi gọi API ${deviceType}:`, error.message);
        throw error;
      }
    }
  };
  