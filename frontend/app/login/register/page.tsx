"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import bg from "../../assets/background.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/app/hooks/useAuth";

export default function Login() {
  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [birthDate, setBirthDate] = useState(""); // Default to current date
  const [gender, setGender] = useState("male"); // Default to male
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { handleSignup } = useAuth();

  const validateForm = () => {
    if (!firstName.trim()) {
      setError("Vui lòng nhập tên");
      return false;
    }
    if (!lastName.trim()) {
      setError("Vui lòng nhập họ");
      return false;
    }
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return false;
    }
    if (!birthDate) {
      setError("Vui lòng chọn ngày sinh");
      return false;
    }
    setError("");
    return true;
  };

  const registerHandler = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Call the signup function with all the form values
      await handleSignup(
        firstName,
        lastName,
        phone,
        email,
        password,
        birthDate,
        gender
      );
      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
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
            Trong thời đại công nghệ phát triển mạnh mẽ, nhu cầu về tự động hóa
            trong đời sống ngày càng tăng. Nhà thông minh (Smart Home) là một xu
            hướng tất yếu giúp nâng cao chất lượng sống, tối ưu hóa năng lượng
            và tăng cường bảo mật. Với sự kết hợp giữa Trí tuệ nhân tạo (AI) và
            Internet of Things (IoT), nhà thông minh có thể tự động điều chỉnh
            các thiết bị, tiết kiệm điện năng và đảm bảo an ninh.
          </p>
        </div>

        {/* Khung đăng ký */}
        <div className="bg-white rounded-2xl p-8 w-[450px] shadow-xl flex flex-col justify-between">
          <h2 className="font-semibold mb-4 text-3xl">Đăng ký</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Họ"
              className="w-1/2 p-2 border rounded-xl"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tên"
              className="w-1/2 p-2 border rounded-xl"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-2xl mb-4 h-[50px] mt-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="SĐT"
            className="w-full p-2 border rounded-2xl mb-4 h-[50px]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="relative mb-4 h-[50px]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="w-full h-full p-2 border rounded-2xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <input
                type="date"
                className="w-full p-2 border rounded-xl"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <select
                className="w-full p-2 border rounded-xl"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          {/* <div className="flex justify-between text-sm mb-4">
          <a href="#" className="hover:underline text-base">Chưa có tài khoản?</a>
          <a href="#" className="hover:underline text-base" >Quên mật khẩu?</a>
        </div> */}
          {error && (
            <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
          )}
          <div className="flex gap-2 justify-center space-x-4 mt-6">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              disabled={isLoading}
            >
              Đăng nhập
            </button>
            <button
              onClick={registerHandler}
              className={`${
                isLoading ? "bg-gray-400" : "bg-gray-500 hover:bg-gray-600"
              } text-white px-4 py-2 rounded transition-colors`}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
