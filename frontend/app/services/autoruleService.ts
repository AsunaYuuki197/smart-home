import axiosClient from "./axiosClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

export const autoruleService ={
    getCoundown: async (): Promise<any> =>{
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/autorule/countdown`, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Error fetching countdown rules`);
            }
            const data = await response.data;
            return data;
        } catch (error: any) {
            console.error(`Error fetching countdown rules:`, error.message);
            throw error;
        }
    },
    getWakeWord: async (): Promise<any> => {
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/autorule/wakeword`, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Error fetching wakeword rules`);
            }
            const data = await response.data;
            return data;
        } catch (error: any) {
            console.error(`Error fetching wakeword rules:`, error.message);
            throw error;
        }

    },
    //... post
    saveCoundown: async (status: string,time:number):Promise<any> =>{
        try{
            const response = await axiosClient.post(`${API_BASE_URL}/autorule/save/countdown`, {
            "user_id" : "1",
            "status" : status,
            "time":  time
            }, {
                headers: { "Content-Type": "application/json" },
            });

        }catch (error: any) {
            console.error(`Error saving countdown rules:`, error.message);
            throw error;
        }
    },
    saveWakeword: async (status: string, text: string ):Promise<any> =>{
        try{
            const response = await axiosClient.post(`${API_BASE_URL}/autorule/save/wakeword`, {
                "user_id" : "1",
                "status" : status,
                "text": text
            }, {
                headers: { "Content-Type": "application/json" },
                });
        }catch (error: any) {
            console.error(`Error saving wakeword rules:`, error.message);
            throw error;
        }
    },
    saveNotify : async (status: string, platform: string, temp: number ):Promise<any> =>{
        try{
            const response = await axiosClient.post(`${API_BASE_URL}/autorule/save/notify`, {
                "user_id" : "1",
                "status": status,
                "platform": platform,
                "temp": temp
                }, {
                    headers: { "Content-Type": "application/json" },
                    });
        }catch (error:any){
            console.error(`Error saving notify rules:`, error.message);
            throw error;
        }
    },
    createTimeFrame: async (device_id:number,start_time:string,end_time:string,repeat:number):Promise<any> =>{
        try{
            const response = await axiosClient.post(`${API_BASE_URL}/autorule/create/timeframe`, {
                "user_id" : 1,
                "device_id": device_id,
                "start_time": (new Date(`2025-04-21T${start_time}:00`).toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).replace(" ", "T")),
                "end_time": (new Date(`2025-04-21T${end_time}:00`).toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).replace(" ", "T")),
                "repeat": repeat
            }, {
                headers: { "Content-Type": "application/json" },
                });
        }catch (error:any){
            console.error(`Error saving notify rules:`, error.message);
            throw error;
        }
    },
    createMotion: async (device_id:number):Promise<any> =>{
        try{
            const resp = await axiosClient.post(`${API_BASE_URL}/autorule/create/motion?device_id=${device_id}`,{
                headers: { "Content-Type": "application/json" },
                });
            if (!resp) {
                throw new Error(`Error creating motion sensor rules`);
            }
            const data = await resp.data;
            return data;
        }catch(error:any){
            console.error(`Error saving notify rules:`, error.message);
            throw error;
        }
    },
    createLightSensor: async (device_id:number,light_intensity:number,color:string,level:number):Promise<any> =>{
    //set light sensor rule for operating device automatically
        try{
            const response = await axiosClient.post(`${API_BASE_URL}/autorule/create/lightsensor`, {
                "user_id" : "1",
                "device_id": device_id,
                "light_intensity": light_intensity,
                "color": color,
                "level": level
            }, {
                headers: { "Content-Type": "application/json" },
                });
        }catch (error:any){
            console.error(`Error saving notify rules:`, error.message);
            throw error;
        }
    },
    createHTSensor: async (device_id:number,mode:string,humidity:number,temperature:number,level:number):Promise<any> =>{
    // set humidity and temp sensor rule for operating device automatically
        try{
            const response = await axiosClient.post(`${API_BASE_URL}/autorule/create/ht-sensor`, {
                "user_id" : "1",
                "device_id": device_id,
                "mode": mode,
                "humidity": humidity,
                "temperature": temperature,
                "level": level
            }, {
                headers: { "Content-Type": "application/json" },
                });
        }catch (error:any){
            console.error(`Error saving notify rules:`, error.message);
            throw error;
        }
    },
    //... Delete
    // device_id == 1 :fan  ? light
    deleteHTSensor: async (device_id:number): Promise<any> => {
        try{
            const response = await axiosClient.delete(`${API_BASE_URL}/autorule/delete/ht-sensor?device_id=${device_id}`, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Error deleting humidity and temp sensor rules`);
            }
            const data = await response.data;
            return data;
        }catch(error:any){
            console.error(`Error deleting humidity and temp sensor rules:`, error.message);
            throw error;
        }
    },
    deleteLightSensor: async (device_id:number): Promise<any> => {
        try{
            const response = await axiosClient.delete(`${API_BASE_URL}/autorule/delete/light-sensor?device_id=${device_id}`, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response) {
                throw new Error(`Error deleting light sensor rules`);
            }
            const data = await response.data;
            return data;
        }catch(error:any){
            console.error(`Error deleting light sensor rules:`, error.message);
            throw error;
        }
    
    },
    deleteMotion: async (device_id:number): Promise<any> => {
        try{
            const response = await axiosClient.delete(`${API_BASE_URL}/autorule/delete/motion?device_id=${device_id}`, {
                headers: { "Content-Type": "application/json" },
            });
            if(!response){
                throw new Error(`Error deleting motion sensor rules`);
            }
            const data = await response.data;
            return data;
        }catch (error:any){
            console.error(`Error deleting motion sensor rules:`, error.message);
            throw error;
        }
    },
    deleteTimeFrame: async (device_id:number): Promise<any> => {
        try{
            const response = await axiosClient.delete(`${API_BASE_URL}/autorule/delete/timeframe?device_id=${device_id}`, {
                headers: { "Content-Type": "application/json" },
            });
            if(!response){
                throw new Error(`Error deleting time frame rules`);
            }
            const data = await response.data;
            return data;
        }catch (error:any){
            console.error(`Error deleting time frame rules:`, error.message);
            throw error;
        }
    },
    // deleteNotify: async (ruleId: string): Promise<any> => {
    // },
};