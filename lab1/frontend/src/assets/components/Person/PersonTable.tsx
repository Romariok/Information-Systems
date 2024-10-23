import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { appSelector, getPerson, IPerson, sendDeletePerson, setPersonPage, setUpdatedPerson } from "../../../storage/Slices/AppSlice";
import { AppDispatch } from '../../../storage/store';
import { useState } from 'react';
import StyleButton from '../StyleButton';
import PersonForm from './PersonForm';
import PersonUpdateForm from './PersonUpdateForm';

export enum Color {
    GREEN = "GREEN",
    BLUE = "BLUE",
    WHITE = "WHITE",
    BROWN = "BROWN",
    NULL_COLOR = ""
}

export enum Nationality {
    RUSSIA = "RUSSIA",
    UNITED_KINGDOM = "UNITED_KUNGDOM",
    VATICAN = "VATICAN",
    ITALY = "ITALY",
    THAILAND = "THAILAND",
    NULL_COUNTRY = ""
}

interface Person {
    id: number;
    eyeColor: Color;
    hairColor: Color;
    name: string;
    nationality: Nationality;
    weight: number;
    locationId: number;
    adminCanModify: boolean;
    userId: number;
};

export type PersonArray = Person[];

export default function PersonTable() {
    const dispatch = useDispatch<AppDispatch>();
    const { persons, isFetching, personPage } = useSelector(appSelector);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);


    const handleOpenCreate = () => {
        if (openUpdate === false) {
            setOpenCreate(true);
        }
    };

    const handleOpenUpdate = (person: IPerson | null) => {
        if (openCreate === false) {
            dispatch(setUpdatedPerson(person));
            const timer = setTimeout(() => {
                setOpenUpdate(true);
            }, 100);
        }
    };

    const handleCloseCreate = () => setOpenCreate(false);

    const handleCloseUpdate = () => setOpenUpdate(false);

    const handleDelete = (person: IPerson) => {
        const timer = setTimeout(() => {
            dispatch(sendDeletePerson({ id: person.id }));
        }, 50);

    };

    if (persons !== undefined && persons.length > 0) {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', flexDirection: 'column' }}>
                    <div>
                        <StyleButton text="Create person" onclick={handleOpenCreate} disabled={isFetching} type="button" />
                        <PersonForm open={openCreate} onClose={handleCloseCreate} />
                    </div>
                    <TableContainer className='main__table-container' >
                        <Table className="main__table" aria-label="data table" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Eye Color</TableCell>
                                    <TableCell>Hair Color</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Nationality</TableCell>
                                    <TableCell>Weight</TableCell>
                                    <TableCell>Location ID</TableCell>
                                    <TableCell>Admin Can Modify</TableCell>
                                    <TableCell>User ID</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {persons.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.eyeColor}</TableCell>
                                        <TableCell>{String(row.hairColor)}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.nationality}</TableCell>
                                        <TableCell>{row.weight}</TableCell>
                                        <TableCell>{row.location.id}</TableCell>
                                        <TableCell>{String(row.adminCanModify)}</TableCell>
                                        <TableCell>{row.userId}</TableCell>
                                        <TableCell><div>
                                            <StyleButton text="Update" onclick={(e) => handleOpenUpdate(row)} disabled={isFetching} type="button" />
                                            <PersonUpdateForm open={openUpdate} onClose={handleCloseUpdate} />
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
                            disabled={isFetching || personPage === 0}
                            type="button"
                            onclick={() => { if (personPage > 0) { dispatch(setPersonPage(personPage - 1)); dispatch(getPerson(personPage - 1)) } }} />
                        <label style={{
                            fontFamily: "Undertale",
                            backgroundColor: 'black',
                            color: 'white'
                        }}>
                            {personPage}
                        </label>
                        <StyleButton text="Next Page"
                            disabled={isFetching}
                            type="button"
                            onclick={() => { dispatch(setPersonPage(personPage + 1)); dispatch(getPerson(personPage + 1)) }} />
                    </Box>
                </Box>
            </>

        );
    } else {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', flexDirection: 'column' }}>
                    <div>
                        <StyleButton text="Create person" onclick={handleOpenCreate} disabled={isFetching} type="button" />
                        <PersonForm open={openCreate} onClose={handleCloseCreate} />
                    </div>
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
                            disabled={isFetching || personPage === 0}
                            type="button"
                            onclick={() => { if (personPage > 0) { dispatch(setPersonPage(personPage - 1)); dispatch(getPerson(personPage - 1)) } }} />
                        <label style={{
                            fontFamily: "Undertale",
                            backgroundColor: 'black',
                            color: 'white'
                        }}>
                            {personPage}
                        </label>
                        <StyleButton text="Next Page"
                            disabled={isFetching}
                            type="button"
                            onclick={() => { dispatch(setPersonPage(personPage + 1)); dispatch(getPerson(personPage + 1)) }} />
                    </Box>
                </Box>
            </>
        );
    }
}


