import { authService} from '../services/authService';
import { useRouter } from 'next/navigation'; // Sử dụng đúng cách với App Router

export const useAuth = () => {
    const router = useRouter();  // Khởi tạo useRouter

  const handleLogin = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      router.push('/dashboard');  // Chuyển hướng đến Dashboard

    } catch (err) {
      console.error('Login failed', err);
    }
  };

    // Đăng ký tài khoản
  const handleSignup = async ( fname: "string",
  lname: "string",
  phone: "string",
  email: "string",
  password: "string",
  birth: "string",
  gender: "string") => {
    try{
        await authService.signup(fname,lname,phone,email,password,birth,gender);
    }catch (err){
        console.error('Signup failed', err);
    }
  }
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return { handleLogin,handleSignup, handleLogout };
};
