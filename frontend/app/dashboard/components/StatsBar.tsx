import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useCallback } from "react";
import {useDeviceStatistics} from '../../hooks/useDeviceStatistics'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Types
interface StatsProps {
  title: string;
  date: string;
  color?: "teal" | "pink";
}


// Utility functions
const mapDeviceTitle = (title: string): string => {
  return title === "Quạt" ? "fan" : "light";
};

// Hàm tạo dữ liệu giả lập

export default function StatsBar({ title, date, color = "teal" }: StatsProps) {
  const router = useRouter();
  const deviceType = mapDeviceTitle(title);
  const hours = useMemo(() => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], []);
  
  const { statistics, isLoading } = useDeviceStatistics(deviceType);
  
  // Xử lý dữ liệu cho biểu đồ
  const chartData = useMemo(() => {
    let usageData;
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

    if (statistics && Object.keys(statistics).length > 0) {
      // Chuyển đổi dữ liệu từ API thành mảng theo giờ
      usageData = hours.map(hour => {
        return Object.keys(statistics).reduce((sum, deviceId) => {
          const deviceStats = statistics[deviceId]?.[formattedDate] ?? {}; // Get stats for current date
          return sum + (deviceStats ? deviceStats[hour] || 0 : 0); // Sum usage for this hour
        }, 0);

      });
    } 
  
    return {
      labels: hours.map(hour => `${hour}:00`),
      datasets: [
        {
          label: "Thời gian sử dụng (phút)",
          data: usageData,
          backgroundColor: color === "teal" ? "rgba(20, 184, 166, 0.6)" : "rgba(236, 72, 153, 0.6)",
          borderColor: color === "teal" ? "rgba(20, 184, 166, 1)" : "rgba(236, 72, 153, 1)",
          borderWidth: 3,
        },
      ],
    };
  }, [statistics, hours, color]);


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        beginAtZero: true, 
        max: 60,
      },
    },
  };

  useEffect(() => {
    router.prefetch(`/statistical/${deviceType}`);
  }, [router, deviceType]);

  const handleViewDetailReport = useCallback(() => {
    router.push(`/statistical/${deviceType}`);
  }, [router, deviceType]);

  return (
    <div className="bg-white h-full rounded-xl pt-4 pl-4 pr-4 relative">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-fit rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
        </div>
        <span className="font-medium">{title}</span>
      </div>

      <div className={`${color === 'teal' ? 'bg-[#DEEAFF]' : 'bg-[#FFDEFA]'}  rounded-2xl h-[70%] w-full relative`}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mt-6">
        <div>{date}</div>
        <button 
          className="text-gray-500 hover:underline cursor-pointer" 
          onClick={handleViewDetailReport}
        >
          Xem báo cáo cụ thể
        </button>
      </div>
    </div>
  );
}