export interface light_autorule{
    device_id?: number
    lightsensor_rule?:
    {
        light_intensity: number
        level: number
        color: string
        mode: string
    },
    motion_rule?:
    {
        motion_trigger: string
    },
    time_rule?: {
        end_time: Date
        start_time: Date
        repeat: number
    }
    
}
