export interface Campaign {
    _id: string
    name: string
    type: "Cost per Order" | "Cost per Click" | "Buy One Get One"
    start_date: Date
    end_date: Date
    schedules: {
        start_time: Date | ""
        end_time: Date | ""
    }[]
}

export const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]