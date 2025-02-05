"use client"
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Row from './TableRow'
import { useCampaignsContext } from './Context'

export default function CampaignTable () {
    const { data } = useCampaignsContext()

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table stickyHeader sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Sr. No.</TableCell>
                        <TableCell>Campaign Name</TableCell>
                        <TableCell>Campaign Type</TableCell>
                        <TableCell>Campaign Schedule</TableCell>
                        <TableCell>Next Activation</TableCell>
                        <TableCell>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((campaign, idx) => <Row row={campaign} key={idx} id={idx + 1} />)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}