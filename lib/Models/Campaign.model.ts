import { Schema, model, models } from "mongoose"
import { Campaign } from "../Helpers/types";

const CampaignSchema = new Schema<Campaign>({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    schedules: [{
        start_time: { type: Date, required: false },
        end_time: { type: Date, required: false },
    }],
});

export default models?.Campaign || model<Campaign>("Campaign", CampaignSchema)