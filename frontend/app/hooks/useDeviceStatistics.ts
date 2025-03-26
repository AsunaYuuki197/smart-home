// Custom hook để quản lý dữ liệu thống kê
import { useEffect, useMemo, useState, useCallback } from "react";
import {statisticsService ,StatisticsData} from '../services/statisticsService'

export function useDeviceStatistics(deviceType: string) {
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
  