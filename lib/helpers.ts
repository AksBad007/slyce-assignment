"use server"
import { revalidatePath } from "next/cache"
import { connect } from "mongoose"
import { Campaign } from "./types"
import CampaignModel from "./Campaign.model"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
  var mongoose: any
}

let cached = global.mongoose

if (!cached)
    cached = global.mongoose = { conn: null, promise: null }

export default async function dbConnect() {
    if (cached.conn)
        return cached.conn

    if (!cached.promise)
        cached.promise = connect(process.env.MONGODB_URI as string, { bufferCommands: false }).then(mongoose => mongoose)

    try {
        cached.conn = await cached.promise
        console.log('DB connected.')
        return cached.conn
    } catch (error) {
        console.error('DB connection failed.')
        console.error(error)
    }
}

export const createCampaign = async (data: Campaign) => {
    await dbConnect()

    try {
        data.schedules = data.schedules.map(({ start_time, end_time }) => ({
            start_time: start_time ? new Date(new Date().toDateString() + " " + start_time) : "",
            end_time: end_time ? new Date(new Date().toDateString() + " " + end_time) : ""
        }))

        await new CampaignModel(data).save()
        return true
    } catch (error) {
        console.error("error in creating Campaign =", error)
        return false
    }
}

export const editCampaign = async (data: Campaign) => {
    await dbConnect()

    try {
        data.schedules = data.schedules.map(({ start_time, end_time }) => ({
            start_time: start_time ? new Date(new Date().toDateString() + " " + start_time) : "",
            end_time: end_time ? new Date(new Date().toDateString() + " " + end_time) : ""
        }))

        await CampaignModel.findByIdAndUpdate(data._id, data)
        return true
    } catch (error) {
        console.error("error in editing Campaign =", error)
        return false
    }
}

export const getData = async () => {
  await dbConnect()

  const campaigns = await CampaignModel.find().lean<Campaign[]>()
  revalidatePath("/")
  return campaigns
}