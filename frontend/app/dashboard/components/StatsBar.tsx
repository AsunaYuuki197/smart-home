import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Types
interface StatsProps {
  title: string;
  date: string;
  color?: "teal" | "pink";
}

interface StatisticsData {
  [key: string]: {
    time: number;
    hour: number;
  };
}

// Service API
const statisticsService = {
  getDeviceStatistics: async (deviceType: string, userId: string | number): Promise<StatisticsData> => {
    const savedDevices = sessionStorage.getItem(`statistics_${deviceType}`);
    if (savedDevices) {
      return (JSON.parse(savedDevices)); // Lấy dữ liệu từ sessionStorage
    } else {
      try {
        const response = await fetch(`/api/device/${deviceType}/statistics?user_id=${userId}`);
        
        if (!response.ok) {
          throw new Error(`Lỗi khi lấy dữ liệu thống kê cho ${deviceType}`);
        }
        const data = await response.json()
        sessionStorage.setItem(`statistics_${deviceType}`, JSON.stringify(data));
        return data;
      } catch (error: any) {
        console.error(`Error fetching ${deviceType} statistics:`, error.message);
        throw error;
      }
    }
  }
};

// Utility functions
const mapDeviceTitle = (title: string): string => {
  return title === "Quạt" ? "fan" : "light";
};

// Hàm tạo dữ liệu giả lập
const getDefaultUsageData = (hour: number): number => {
  const baseHeights: Record<number, number> = {
    3: 20, 4: 30, 5: 40, 6: 50, 7: 60, 8: 70, 9: 60,
    10: 50, 11: 40, 12: 30, 13: 20, 14: 30, 15: 40,
    16: 50, 17: 60, 18: 70, 19: 60, 20: 50, 21: 40
  };
  return baseHeights[hour] || Math.floor(Math.random() * 60) + 10;
};

// Custom hook để quản lý dữ liệu thống kê
function useDeviceStatistics(deviceType: string) {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    try {
      // Lấy user_id từ localStorage, xử lý tình huống localStorage không khả dụng
      let userId;
      try {
        userId =1 //parseInt(localStorage.getItem("user_id")|| "1");
      } catch (e) {
        console.warn("Không thể truy cập localStorage, sử dụng user_id mặc định");
        userId = 1;
      }
      
      const data = await statisticsService.getDeviceStatistics(deviceType, userId);
      setStatistics(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(`Lỗi khi lấy thống kê ${deviceType}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { statistics, isLoading, error, refetch: fetchStatistics };
}

export default function StatsBar({ title, date, color = "teal" }: StatsProps) {
  const router = useRouter();
  const deviceType = mapDeviceTitle(title);
  const hours = useMemo(() => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], []);
  
  const { statistics, isLoading } = useDeviceStatistics(deviceType);
  
  // Xử lý dữ liệu cho biểu đồ
  const chartData = useMemo(() => {
    // Nếu có dữ liệu thống kê, sử dụng nó; nếu không, sử dụng dữ liệu mặc định
    let usageData;
    
    // if (!statistics) {
    //   // Chuyển đổi dữ liệu từ API thành mảng theo giờ
    //   usageData = hours.map(hour => {
    //     // Tìm giá trị tương ứng cho giờ này trong dữ liệu thống kê
    //     const hourData = Object.values(statistics).find(item => item.hour === hour);
    //     return hourData ? hourData.time : 0;
    //   });
    // } else {
    //   // Sử dụng dữ liệu mặc định nếu chưa có dữ liệu thống kê
    //   usageData = hours.map(hour => getDefaultUsageData(hour));
    // }
    usageData = hours.map(hour => getDefaultUsageData(hour));
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

  // Prefetch trang thống kê chi tiết
  useEffect(() => {
    router.prefetch(`/statistical/${deviceType}`);
  }, [router, deviceType]);

  const handleViewDetailReport = useCallback(() => {
    router.push(`/statistical/${deviceType}`);
  }, [router, deviceType]);

  return (
    <div className="bg-white h-full rounded-xl p-4 relative">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-fit rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
        </div>
        <span className="font-medium">{title}</span>
      </div>

      <div className={`${color === 'teal' ? 'bg-[#DEEAFF]' : 'bg-[#FFDEFA]'} rounded-2xl h-50 w-full relative`}>
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