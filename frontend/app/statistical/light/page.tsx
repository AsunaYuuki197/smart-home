"use client";
import { useRouter } from 'next/navigation';
// import { ChevronDown } from 'lucide-react';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useDeviceStatistics } from "../../hooks/useDeviceStatistics";
export default function Statistical_Light() {

  const [activeDevice, setActiveDevice] = useState('light');
    const deviceOptions = ['fan', 'light'];
    const router = useRouter();
    const [filter, setFilter] = useState('week');
    const filterOptions = ["week", "month"];  
    const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedDevice = e.target.value;
      setActiveDevice(selectedDevice);
      router.push(`/statistical/${selectedDevice}`); // Chuyển trang
    };

    const { statistics, isLoading, error } = useDeviceStatistics(activeDevice);
  const barData = statistics
    ? Object.keys(statistics).map((date) => ({
        date,
        hours: statistics[date],
      }))
    : [];
  
    const lineData = [
      { time: '03', temp: 25, humidity: 80 },
      { time: '06', temp: 27, humidity: 75 },
      { time: '09', temp: 29, humidity: 70 },
      { time: '12', temp: 30, humidity: 65 },
      { time: '15', temp: 28, humidity: 60 },
      { time: '18', temp: 26, humidity: 70 },
      { time: '21', temp: 24, humidity: 80 }
    ];

const [data, setData] = useState(null)
  useEffect(() => {
    const fetchStatus = async () => {
    const user_id = localStorage.getItem("user_id") || 1;
      try {
        const response = await fetch(`/api/device/humid_sensor?user_id=${user_id}`);
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu!");

        const data = await response.json();
        setData(data)
      } catch (error: any) {
        console.error("Error fetching  status:", error.message);
      }
    };

    fetchStatus();
  }, []); 
  return (
    <div className = " flex flex-col ml-10 mr-10 gap-8 h-full">
          <div className = " flex-1 flex flex-col gap-4 ">
            <span className="text-2xl font-bold ml-10">THIẾT BỊ</span>
            <div className = "flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10">
            <select 
                className="w-full rounded p-2 flex items-center  justify-between"
                value={activeDevice}
                onChange={handleDeviceChange}
              >
                {deviceOptions.map(device => (
                  <option key={device} value={device}>{device}</option>
                ))}
              </select>
              {/* <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/> */}
            {/* <ChevronDown/> */}
            </div>
          </div>
          {/* <Suspense fallback={<div>Loading...</div>}>
            <DeviceComponent />
          </Suspense> */}
    
          
          <div className = "flex-1 flex flex-row gap-12 ">
            <div className = "flex-1 flex flex-col gap-4  ">
              <span className="text-2xl font-bold ml-10">Lọc theo</span>
              <div className = "flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10">
            <select 
              className="w-full rounded p-2 flex items-center  justify-between"
              value={filter}
              // onChange={handleDeviceChange}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filterOptions.map(device => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
              {/* <ChevronDown/> */}
          </div>
            </div>
            <div className = "flex-1 flex flex-col gap-4  ">
              <span className="text-2xl font-bold ml-10">Thời gian</span>
              <div className = "flex-1 flex gap-10 ">
                <div className = "flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10 ">
                  <label htmlFor="fromDate" className="text-sm">Từ ngày:</label>
                  <input id="fromDate" name="fromDate" type="date" />
                </div>
                <div className = "flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-7">
                  <label htmlFor="toDate" className="text-sm">Đến ngày:</label>
                  <input id="toDate" name="toDate" type="date" />
                </div>              
              </div>
    
            </div>
          </div>
          <div className = "flex-3 flex gap-12 ">
            <div className = "flex-1 flex items-center bg-white flex-col rounded-[20px]">
            {/* Thời gian hoạt động ... */}
            {/* <h3 className="text-lg font-semibold mb-2">Thời gian hoạt động</h3> */}
            <h3 className="text-lg font-semibold mb-2">Thời gian hoạt động</h3>
                <ResponsiveContainer width="90%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 16]} />
                    <Bar dataKey="hours" fill="#1E88E5" barSize={30} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
            </div>
            <div className = "flex-1 flex flex-col   gap-5">
            <div className="bg-white p-4 rounded-lg  shadow-md flex flex-col h-full">
                  <h3 className="text-lg  font-semibold mb-2">Nhật ký hoạt động</h3>
                  <div className="flex flex-col grid grid-cols-2 gap-4">
                    {['18:37', '13:32', '12:10', '08:14'].map((time) => (
                      <div 
                        key={time} 
                        className="flex justify-between items-center p-2 border rounded-md bg-gray-100 w-full"
                      >
                        <span>Hôm nay • {time}</span>
                        <span>💡</span>
                      </div>
                    ))}
                  </div>
                </div>
              
            </div> 
          </div>
        </div>
    )
  }