import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo,useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatsProps {
  title: string;
  date: string;
  color?: "teal" | "pink";
}

export default function StatsBar({ title, date, color = "teal" }: StatsProps) {
  const hours = [3,4,5,6,7,8, 9,10,11,12,13,14,15,16,17,18,19,20,21];
  const data = useMemo(() => hours.map((hour) => getRandomHeight(hour)), []);
  const router = useRouter();
  const [newTitle, setTitle] = useState(title === "Quạt" ? "fan" : "light");

  const chartData = {
    labels: hours.map((hour) => `${hour}:00`),
    datasets: [
      {
        label: "Thời gian sử dụng (phút)",
        data: data,
        backgroundColor: color === "teal" ? "rgba(20, 184, 166, 0.6)" : "rgba(236, 72, 153, 0.6)",
        borderColor: color === "teal" ? "rgba(20, 184, 166, 1)" : "rgba(236, 72, 153, 1)",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 60,  },
    },
  };
  useEffect(() => {
    router.prefetch(`/statistical/${newTitle.toLowerCase()}`);
  }, [newTitle]);

  const handleClick = (title:string) => {
    setTitle(title === "Quạt" ? "fan" : "light");
    alert(`Xem báo cáo cụ thể ${newTitle}` );
    router.push(`/statistical/${newTitle.toLowerCase()}`);
  };
  

  return (
    <div className="bg-white h-full rounded-xl p-4 relative">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-fit rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
        </div>
        <span className="font-medium">{title}</span>
      </div>

      <div className={`${color=='teal'?'bg-[#DEEAFF]':'bg-[#FFDEFA]'} rounded-2xl h-50 w-full`}>
        <Bar data={chartData} options={options} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mt-6">
        <div>{date}</div>
        <button className="text-gray-500 hover:underline cursor-pointer " onClick = {()=>handleClick(title)}>Xem báo cáo cụ thể</button>
      </div>
    </div>
  );
}

// Hàm tạo dữ liệu giả lập trong 3-21 giờ
//TODO: Thay thế hàm này bằng API thực tế
function getRandomHeight(hour: number): number {
  const baseHeights: Record<number, number> = {
    3: 20,
    4: 30,
    5: 40,
    6: 50,
    7: 60,
    8: 70,
    9: 60,
    10: 50,
    11: 40,
    12: 30,
    13: 20,
    14: 30,
    15: 40,
    16: 50,
    17: 60,
    18: 70,
    19: 60,
    20: 50,
    21: 40
  };
  return baseHeights[hour] || Math.floor(Math.random() * 70) + 10;
}
