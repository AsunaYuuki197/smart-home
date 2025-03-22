import {useState,useEffect} from 'react'
export default function StatusMessage() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    //TODO: Call API lấy thông báo state message
    const [message,setMessage] = useState("Có vẻ như không có vấn đề gì đang xảy ra ngay bây giờ!");
    
    
    useEffect(() => {
      const updateDate = () => {
        const now = new Date();
        setDate(now.toLocaleDateString("vi-VN", { month: "short", day: "2-digit" }));
        setTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: true }));
      };
  
      updateDate(); // Gọi ngay lần đầu
      const interval = setInterval(updateDate, 86400000); // Cập nhật mỗi ngày
  
      return () => clearInterval(interval); 
    }, []);


    const handleClick = () => {
      // TODO: Bổ sung logic hiển thị thông báo
      alert('Xem thêm')
    }
    return (
      <div className="bg-white rounded-xl h-full ">
        <div className="flex justify-between items-center text-xs text-gray-500 ml-2 pt-2">
          <div>Hôm nay • {time}</div>
          <button className="text-gray-500 cursor-pointer hover:text-[#AEC7EE] p-2"
                   onClick = {handleClick}>
                    Xem thêm
                    </button>
        </div>
        <p className="text-sm p-2">{message}</p>
      </div>
    )
  }
  
  