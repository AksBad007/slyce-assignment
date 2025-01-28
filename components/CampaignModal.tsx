"use client"
import { useState } from "react";
import dayjs from "dayjs";
import { Box, Backdrop, Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SaveIcon from '@mui/icons-material/Save';
import { Campaign, days } from "@/lib/Helpers/types"
import { createCampaign, editCampaign } from "@/lib/Helpers";

export default function CampaignModal({ open, handleClose, data }: { open: boolean, handleClose: () => void, data?: Campaign }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const SubmittedData = new Object(Object.fromEntries(new FormData(e.currentTarget))) as Campaign
        const schedules: { start_time: Date | "", end_time: Date | "" }[] = []
        Object.entries(SubmittedData).forEach(([key, value]) => {
            if (/^\d/.test(key)) {
                schedules[Number(key[0])] = { ...schedules[Number(key[0])], [key.slice(1)]: value }
            }

            if (value.includes("hh:"))
                schedules[Number(key[0])] = { start_time: "", end_time: "" }
        })
        SubmittedData.schedules = schedules

        if (data)
            SubmittedData._id = String(data._id)

        const result = data ? await editCampaign(SubmittedData) : await createCampaign(SubmittedData)

        if (result)
            cancelCreation()

        setLoading(false)
    }

    const cancelCreation = () => {
        setLoading(false)
        handleClose()
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    height: "80vh",
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    overflow: "auto"
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        { data ? "Edit Campaign" : "Create Campaign"}
                    </Typography>

                    <Box component="form" sx={{ mt: 2, display: "flex", flexFlow: "column", gap: 2 }} onSubmit={handleSubmit}>
                        <TextField name="name" defaultValue={data?.name || ""} fullWidth label="Campaign Name" variant="outlined" required />

                        <FormControl fullWidth>
                            <InputLabel id="campaign-type">Campaign Type</InputLabel>

                            <Select
                                labelId="campaign-type"
                                name="type"
                                label="Age"
                                defaultValue={data?.type}
                                required
                            >
                                <MenuItem value={"Cost per Order"}>Cost per Order</MenuItem>
                                <MenuItem value={"Cost per Click"}>Cost per Click</MenuItem>
                                <MenuItem value={"Buy One Get One"}>Buy One Get One</MenuItem>
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'TimePicker']}>
                                <Box sx={{ display: "flex", flexFlow: "column", gap: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <DatePicker name="start_date" defaultValue={data ? dayjs(data?.start_date) : null} label="Campaign start date" />
                                        <DatePicker name="end_date" defaultValue={data ? dayjs(data?.end_date) : null} label="Campaign end date" />
                                    </Box>

                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Day</TableCell>
                                                <TableCell>Start Time</TableCell>
                                                <TableCell>End Time</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {days.map((day, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell component="th" scope="row">
                                                    { day }
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <TimePicker defaultValue={data ? dayjs(data?.schedules[idx].start_time) : null} name={idx + "start_time"} label="Start time" />
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <TimePicker defaultValue={data ? dayjs(data?.schedules[idx].end_time) : null} name={idx + "end_time"} label="End time" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </DemoContainer>
                        </LocalizationProvider>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button color="error" variant="contained" onClick={cancelCreation}>Cancel</Button>
                            <Button color="success" variant="contained" type="submit" loading={loading} loadingPosition="start" startIcon={<SaveIcon />}>
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}