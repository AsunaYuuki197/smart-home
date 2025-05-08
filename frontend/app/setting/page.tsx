"use client";
import GeneralConfig from './components/GeneralConfig';
import NotificationConfig from './components/NotificationConfig';
import FanSetting from './components/FanSetting'
import LightSetting from './components/LightSetting'
import { settingService } from '../services/settingService';
import {useState, useEffect } from 'react';
import {fan_autorule} from '../models/fan_autorule';
import { light_autorule } from '../models/light_autorule';
import { notify_autorule } from '../models/notify_autorule';

export default function Setting() {
//isCountDown,time,isWakeup,text
const [isLoading, setIsLoading] = useState(true);
const [isCountDown, setIsCountDown] = useState(false);
const [time, setTime] = useState(0);
const [isWakeup, setIsWakeup] = useState(false);
const [text, setText] = useState("");
const [remaining_time, setRemainingTime] = useState(0);
const [fanObj, setFanObj] = useState<fan_autorule>({});
const [lightObj, setLightObj] = useState<light_autorule>({});
const [notifyObj, setNotifyObj] = useState<notify_autorule>({
  temp: 25,
  platform: "Tất cả",
  status: "off",
  hot_notif: "off"
});

useEffect(() => {
  const fetchData = async () => {
    try{

      const data = await settingService.getConfiguration();
      // console.log('Fetched configuration:', data);
      setIsCountDown(data.countdown.status == "on");
      const Time = data.countdown.time;
      const eta = data.countdown.eta
      const remainingTime = Math.floor((new Date(eta).getTime() - new Date().getTime()) / 1000);
      setRemainingTime(remainingTime);
      setTime(Time);
      
      setIsWakeup(data.wake_word.status == "on");
      setText(data.wake_word.text);
      setFanObj(data.fan_autorule == null ? {} : data.fan_autorule[0]["1"]);
      setLightObj(data.light_autorule == null ? {} : data.light_autorule[0]["2"]);
      setNotifyObj(data.noti);
    }
    catch (error) {
      console.error('Error fetching configuration:', error);
    }
    finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, []);
  return (
    isLoading ? (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex items-center space-x-3 text-gray-600 text-lg font-semibold">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z" />
          </svg>
          <span>Đang tải cấu hình...</span>
        </div>
      </div>
    ) : (
      <div className="flex flex-col ml-10 mr-20 gap-6 h-full">
        {/* ROW 1 */}
        <div className="flex flex-5 gap-24">
          {/* Cấu hình chung */}
          <div className="flex flex-col flex-2/5 gap-6">
            <GeneralConfig isCountDown={isCountDown} time={time} isWakeup={isWakeup} text={text} remaining_time = {remaining_time} />
          </div>
          {/* Đèn */}
          <div className="flex flex-col flex-3/5 gap-6">
            <LightSetting lightObj={lightObj}/>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="flex flex-4 gap-24">
          {/* Thông báo */}
          <div className="flex flex-col flex-2/5 gap-6">
            <NotificationConfig notifyObj = {notifyObj}/>
          </div>
          {/* Quạt */}
          <div className="flex flex-col flex-3/5 gap-6">
            <FanSetting fanObj = {fanObj} />
          </div>
        </div>
      </div>
    )
  );

}