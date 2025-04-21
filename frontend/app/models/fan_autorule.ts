export interface fan_autorule{
    htsensor_rule?:
    {humidity: number
    level: number
    temperature: number
    },
    
    time_rule?: {
        end_time: Date
        start_time: Date
        repeat: number
    }
    
}