"use client";
import { Search } from "lucide-react";
import { notificationsService } from "../services/notificationsService";
import { useEffect, useRef, useCallback, useState, use } from "react";
export default function Notifications({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOn: boolean) => void;
}) {
  const [notifies, setNotifies] = useState([]);
  const [query, setQuery] = useState(""); // Gán vào filter sau 1s

  useEffect(() => {
    async function fetchGetNotify() {
      try {
        const data = await notificationsService.getListNotifies();
        setNotifies(data);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    // const storagedNotify = sessionStorage.getItem(`list_notify`);
    // if (storagedNotify) {
    //   setNotifies(JSON.parse(storagedNotify));
    //   console.log("session Storage: ", JSON.parse(storagedNotify));
    // } else {
    fetchGetNotify();
    // }
  }, []);


  const filteredNotifies =notifies.slice(0,10).filter((notify:any) =>
    notify?.message.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className={`absolute top-0 left-25 pl-4 pt-4 pb-4 rounded-[20px] bg-[#F3F3F3] w-[430px] min-h-[500] max-h-[500px] z-50
                    flex flex-col gap-5 
                    ${isOpen ? "" : "hidden"}`}
    >
      {/* Ô tìm kiếm */}
      <div className="relative  rounded-[20px] border-1 border-black bg-white  w-[92%] flex items-center p-2">
        <Search className="absolute left-3 text-gray-400 w-5 h-5" />
        <input
          type="search"
          placeholder="Tìm kiếm thông báo..."
          className="w-full pl-10 pr-3 rounded-[20px] outline-none "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="overflow-y-scroll transition-all duration-300 ">
        <ul className="flex flex-col gap-3 h-full w-[95%] ">
          {filteredNotifies.map((notify: any,index) => {
            const [date, time] = notify["timestamp"].split("T");
            const [hours, minutes] = time.split(":");
            const mess = notify?.message;
            return (
              <li
                key={index}
                className="flex flex-col gap-2 bg-white h-[165px] shadow-2xs rounded-[20px] p-4"
              >
                <span className="font-mono text-black opacity-50">{`${date}: ${hours}:${minutes}`}</span>
                <span className="font-medium">{mess}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
