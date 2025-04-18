import axiosClient from "./axiosClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT
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

      return res.data;
    } catch (error: any) {
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
    sessionStorage.removeItem("refresh_token");
    // Optionally: gọi API logout backend nếu có
    // return axiosClient.post("/auth/logout");
  },
};
