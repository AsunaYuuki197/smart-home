"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { deviceService } from "../services/deviceService"; // giả sử bạn có file dịch vụ này

interface DeviceData {
  action: boolean;
  level: number;
  color: string;
}

interface DeviceContextProps {
  deviceData: DeviceData | null;
  refreshDeviceData: () => void;
}

export const DeviceContext = createContext<DeviceContextProps>({
  deviceData: null,
  refreshDeviceData: () => {},
});

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);

  const refreshDeviceData = async () => {
    try {
      // Ví dụ: user_id và device_id được cố định hoặc lấy từ cookie/state
      const data = await deviceService.getDeviceStatus(1, 1);
      setDeviceData({
        action: data.action ? true : false,
        level: data.level,
        color: data.color,
      });
    } catch (error) {
      console.error("Error fetching device data:", error);
    }
  };

  useEffect(() => {
    refreshDeviceData();
  }, []);

  return (
    <DeviceContext.Provider value={{ deviceData, refreshDeviceData }}>
      {children}
    </DeviceContext.Provider>
  );
}
