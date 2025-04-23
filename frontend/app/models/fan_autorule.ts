export interface fan_autorule{
    deviece_id?: number
    htsensor_rule?:
    {
    humidity: number
    level: number
    temperature: number
    mode: string
    },
    
    time_rule?: {
        end_time: Date
        start_time: Date
        repeat: number
    }
    
}