"use client"
import { useState } from "react"
import Button from "@mui/material/Button"
import CampaignModal from "./CampaignModal"

export default function CreateCampaignButton () {
    const [createForm, setCreateForm] = useState(false)

    const handleForm = (val: boolean) => setCreateForm(val)

  return (
    <>
        <Button variant="contained" onClick={() => handleForm(true)}>Create new Campaign +</Button>

        <CampaignModal open={createForm} handleClose={() => handleForm(false)} />
    </>
  )
}