import { authService} from '../services/authService';
import { useRouter } from 'next/navigation'; // Sử dụng đúng cách với App Router
import axiosClient from "@/app/utils/axiosClient";
import { getFirebaseMessaging, getToken, onMessage } from "@/lib/firebase";

const API_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

export const useAuth = () => {
  const router = useRouter();  // Khởi tạo useRouter

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("access_token", data.access_token);
      }
                  
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        console.warn("🚫 Messaging not supported in this browser.");
        return;
      }
      //  Nhận device token
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
      router.push('/dashboard');  // Chuyển hướng đến Dashboard

    } catch (err) {
      console.error('Login failed', err);
    }
  };

    // Đăng ký tài khoản
  const handleSignup = async ( 
  fname: string,
  lname: string,
  phone: string,
  email: string,
  password: string,
  birth: string,
  gender: string) => {
    try{
        const res = await authService.signup(fname,lname,phone,email,password,birth,gender);
    }catch (err){
        console.error('Signup failed', err);
    }
  }
  const handleLogout = async () => {
    await authService.logout();
  };

  return { handleLogin,handleSignup, handleLogout };
};
