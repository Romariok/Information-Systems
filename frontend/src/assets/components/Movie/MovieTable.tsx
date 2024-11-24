import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Box, TextField, SortDirection } from '@mui/material';
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
    const { movies, isFetching, moviePage, isAuth } = useSelector(appSelector);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [activeColumn, setActiveColumn] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ field: keyof Movie | null; direction: SortDirection }>({
        field: null,
        direction: null
    });


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

    const handleColumnClick = (columnName: string) => {
        setActiveColumn(activeColumn === columnName ? null : columnName);
        if (activeColumn === columnName) {
            const newFilters = { ...filters };
            delete newFilters[columnName];
            setFilters(newFilters);
            return;
        }

        if (!filters[columnName]) {
            const isAsc = sortConfig.field === columnName && sortConfig.direction === 'asc';
            const nextDirection: SortDirection = !sortConfig.direction ? 'asc' : isAsc ? 'desc' : null;
            setSortConfig({
                field: nextDirection ? columnName as keyof Movie : null,
                direction: nextDirection
            });
        }
    };

    const handleFilterChange = (columnName: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [columnName]: value
        }));
    };
    const getSortedAndFilteredData = () => {
        if (!movies) return [];

        let result = movies.filter(item => {
            return Object.entries(filters).every(([column, filterValue]) => {
                if (!filterValue) return true;
                const itemValue = String(item[column as keyof Movie] || '').toLowerCase();
                return itemValue.includes(filterValue.toLowerCase());
            });
        });

        if (sortConfig.field && sortConfig.direction) {
            result = [...result].sort((a, b) => {
                const aValue = a[sortConfig.field!];
                const bValue = b[sortConfig.field!];

                if (typeof aValue === 'boolean') {
                    return sortConfig.direction === 'asc'
                        ? (aValue === bValue ? 0 : aValue ? 1 : -1)
                        : (aValue === bValue ? 0 : aValue ? -1 : 1);
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                }

                const strA = String(aValue).toLowerCase();
                const strB = String(bValue).toLowerCase();
                return sortConfig.direction === 'asc'
                    ? strA.localeCompare(strB)
                    : strB.localeCompare(strA);
            });
        }

        return result;
    };

    const renderTableHeader = (columnName: string, label: string) => (
        <TableCell
            onClick={() => handleColumnClick(columnName)}
            style={{
                cursor: 'pointer',
                position: 'relative',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {label}
                {sortConfig.field === columnName && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
            </div>
            {activeColumn === columnName && (
                <TextField
                    size="small"
                    value={filters[columnName] || ''}
                    onChange={(e) => handleFilterChange(columnName, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        zIndex: 1000,
                        backgroundColor: 'white',
                        width: '100%'
                    }}
                />
            )}
        </TableCell>
    );

    const sortedAndFilteredData = getSortedAndFilteredData();

    if (movies !== undefined && movies.length > 0) {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', flexDirection: 'column' }}>
                    {isAuth && <div>
                        <StyleButton text="Create movie" onclick={handleOpenCreate} disabled={isFetching} type="button" />
                        <MovieForm open={openCreate} onClose={handleCloseCreate} />
                    </div>}

                    <TableContainer className='main__table-container'>
                        <Table className="main__table" aria-label="data table" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                            <TableHead>
                                <TableRow>
                                    {renderTableHeader('id', 'ID')}
                                    {renderTableHeader('budget', 'Budget')}
                                    {renderTableHeader('creationDate', 'Creation Date')}
                                    {renderTableHeader('genre', 'Genre')}
                                    {renderTableHeader('goldenPalmCount', 'Golden Palm Count')}
                                    {renderTableHeader('length', 'Length')}
                                    {renderTableHeader('mpaaRating', 'MPAA Rating')}
                                    {renderTableHeader('name', 'Name')}
                                    {renderTableHeader('oscarsCount', 'Oscars Count')}
                                    {renderTableHeader('tagline', 'Tagline')}
                                    {renderTableHeader('totalBoxOffice', 'Total Box Office')}
                                    {renderTableHeader('usaBoxOffice', 'USA Box Office')}
                                    {renderTableHeader('coordinatesId', 'Coordinates ID')}
                                    {renderTableHeader('directorId', 'Director ID')}
                                    {renderTableHeader('operatorId', 'Operator ID')}
                                    {renderTableHeader('screenwriterId', 'ScreenWriter ID')}
                                    {renderTableHeader('adminCanModify', 'Admin Can Modify')}
                                    {renderTableHeader('userId', 'User ID')}
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedAndFilteredData.map((row: Movie, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell>{String(row.id)}</TableCell>
                                        <TableCell>{String(row.budget)}</TableCell>
                                        <TableCell>{String(row.creationDate)}</TableCell>
                                        <TableCell>{String(row.genre)}</TableCell>
                                        <TableCell>{String(row.goldenPalmCount)}</TableCell>
                                        <TableCell>{String(row.length)}</TableCell>
                                        <TableCell>{String(row.mpaaRating)}</TableCell>
                                        <TableCell>{String(row.name)}</TableCell>
                                        <TableCell>{String(row.oscarsCount)}</TableCell>
                                        <TableCell>{String(row.tagline)}</TableCell>
                                        <TableCell>{String(row.totalBoxOffice)}</TableCell>
                                        <TableCell>{String(row.usaBoxOffice)}</TableCell>
                                        <TableCell>{String(row.coordinates.id)}</TableCell>
                                        <TableCell>{String(row.director.id)}</TableCell>
                                        <TableCell>{row.operator !== null ? String(row.operator.id) : "NULL"}</TableCell>
                                        <TableCell>{row.screenwriter !== null ? String(row.screenwriter.id) : "NULL"}</TableCell>
                                        <TableCell>{String(row.adminCanModify)}</TableCell>
                                        <TableCell>{String(row.userId)}</TableCell>
                                        <TableCell>
                                            <div>
                                                <StyleButton text="Update" onclick={(e) => handleOpenUpdate(row)} disabled={isFetching} type="button" />
                                                <MovieUpdateForm open={openUpdate} onClose={handleCloseUpdate} />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <StyleButton text="Delete" onclick={(e) => handleDelete(row)} disabled={isFetching} type="button" />
                                        </TableCell>
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
                        <StyleButton
                            text="Previous Page"
                            disabled={isFetching || moviePage === 0}
                            type="button"
                            onclick={() => { if (moviePage > 0) { dispatch(setMoviePage(moviePage - 1)); dispatch(getMovie(moviePage - 1)) } }}
                        />
                        <label style={{
                            fontFamily: "Undertale",
                            backgroundColor: 'black',
                            color: 'white'
                        }}>
                            {moviePage}
                        </label>
                        <StyleButton
                            text="Next Page"
                            disabled={isFetching}
                            type="button"
                            onclick={() => { dispatch(setMoviePage(moviePage + 1)); dispatch(getMovie(moviePage + 1)) }}
                        />
                    </Box>
                </Box>
            </>
        );
    } else {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', flexDirection: 'column' }}>
                    {isAuth && <div>
                        <StyleButton text="Create movie" onclick={handleOpenCreate} disabled={isFetching} type="button" />
                        <MovieForm open={openCreate} onClose={handleCloseCreate} />
                    </div>}
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


