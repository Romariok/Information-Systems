import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { appSelector, getMovie, getUserRole, IMovie, sendDeleteMovie, setMoviePage, setUpdatedMovie } from "../../../storage/Slices/AppSlice";
import { AppDispatch } from '../../../storage/store';
import { useEffect, useState } from 'react';
import StyleButton from '../StyleButton';
import MovieForm from './MovieForm';
import MovieUpdateForm from './MovieUpdateForm';

export enum MovieGenre {
    DRAMA = "DRAMA",
    ADVENTURE = "ADVENTURE",
    HORROR = "HORROR",
    FANTASY = "FANTASY",
    NULL_GENRE = ""
}

export enum MpaaRating {
    G = "G",
    PG = "PG",
    PG_13 = "PG_13",
    R = "R",
    NC_17 = "NC_17",
    NULL_RATING = ""
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
    adminCanModify: boolean;
    userId: number;
};

export type MovieArray = Movie[];

export default function MovieTable() {
    const dispatch = useDispatch<AppDispatch>();
    const { movies, isFetching, moviePage } = useSelector(appSelector);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);


    const handleOpenCreate = () => {
        if (openUpdate === false) {
            setOpenCreate(true);
        }
    };

    const handleOpenUpdate = (movie: IMovie | null) => {
        if (openCreate === false) {
            dispatch(setUpdatedMovie(movie));
            const timer = setTimeout(() => {
                setOpenUpdate(true);
            }, 100);
        }
    };
    const handleCloseCreate = () => setOpenCreate(false);

    const handleCloseUpdate = () => setOpenUpdate(false);

    const handleDelete = (movie: IMovie) => {
        const timer = setTimeout(() => {
            dispatch(sendDeleteMovie({ id: movie.id }));
        }, 50);

    };

    if (movies !== undefined && movies.length > 0) {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', flexDirection: 'column' }}>
                    <div>
                        <StyleButton text="Create movie" onclick={handleOpenCreate} disabled={isFetching} type="button" />
                        <MovieForm open={openCreate} onClose={handleCloseCreate} />
                    </div>
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
                                    <TableCell>Admin Can Modify</TableCell>
                                    <TableCell>User ID</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {movies.map((row: Movie, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{String(row.budget)}</TableCell>
                                        <TableCell>{row.creationDate}</TableCell>
                                        <TableCell>{String(row.genre)}</TableCell>
                                        <TableCell>{String(row.goldenPalmCount)}</TableCell>
                                        <TableCell>{row.length}</TableCell>
                                        <TableCell>{row.mpaaRating}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{String(row.oscarsCount)}</TableCell>
                                        <TableCell>{String(row.tagline)}</TableCell>
                                        <TableCell>{String(row.totalBoxOffice)}</TableCell>
                                        <TableCell>{String(row.usaBoxOffice)}</TableCell>
                                        <TableCell>{row.coordinates.id}</TableCell>
                                        <TableCell>{row.director.id}</TableCell>
                                        <TableCell>{row.operator !== null ? row.operator.id : "NULL"}</TableCell>
                                        <TableCell>{row.screenwriter !== null ? row.screenwriter.id : "NULL"}</TableCell>
                                        <TableCell>{String(row.adminCanModify)}</TableCell>
                                        <TableCell>{row.userId}</TableCell>
                                        <TableCell><div>
                                            <StyleButton text="Update" onclick={(e) => handleOpenUpdate(row)} disabled={isFetching} type="button" />
                                            <MovieUpdateForm open={openUpdate} onClose={handleCloseUpdate} />
                                        </div></TableCell>
                                        <TableCell><StyleButton text="Delete" onclick={(e) => handleDelete(row)} disabled={isFetching} type="button" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>

                        <StyleButton text="Previous Page"
                            disabled={isFetching || moviePage === 0}
                            type="button"
                            onclick={() => { if (moviePage > 0) { dispatch(setMoviePage(moviePage - 1)); dispatch(getMovie(moviePage - 1)) } }} />
                        <label style={{
                            fontFamily: "Undertale",
                            backgroundColor: 'black',
                            color: 'white'
                        }}>
                            {moviePage}
                        </label>
                        <StyleButton text="Next Page"
                            disabled={isFetching}
                            type="button"
                            onclick={() => { dispatch(setMoviePage(moviePage + 1)); dispatch(getMovie(moviePage + 1)) }} />
                    </Box>
                </Box>
            </>

        );
    } else {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', flexDirection: 'column' }}>
                    <div>
                        <StyleButton text="Create movie" onclick={handleOpenCreate} disabled={isFetching} type="button" />
                        <MovieForm open={openCreate} onClose={handleCloseCreate} />
                    </div>
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
                                    <TableCell>Admin Can Modify</TableCell>
                                    <TableCell>User ID</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>

                        <StyleButton text="Previous Page"
                            disabled={isFetching || moviePage === 0}
                            type="button"
                            onclick={() => { if (moviePage > 0) { dispatch(setMoviePage(moviePage - 1)); dispatch(getMovie(moviePage - 1)) } }} />
                        <label style={{
                            fontFamily: "Undertale",
                            backgroundColor: 'black',
                            color: 'white'
                        }}>
                            {moviePage}
                        </label>
                        <StyleButton text="Next Page"
                            disabled={isFetching}
                            type="button"
                            onclick={() => { dispatch(setMoviePage(moviePage + 1)); dispatch(getMovie(moviePage + 1)) }} />
                    </Box>
                </Box>
            </>
        );
    }
}


