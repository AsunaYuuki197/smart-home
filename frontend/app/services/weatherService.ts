import axiosClient from "../utils/axiosClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT
export const weatherService = {
    getWeather: async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token không hợp lệ");
        const response = await axiosClient.get(`${API_BASE_URL}`,{
          headers: { "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        });
        if (!response) throw new Error("Lỗi khi lấy dữ liệu nhiệt độ!");
        const data = await response.data;
        return data;
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu nhiệt độ:", error.message);
        throw error;
      }
    }
  };