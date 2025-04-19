"use client"; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Sử dụng đúng cách với App Router
import bg from "../assets/background.jpg";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'; // Import useAuth từ hooks

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false); // State để xác định client-side rendering
  const [showPassword, setShowPassword] = useState(false)
  const { handleLogin } = useAuth(); // Sử dụng hook để gọi hàm đăng nhập
  const router = useRouter();  // Khởi tạo useRouter
  const goToRegister = () => {
    router.push("/login/register");
  };

  useEffect(() => {
    setIsClient(true);  // Đảm bảo rằng app đã được render trên client-side
  }, []);
  useEffect(() => {
    const token = sessionStorage.getItem("access_token"); 
    if (token) {
      router.push("/dashboard"); // nếu đã login rồi, chuyển hướng đến dashboard
    }
  }, [router]);
  // const handleLogin = () => {
  //   if (email === 'admin' && password === '123456') {
  //     // Giả lập đăng nhập thành công
  //     // Điều hướng đến Dashboard mà không cần kết nối DB
  //     if (isClient) {
  //       router.push('/dashboard');  // Chuyển hướng đến Dashboard
  //     }
  //   } else {
  //     setError('Sai tài khoản hoặc mật khẩu!');
  //   }
  // };

  // if (!isClient) {
  //   return null;  // Trả về null để không render gì trước khi có client-side
  // }
  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="absolute top-10 left-20 text-blue-900 text-8xl font-bold">
        Smart Home
      </div>
  
      <div className="absolute top-40 left-1/2 -translate-x-1/2 flex gap-12 items-start">
        {/* Khung giới thiệu */}
        <div className="w-[800px] bg-white/15 backdrop-blur-md p-20 rounded-lg h-[400px] flex justify-center items-center text-center">
          <p className="text-black font-medium text-justify text-2xl leading-relaxed">
            Trong thời đại công nghệ phát triển mạnh mẽ, nhu cầu về tự động hóa trong đời sống ngày càng tăng.
            Nhà thông minh (Smart Home) là một xu hướng tất yếu giúp nâng cao chất lượng sống, tối ưu hóa năng lượng
            và tăng cường bảo mật. Với sự kết hợp giữa Trí tuệ nhân tạo (AI) và Internet of Things (IoT), nhà thông minh
            có thể tự động điều chỉnh các thiết bị, tiết kiệm điện năng và đảm bảo an ninh.
          </p>
        </div>
  
        {/* Khung đăng nhập */}
        <div className="bg-white rounded-2xl p-8 w-[450px] shadow-xl h-[400px] flex flex-col justify-between">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-center">Đăng nhập</h2>
  
            <input
              type="text"
              placeholder="Email/SDT"
              className="w-full p-2 border rounded"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
  
            <div className="relative">
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full p-2 border rounded"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute right-4 top-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
  
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
  
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <a href="#" className="hover:underline text-base">Chưa có tài khoản?</a>
              <a href="#" className="hover:underline text-base">Quên mật khẩu?</a>
            </div>
  
            <div className="flex gap-3 justify-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                onClick={()=>{handleLogin(email, password)}}
              >
                Đăng nhập
              </button>
              <button
                onClick={goToRegister}
                className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
