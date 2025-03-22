export default function UserGreeting() {
  return (
    <div className="bg-white rounded-xl flex items-start gap-3 h-full p-3">
      <div className="w-10 h-10 rounded-full bg-orange-100 flex-shrink-0 ">
        <img src="https://th.bing.com/th/id/OIP.dND4f0DzJH4zmk0fYfhspQHaHa?rs=1&pid=ImgDetMain" className="w-10 h-10 rounded-full" />
      </div>

      <div>
        <h2 className="text-xl font-bold">Xin chào!</h2>
        <p className="text-sm text-gray-500">Ngày hôm nay của bạn thế nào?</p>
      </div>
    </div>
  )
}

