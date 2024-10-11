import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table } from '@mui/material';
import { useSelector } from 'react-redux';
import {appSelector} from "../../storage/Slices/AppSlice";

interface AdminRequest {
    id: number;
    userId: number;
};

export type AdminRequestArray = AdminRequest[];

export default function AdminRequestTable() {
    const {adminRequest} = useSelector(appSelector);

    if (adminRequest[0] !== undefined) {
        return (
            <TableContainer className='main__table-container' >
                <Table className="main__table" aria-label="data table" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adminRequest.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.userId}</TableCell>
                            </TableRow>
                        )).reverse()}
                    </TableBody>
                </Table>
            </TableContainer>


        );
    } else {
        return (
            <TableContainer className='main__table-container' sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table className="main__table" aria-label="data table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User ID</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        );
    }
}


