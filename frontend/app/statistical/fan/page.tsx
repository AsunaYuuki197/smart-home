/*
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
*/
"use client";

import { useRouter } from "next/navigation";
// import { ChevronDown } from 'lucide-react';
import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useDeviceStatistics } from "../../hooks/useDeviceStatistics";
import { useSensorStatistics } from "../../hooks/useSensorStatistics";
import { notificationsService } from "../../services/notificationsService";
import { useDeviceUsage } from "../../hooks/useDeviceUsage";
import { useMemo } from "react";

export default function Statistical() {
  const [activeDevice, setActiveDevice] = useState("fan");
  const getDeviceID = () => {
    return activeDevice === "fan" ? 1 : 2;  // 1 cho fan, 2 cho light
  };
  const deviceOptions = ["fan", "light"];
  const router = useRouter();
  const [filter, setFilter] = useState("week");
  const filterOptions = ["week", "month"];
  interface Notify {
    device_id: number;
    message: string;
    timestamp: string;
  }
  const [notifies, setNotifies] = useState<Notify[]>([]);
  useEffect(() => {
    async function fetchGetNotify() {
      try {
        const data = await notificationsService.getListNotifies();
        setNotifies(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchGetNotify();
    // }
  }, []);
  // console.log("notifications", notifies);
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDevice = e.target.value;
    setActiveDevice(selectedDevice);
    router.push(`/statistical/${selectedDevice}`); // Chuyển trang
  };

  // const DeviceComponent = lazy(() => import(`./${activeDevice}/page.tsx`));
  console.log("Active device: ", activeDevice);
  const { data, isLoading, error } = useDeviceUsage(activeDevice as "fan" | "light");
  console.log("Dataaa: ",data);
  const barData = data && data[activeDevice == "fan" ? "1" : "2"] 
  ? Object.entries(data[activeDevice == "fan" ? "1" : "2"]).map(([date, hoursObj]) => ({
      date,
      hours: hoursObj["all"] || 0,
    }))
  : [];
  console.log ("Bar data: ", barData);
  const { data: tempData } = useSensorStatistics("temp_sensor");
  const { data: humidData } = useSensorStatistics("humid_sensor");

  // Wrap lineData in its own useMemo to prevent unnecessary re-renders
  const lineData = useMemo(
    () => [
      { time: "03", temp: 25, humidity: 80 },
      { time: "06", temp: 27, humidity: 75 },
      { time: "09", temp: 29, humidity: 70 },
      { time: "12", temp: 30, humidity: 65 },
      { time: "15", temp: 28, humidity: 60 },
      { time: "18", temp: 26, humidity: 70 },
      { time: "21", temp: 24, humidity: 80 },
    ],
    []
  );
  // Giả sử cả hai cùng có dạng: [{ device_id, value, timestamp }]
  const chartData = useMemo(() => {
    const result: Record<
      string,
      { time: string; temp?: number; humidity?: number }
    > = {};

    // Check if tempData is an array and has items
    if (Array.isArray(tempData) && tempData.length > 0) {
      tempData.forEach((item) => {
        const time = new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        if (!result[time]) result[time] = { time };
        result[time].temp = item.value;
      });
    }

    // Check if humidData is an array and has items
    if (Array.isArray(humidData) && humidData.length > 0) {
      humidData.forEach((item) => {
        const time = new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        if (!result[time]) result[time] = { time };
        result[time].humidity = item.value;
      });
    }

    // If no data is available, use the sample lineData
    if (Object.keys(result).length === 0) {
      return lineData;
    }

    return Object.values(result).sort((a, b) => a.time.localeCompare(b.time));
  }, [tempData, humidData, lineData]);

  return (
    <div className=" flex flex-col ml-10 mr-10 gap-8 h-full">
      <div className=" flex-1 flex flex-col gap-4 ">
        <span className="text-2xl font-bold ml-10">THIẾT BỊ</span>
        <div className="flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10">
          <select
            className="w-full rounded p-2 flex items-center  justify-between"
            value={activeDevice}
            onChange={handleDeviceChange}
          >
            {deviceOptions.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>
          {/* <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/> */}
          {/* <ChevronDown/> */}
        </div>
      </div>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <DeviceComponent />
      </Suspense> */}

      <div className="flex-1 flex flex-row gap-12 ">
        <div className="flex-1 flex flex-col gap-4  ">
          <span className="text-2xl font-bold ml-10">Lọc theo</span>
          <div className="flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10">
            <select
              className="w-full rounded p-2 flex items-center  justify-between"
              value={filter}
              // onChange={handleDeviceChange}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filterOptions.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
            {/* <ChevronDown/> */}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4  ">
          <span className="text-2xl font-bold ml-10">Thời gian</span>
          <div className="flex-1 flex gap-10 ">
            <div className="flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10 ">
              <label htmlFor="fromDate" className="text-sm">
                Từ ngày:
              </label>
              <input id="fromDate" name="fromDate" type="date" />
            </div>
            <div className="flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-7">
              <label htmlFor="toDate" className="text-sm">
                Đến ngày:
              </label>
              <input id="toDate" name="toDate" type="date" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-3 flex gap-12 ">
        <div className="flex-1 flex items-center bg-white flex-col rounded-[20px]">
          {/* Thời gian hoạt động ... */}
          {/* <h3 className="text-lg font-semibold mb-2">Thời gian hoạt động</h3> */}
          <h3 className="text-lg font-semibold mb-2">Thời gian hoạt động</h3>
          <ResponsiveContainer width="90%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={80}/>
              <YAxis domain={[0, 16]} />
              <Bar
                dataKey="hours"
                fill="#1E88E5"
                barSize={30}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 flex flex-col   gap-5">
          <div className="bg-white p-4 rounded-lg  shadow-md flex flex-col">
            <h3 className="text-lg  font-semibold mb-2">Nhật ký hoạt động</h3>
            <div className="grid grid-cols-2 gap-4">
            {notifies
              .filter((noti) => {
                const deviceID = getDeviceID(); // Lấy deviceID từ activeDevice
                return (
                  (noti.message.toLowerCase().includes("turn on") ||
                    noti.message.toLowerCase().includes("turn off")) &&
                  noti.device_id === deviceID // Kiểm tra device_id có khớp với activeDevice
                );
              })
              .map((noti) => {
                // Xác định device là "fan" hoặc "light" dựa trên device_id
                const device = noti.device_id === 1 ? "fan" : "light";
                const time = new Date(noti.timestamp).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={noti.timestamp}
                    className="flex justify-between items-center p-2 border rounded-md bg-gray-100 w-full"
                  >
                    <span>Hôm nay • {time}</span>
                    <span>{device === "fan" ? "💨" : "💡"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1 flex items-center bg-white flex-col rounded-[20px] ">
            {/* <h3 className="text-lg font-semibold mb-2">Nhiệt độ & độ ẩm</h3> */}
            <h3 className="text-lg font-semibold mb-2">Nhiệt độ & độ ẩm</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  yAxisId="left"
                  domain={["auto", "auto"]}
                  tick={{ fill: "blue" }}
                  label={{
                    value: "Temp (°C)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "blue",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={["auto", "auto"]}
                  tick={{ fill: "orange" }}
                  label={{
                    value: "Humidity (%)",
                    angle: -90,
                    position: "insideRight",
                    fill: "orange",
                  }}
                />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  stroke="blue"
                  strokeWidth={2}
                  name="Nhiệt độ"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="orange"
                  strokeWidth={2}
                  name="Độ ẩm"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
