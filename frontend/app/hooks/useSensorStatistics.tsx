// hooks/useSensorStatistics.ts

import { useEffect, useState, useCallback } from "react";
import { sensorStatisticsService, SensorStatItem } from "../services/sensorStatisticsService";

export function useSensorStatistics(deviceType: "temp_sensor" | "humid_sensor") {
  const [data, setData] = useState<SensorStatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let userId = 1;
      try {
        userId = parseInt(localStorage.getItem("user_id") || "1");
      } catch {
        console.warn("Không thể đọc user_id từ localStorage, dùng mặc định = 1");
      }

      const result = await sensorStatisticsService.getSensorStatistics(deviceType, userId);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [deviceType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
