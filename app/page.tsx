import CreateCampaignButton from "@/components/CreateCampaignButton"
import Table from "@/components/Table"
import CampaignModel from "@/lib/Models/Campaign.model"
import dbConnect from "@/lib/Helpers"
import { revalidatePath } from "next/cache"

const getData = async () => {
  await dbConnect()

  const campaigns = await CampaignModel.find().lean()
  revalidatePath("/")
  return campaigns
}

export default async function Home() {
  const campaignList = await getData()

  return (
    <>
      <CreateCampaignButton />

      <Table data={campaignList} />
    </>
  )
}
