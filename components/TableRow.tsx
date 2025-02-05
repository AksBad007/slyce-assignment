"use client"
import { useState } from 'react'
import Box from "@mui/material/Box"
import Collapse from '@mui/material/Collapse'
import IconButton from "@mui/material/IconButton"
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CampaignModal from './CampaignModal'
import { Campaign, days } from "@/lib/types"

const timeSchedule = (date: Date) => new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

const dateSchedule = (date: Date) => new Date(date).toLocaleString("en-US", { day: "2-digit", month: "short" })

export default function Row({ row, id }: { row: Campaign, id: number }) {
    const [collapsed, setCollapsed] = useState(true)
    const [editForm, setEditForm] = useState(false)
    const { name, type, start_date, end_date, schedules } = row

    const toggleRow = () => setCollapsed(!collapsed)

    const editCampaign = () => setEditForm(true)

    const closeEditForm = () => setEditForm(false)

    const calculateActivation = () => {
        const today = new Date()
        let msg = ""

        if (start_date && today < start_date || (today >= start_date && today <= end_date)) {
            const sampleDate = new Date(start_date)    
            const startDay = start_date.getDay()

            for (let i = 0; i < 7; i++) {
                const start_time = schedules[i].start_time

                if (start_time) {
                    const finalDate = new Date(sampleDate.setDate(sampleDate.getDate() + (startDay <= i ? (i - startDay) : (1 + i))))

                    if (finalDate <= end_date)
                        msg = `${dateSchedule(finalDate)} at ${timeSchedule(start_time)}`

                    break
                }
            }
        }

        return msg
    }

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton size='small' onClick={toggleRow}>
                        {!collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{ id }</TableCell>
                <TableCell>{ name }</TableCell>
                <TableCell>{ type }</TableCell>
                <TableCell>{ dateSchedule(start_date) } - { dateSchedule(end_date) }</TableCell>
                <TableCell>{ calculateActivation() }</TableCell>
                <TableCell>
                    <IconButton size='small' onClick={editCampaign}>
                        <EditIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Campaign Schedule
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Day</TableCell>
                                        <TableCell>Customer</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {schedules.map(({ start_time, end_time }, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell component="th" scope="row">
                                                { days[idx] }
                                            </TableCell>
                                            {(start_time && end_time) ?
                                                <TableCell component="th" scope="row">
                                                    { timeSchedule(start_time) } to { timeSchedule(end_time) }
                                                </TableCell> :
                                                <TableCell component="th" scope="row">
                                                    Not Set
                                                </TableCell>
                                            }
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <CampaignModal open={editForm} data={row} handleClose={closeEditForm} />
        </>
    )
}
