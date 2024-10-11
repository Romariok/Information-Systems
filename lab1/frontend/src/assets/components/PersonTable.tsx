import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table } from '@mui/material';
import { useSelector } from 'react-redux';
import {appSelector} from "../../storage/Slices/AppSlice";

export enum Color {
    GREEN = "green",
    BLUE = 1,
    WHITE = 2,
    BROWN = 3
}

export enum Country {
    RUSSIA = 0,
    UNITED_KINGDOM = 1,
    VATICAN = 2,
    ITALY = 3,
    THAILAND = 4
}

interface Person {
    id: number;
    eyeColor: Color;
    hairColor: Color;
    name: string;
    country: Country;
    weight: number;
    locationId: number;
    userId: number;
};

export type PersonArray = Person[];

export default function PersonTable() {
    const {persons} = useSelector(appSelector);
    
    if (persons[0] !== undefined) {
        return (
            <TableContainer className='main__table-container' >
                <Table className="main__table" aria-label="data table" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Eye Color</TableCell>
                            <TableCell>Hair Color</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Weight</TableCell>
                            <TableCell>Location ID</TableCell>
                            <TableCell>User ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {persons.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.eyeColor}</TableCell>
                                <TableCell>{row.hairColor}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.country}</TableCell>
                                <TableCell>{row.weight}</TableCell>
                                <TableCell>{row.locationId}</TableCell>
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
                            <TableCell>Eye Color</TableCell>
                            <TableCell>Hair Color</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Weight</TableCell>
                            <TableCell>Location ID</TableCell>
                            <TableCell>User ID</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        );
    }
}


