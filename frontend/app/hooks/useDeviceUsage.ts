import { useEffect, useState, useCallback } from "react";
import { usageService, UsageData } from "../services/usageService";

export function useDeviceUsage(deviceType: "fan" | "light") {
  const [data, setData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await usageService.getDeviceUsage(deviceType);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError('Unable to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [deviceType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
