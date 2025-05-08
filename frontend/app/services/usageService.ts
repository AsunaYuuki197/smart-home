import axiosClient from "../utils/axiosClient";

// Định nghĩa kiểu dữ liệu trả về cho Usage
export interface UsageData {
  [deviceId: string]: {
    [date: string]: {
      [hour: string]: number;
    };
  };
}

export const usageService = {
  getDeviceUsage: async (deviceType: "fan" | "light"): Promise<UsageData> => {
    try {
      const response = await axiosClient.get(`/${deviceType}/usage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      // Lưu vào sessionStorage để sử dụng lại nếu cần
      sessionStorage.setItem(`${deviceType}_usage`, JSON.stringify(response.data));

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching ${deviceType} usage:`, error.message);
      throw error;
    }
  },
};
