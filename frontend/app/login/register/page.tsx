"use client"; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import bg from "../../assets/background.jpg";
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)  
    const router = useRouter();
    const goToLogin = () => {
    router.push("/login");
  };

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
  
        {/* Khung đăng ký */}
        <div className="bg-white rounded-2xl p-8 w-[450px] shadow-xl h-[400px] flex flex-col justify-between">
        <h2 className="text-lg font-semibold mb-4 text text-3xl ">Đăng ký</h2>
        <div className="flex gap-4">
          <input type="text" placeholder="Họ" className="w-1/2 p-2 border rounded-xl" />
          <input type="text" placeholder="Tên" className="w-1/2 p-2 border rounded-xl" />
        </div>
        <input type="text"
            placeholder="Email"
            className="w-full p-2 border rounded-2xl mb-4 h-[50px] mt-4" 
        />
        <input type="text" placeholder="SĐT" className="w-full p-2 border rounded-2xl mb-4 h-[50px]" />
        <div className="relative mb-4 h-[50px]">
          <input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" className="w-full h-full p-2 border rounded-2xl " />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>
        {/* <div className="flex justify-between text-sm mb-4">
          <a href="#" className="hover:underline text-base">Chưa có tài khoản?</a>
          <a href="#" className="hover:underline text-base" >Quên mật khẩu?</a>
        </div> */}
        <div className="  flex gap-2 justify-center space-x-4 mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded ">Đăng nhập</button>
          <button
                onClick={goToLogin}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Đăng ký
              </button>
        </div>
      </div>

      </div>
    </div>
  );
  
}
