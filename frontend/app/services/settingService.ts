import axiosClient from "../utils/axiosClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

export const settingService = {
    getConfiguration: async (): Promise<any> => {
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/configuration`, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Error fetching configuration for user`);
            }
            const data = await response.data;
            return data;
        } catch (error: any) {
            console.error(`Error fetching configuration for user:`, error.message);
            throw error;
        }
    },
    saveConfiguration: async (): Promise<any> => {
        try {
            const response = await axiosClient.post(`${API_BASE_URL}/save/configuration`, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Error saving configuration for user `);
            }
            const data = await response.data;
            return data;
        } catch (error: any) {
            console.error(`Error saving configuration for user :`, error.message);
            throw error;
        }
    }

}