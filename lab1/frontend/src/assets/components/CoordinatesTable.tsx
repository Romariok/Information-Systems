import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { appSelector, clearState } from "../../storage/Slices/AppSlice";
import React, { useState, useEffect } from 'react';
import { AppDispatch } from '../../storage/store';
import StyleButton from './StyleButton';
import CoordinateForm from './CoordinateForm';

interface Coordinate {
    id: number;
    x: number;
    y: number;
    userId: number;
};

export type CoordinatesArray = Coordinate[];


export default function CoordinatesTable() {
    const { coordinates, isFetching } = useSelector(appSelector);

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {
        return () => {
            console.log(coordinates)
        };
    }, [coordinates]);

    if (coordinates[0] !== undefined) {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', flexDirection: 'column' }}>
                    <div>
                        <StyleButton text="Create coordinate" onclick={handleOpen} disabled={isFetching} type="button" />
                        <CoordinateForm open={open} onClose={handleClose} />
                    </div>
                    <TableContainer className='main__table-container' >
                        <Table className="main__table" aria-label="data table" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>X</TableCell>
                                    <TableCell>Y</TableCell>
                                    <TableCell>User ID</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {coordinates[0].map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.x}</TableCell>
                                        <TableCell>{row.y}</TableCell>
                                        <TableCell>{row.userId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </>



        );
    } else {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', overflowX: 'hidden' }}>
                <TableContainer className='main__table-container' sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <Table className="main__table" aria-label="data table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>X</TableCell>
                                <TableCell>Y</TableCell>
                                <TableCell>User ID</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Box>
        );
    }
}


