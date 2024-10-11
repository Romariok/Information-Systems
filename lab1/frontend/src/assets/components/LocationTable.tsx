import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table } from '@mui/material';
import { useSelector } from 'react-redux';
import {appSelector} from "../../storage/Slices/AppSlice";

interface Location {
    id: number;
    name: string;
    x: number;
    y: number;
    z: number;
    userId: number;
};

export type LocationsArray = Location[];

export default function LocationsTable() {
    const {locations} = useSelector(appSelector);

    if (locations[0] !== undefined) {
        return (
            <TableContainer className='main__table-container' >
                <Table className="main__table" aria-label="data table" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>X</TableCell>
                            <TableCell>Y</TableCell>
                            <TableCell>Z</TableCell>
                            <TableCell>User ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.x}</TableCell>
                                <TableCell>{row.y}</TableCell>
                                <TableCell>{row.z}</TableCell>
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
                            <TableCell>Name</TableCell>
                            <TableCell>X</TableCell>
                            <TableCell>Y</TableCell>
                            <TableCell>Z</TableCell>
                            <TableCell>User ID</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        );
    }
}


