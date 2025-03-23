
import { ChevronDown } from "lucide-react";

export default function Statistical() {
  return (
    <div className = " flex flex-col ml-10 mr-10 gap-8 h-full">
      <div className = " flex-1 flex flex-col gap-4 ">
        <span className="text-2xl font-bold ml-10">THIẾT BỊ</span>
        <div className = "flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10">
            Quạt
        <ChevronDown/>
        </div>
      </div>
      <div className = "flex-1 flex flex-row gap-12 ">
        <div className = "flex-1 flex flex-col gap-4  ">
          <span className="text-2xl font-bold ml-10">Lọc theo</span>
          <div className = "flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10">
              Lọc theo tuần ...
              <ChevronDown/>
          </div>
        </div>
        <div className = "flex-1 flex flex-col gap-4  ">
          <span className="text-2xl font-bold ml-10">Thời gian</span>
          <div className = "flex-1 flex gap-10 ">
            <div className = "flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-10 ">
              <label htmlFor="fromDate" className="text-sm">Từ ngày:</label>
              <input id="fromDate" name="fromDate" type="date" />
            </div>
            <div className = "flex-1 flex items-center justify-between bg-white rounded-[20px] pl-10 pr-7">
              <label htmlFor="toDate" className="text-sm">Đến ngày:</label>
              <input id="toDate" name="toDate" type="date" />
            </div>              
          </div>

        </div>
      </div>
      <div className = "flex-3 flex gap-12 ">
        <div className = "flex-1 flex items-center bg-white rounded-[20px]">
        Thời gian hoạt động ...
        </div>
        <div className = "flex-1 flex flex-col  gap-5">
          <div className = "flex-1 flex items-center bg-white rounded-[20px] pl-10 pr-10">
            Nhật kí hoạt động ...
          </div>
          <div className = "flex-1 flex items-center bg-white rounded-[20px] ">
            Chart
          </div>
        </div> 
      </div>
    </div>
  )
  }