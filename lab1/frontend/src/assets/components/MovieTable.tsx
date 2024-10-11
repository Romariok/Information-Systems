import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table } from '@mui/material';
import { useSelector } from 'react-redux';
import {appSelector} from "../../storage/Slices/AppSlice";

export enum MovieGenre {
    DRAMA = 0,
    ADVENTURE = 1,
    HORROR = 2,
    FANTASY = 3
}

export enum MpaaRating {
    G = 0,
    PG = 1,
    PG_13 = 2,
    R = 3,
    NC_17 = 4
}

interface Movie {
    id: number;
    budget: number;
    creationDate: string;
    genre: MovieGenre;
    goldenPalmCount: number;
    length: number;
    mpaaRating: MpaaRating;
    name: string;
    oscarsCount: number;
    tagline: string;
    totalBoxOffice: number;
    usaBoxOffice: number;
    coordinatesId: number;
    directorId: number;
    operatorId: number;
    screenwriterId: number;
    userId: number;
};

export type MovieArray = Movie[];

export default function MovieTable() {
    const {movies} = useSelector(appSelector);

    if (movies[0] !== undefined) {
        return (
            <TableContainer className='main__table-container' >
                <Table className="main__table" aria-label="data table" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Budget</TableCell>
                            <TableCell>Creation Date</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Golden Palm Count</TableCell>
                            <TableCell>Length</TableCell>
                            <TableCell>MPAA Rating</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Oscars Count</TableCell>
                            <TableCell>Tagline</TableCell>
                            <TableCell>Total Box Office</TableCell>
                            <TableCell>Usa Box Office</TableCell>
                            <TableCell>Coordinates ID</TableCell>
                            <TableCell>Director ID</TableCell>
                            <TableCell>Operator ID</TableCell>
                            <TableCell>ScreenWriter ID</TableCell>
                            <TableCell>User ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movies.map((row: Movie, i: number) => (
                            <TableRow key={i}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.budget}</TableCell>
                                <TableCell>{row.creationDate}</TableCell>
                                <TableCell>{row.genre}</TableCell>
                                <TableCell>{row.goldenPalmCount}</TableCell>
                                <TableCell>{row.length}</TableCell>
                                <TableCell>{row.mpaaRating}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.oscarsCount}</TableCell>
                                <TableCell>{row.tagline}</TableCell>
                                <TableCell>{row.totalBoxOffice}</TableCell>
                                <TableCell>{row.usaBoxOffice}</TableCell>
                                <TableCell>{row.coordinatesId}</TableCell>
                                <TableCell>{row.directorId}</TableCell>
                                <TableCell>{row.operatorId}</TableCell>
                                <TableCell>{row.screenwriterId}</TableCell>
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
                            <TableCell>Budget</TableCell>
                            <TableCell>Creation Date</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Golden Palm Count</TableCell>
                            <TableCell>Length</TableCell>
                            <TableCell>MPAA Rating</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Oscars Count</TableCell>
                            <TableCell>Tagline</TableCell>
                            <TableCell>Total Box Office</TableCell>
                            <TableCell>Usa Box Office</TableCell>
                            <TableCell>Coordinates ID</TableCell>
                            <TableCell>Director ID</TableCell>
                            <TableCell>Operator ID</TableCell>
                            <TableCell>ScreenWriter ID</TableCell>
                            <TableCell>User ID</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        );
    }
}


