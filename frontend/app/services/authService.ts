import axiosClient from "./axiosClient";
import { getFirebaseMessaging, getToken, onMessage } from "@/lib/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT
const API_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY
export const authService = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', email);
    formData.append('password', password);
    formData.append('scope', '');
    formData.append('client_id', '');
    formData.append('client_secret', '');
    try {
      const res = await axiosClient.post(`${API_BASE_URL}/login`, formData,{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        
      });

      const { access_token } = res.data;

      sessionStorage.setItem("access_token", access_token);
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return;
      }

      const messaging = await getFirebaseMessaging();

      if (!messaging) {
        console.warn("🚫 Messaging not supported in this browser.");
        return;
      }

      // 👉 Nhận device token
      const deviceToken = await getToken(messaging, {
          vapidKey: API_VAPID_KEY,
        });

      console.log("deviceToken", deviceToken);
      if (deviceToken) {
        await axiosClient.post(`${API_BASE_URL}/register_token?token=${deviceToken}`, {
        });
      } else {
        alert("Đăng nhập không thành công. Vui lòng thử lại sau.");
        throw new Error("No registration token available. Request permission to generate one.");
      }
      return res.data;
    } catch (error: any) {
      alert("Đăng nhập không thành công. Vui lòng thử lại sau.");
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  },
  signup: async ( fname: "string",
  lname: "string",
  phone: "string",
  email: "string",
  password: "string",
  birth: "string",
  gender: "string") => {
    try {
      const res = await axiosClient.post(`${API_BASE_URL}/signup`, {
        fname,
        lname,
        phone,
        email,
        password,
        birth,
        gender,
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Signup failed");
    }
  },
  logout: () => {
    // Xóa token khỏi sessionStorage
    sessionStorage.removeItem("access_token");
    // return axiosClient.post("/auth/logout");
  },
};
