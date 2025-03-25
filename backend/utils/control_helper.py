from datetime import timedelta

support_color = {
    "yellow": "vàng", 
    "red": "đỏ", 
    "orange": "cam", 
    "green": "xanh lục", 
    "blue": "xanh biển", 
    "purple": "tím", 
    "white": "trắng"
}

reverse_color = {v: k for k, v in support_color.items()}

# Add usage time hourly to device
def add_usage(out, device_id, timestamp, duration):
    while duration > 0:
        date = timestamp.strftime("%Y-%m-%d")
        hour = timestamp.hour
        minute = timestamp.minute
        minutes_in_hour = min(duration, 60 - minute)
        
        if date not in out[device_id]:
            out[device_id][date] = {**{i: 0 for i in range(24)}, "all": 0}
        
        out[device_id][date][hour] += minutes_in_hour
        out[device_id][date]["all"] += minutes_in_hour
        
        duration -= minutes_in_hour
        timestamp += timedelta(minutes=minutes_in_hour)