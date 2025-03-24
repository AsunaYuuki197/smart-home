"use client";
import{useState, useEffect} from 'react'
export default function Statistical_FAN() {
const [data, setData] = useState(null)
  useEffect(() => {
    const fetchStatus = async () => {
    const user_id = localStorage.getItem("user_id") || 1;
      try {
        const response = await fetch(`/api/device/temp_sensor?user_id=${user_id}`);
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu!");

        const data = await response.json();
        setData(data)
        console.log(" data " , data);
      } catch (error: any) {
        console.error("Error fetching  status:", error.message);
      }
    };

    fetchStatus();
  }, []); 
  return (
    <>    
      <h1>temp_sensor </h1>
      <div>{JSON.stringify(data, null, 2)}</div> 
    </>
    )
  }