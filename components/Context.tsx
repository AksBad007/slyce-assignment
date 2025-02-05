"use client"
import { useState, useEffect, useContext, createContext, ReactNode } from "react"
import type { Campaign } from "@/lib/types"
import { getData } from "@/lib/helpers"

interface CampaignContext {
    data: Campaign[]
    setData: (data: Campaign[]) => void
}

const CampaignListContext = createContext<CampaignContext>({ data: [], setData: () => {}})

export default function CampaignListWrapper ({ children }: { children: ReactNode }) {
    const [data, setData] = useState<Campaign[]>([])

    useEffect(() => {
        (async function () {
            const list = await getData()
            setData(list)
        })()
    }, [])

    return (
        <CampaignListContext.Provider value={{ data, setData }}>
            { children }
        </CampaignListContext.Provider>
    )
}

export const useCampaignsContext = () => useContext(CampaignListContext)