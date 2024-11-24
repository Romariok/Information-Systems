import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Box, Snackbar, Alert, Grid, TextField, Input, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { appSelector, setFetching, setError, setErrorMessage, clearState } from "../../storage/Slices/AppSlice";
import { useState, useEffect } from 'react';
import StyleButton from './StyleButton';
import axios, { AxiosError } from "axios";
import { AppDispatch } from '../../storage/store';

const movie_genre = [{ value: "DRAMA", label: "Drama" }, { value: "ADVENTURE", label: "Adventure" }, { value: "HORROR", label: "Horror" }, { value: "FANTASY", label: "Fantasy" }];

export default function CoordinatesTable() {
   const dispatch = useDispatch<AppDispatch>();
   const { isFetching, isError, errorMessage } = useSelector(appSelector);
   const [directorsCount, setDirectorsCount] = useState([]);
   const [moviesNoOscars, setMoviesNoOscars] = useState("");
   const [usaLessCountResult, setUsaLessCountResult] = useState("");
   const [usaLessCount, setUsaLessCount] = useState("");
   const [taglineSubstring, setTaglineSubstring] = useState("");
   const [taglineSubstringResult, setTaglineSubstringResult] = useState("");
   const [removeOscarsResult, setRemoveOscarsResult] = useState("");
   const [removeOscarsGenre, setRemoveOscarsGenre] = useState("");

   const [openError, setOpenError] = useState<boolean>(false);

   const handleGetDirectorCount = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch(setFetching(true));
      try {
         const link = "http://localhost:5252/movie/count/director";

         const response = await axios.get(link, {});
         const data = response.data;
         if (response.status === 200) {
            setDirectorsCount(data);
            dispatch(setFetching(false));
            return;
         } else {
            dispatch(setError(true));
            dispatch(setErrorMessage(data.message));
            dispatch(setFetching(false));
            return;
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         dispatch(setError(true));
         dispatch(setErrorMessage(error.response?.data || "An error occurred"));
         dispatch(setFetching(false));
      }
   }

   const handleGetMoviesNoOscars = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch(setFetching(true));
      try {
         const link = "http://localhost:5252/movie/no-oscars";

         const response = await axios.get(link, {});
         const data = response.data;
         if (response.status === 200) {
            const newData = [data.map((movie: any) => {
               return movie.name;
            })];
            setMoviesNoOscars(newData as [any]);
            dispatch(setFetching(false));
            return;
         } else {
            dispatch(setError(true));
            dispatch(setErrorMessage(data.message));
            dispatch(setFetching(false));
            return;
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         dispatch(setError(true));
         dispatch(setErrorMessage(error.response?.data || "An error occurred"));
         dispatch(setFetching(false));
      }
   }

   const handleGetLessUsaBoxOffice = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch(setFetching(true));
      try {
         if (usaLessCount === "" || isNaN(Number(usaLessCount)) || Number(usaLessCount) < 0) {
            dispatch(setError(true));
            dispatch(setErrorMessage("Please enter a valid number for Less USA Box Office"));
            dispatch(setFetching(false));
            return;
         }
         const link = `http://localhost:5252/movie/usa-box-office/less/${usaLessCount}`;

         const response = await axios.get(link, {});
         const data = response.data;
         if (response.status === 200) {
            setUsaLessCountResult(String(data.length));
            dispatch(setFetching(false));
            return;
         } else {
            dispatch(setError(true));
            dispatch(setErrorMessage(data.message));
            dispatch(setFetching(false));
            return;
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         dispatch(setError(true));
         dispatch(setErrorMessage(error.response?.data || "An error occurred"));
         dispatch(setFetching(false));
      }
   }

   const handleGetTaglineSubstring = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch(setFetching(true));
      try {
         const link = `http://localhost:5252/movie/tagline/${taglineSubstring}`;

         const response = await axios.get(link, {});
         const data = response.data;
         if (response.status === 200) {
            const newData = [data.map((movie: any) => {
               return movie.name;
            })];
            setTaglineSubstringResult(newData as [any]);
            dispatch(setFetching(false));
            return;
         } else {
            dispatch(setError(true));
            dispatch(setErrorMessage(data.message));
            dispatch(setFetching(false));
            return;
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         dispatch(setError(true));
         dispatch(setErrorMessage(error.response?.data || "An error occurred"));
         dispatch(setFetching(false));
      }
   }

   const handleRemoveMoviesByGenre = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch(setFetching(true));
      try {
         if (removeOscarsGenre === "") {
            dispatch(setError(true));
            dispatch(setErrorMessage("Please pick a genre to remove movies from"));
            dispatch(setFetching(false));
            return;
         }
         const link = "http://localhost:5252/movie/remove-oscars";
         let headers = {

         }
         if (localStorage.getItem('token') !== null) {
            headers = {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
            }
         }
         const response = await axios.post(link, {}, {
            params: { genre: removeOscarsGenre },
            headers: headers
         });
         const data = response.data;
         if (response.status === 200) {
            setRemoveOscarsResult("Successfully Remove Some Movies");
            dispatch(setFetching(false));
            return;
         } else {
            setRemoveOscarsResult("");
            dispatch(setError(true));
            dispatch(setErrorMessage(data.message));
            dispatch(setFetching(false));
            return;
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data?.message);
         dispatch(setError(true));
         setRemoveOscarsResult("");
         dispatch(setErrorMessage(error.response?.data?.message));
         dispatch(setFetching(false));
      }
   }

   useEffect(() => {
      if (isError) {
         console.log("Error: " + errorMessage);
         setOpenError(true);
         const timer = setTimeout(() => {
            setOpenError(false);
            dispatch(clearState());
         }, 3000);
         return () => clearTimeout(timer);
      }
   }, [isError, dispatch])

   return (<>
      <Box sx={{ display: 'flex', alignItems: 'center', overflowX: 'hidden', flexDirection: 'column' }}>

         <Grid container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
               <Grid container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Grid item sx={{
                     display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
                     borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', margin: '30px', padding: '10px'
                  }}>
                     <StyleButton text="Get Movies With No Oscars" onclick={handleGetMoviesNoOscars} disabled={isFetching} type="button" />
                     <TextField
                        margin="dense"
                        type='text'
                        variant='outlined'
                        fullWidth
                        id="genre"
                        name="genre"
                        autoComplete="genre"
                        autoFocus
                        defaultValue={moviesNoOscars}
                        value={moviesNoOscars}
                        color='primary'
                        sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                        slotProps={{
                           input: {
                              readOnly: true,
                           },
                        }}
                     />
                  </Grid>
                  <Grid item sx={{
                     display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
                     borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', margin: '30px', padding: '10px'
                  }}>
                     <StyleButton text="Remove Movies By Directors With Movies in Genre" onclick={handleRemoveMoviesByGenre} disabled={isFetching} type="button" />
                     <TextField
                        margin="dense"
                        type='text'
                        select
                        variant='standard'
                        required
                        fullWidth
                        id="genre"
                        name="genre"
                        autoComplete="genre"
                        autoFocus
                        label="Movie Genre"
                        defaultValue={""}
                        value={removeOscarsGenre}
                        onChange={(e) => setRemoveOscarsGenre(e.target.value)}
                        color='primary'
                        sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                     >{movie_genre.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                           {option.label}
                        </MenuItem>
                     ))}</TextField>
                     <TextField
                        margin="dense"
                        type='text'
                        variant='outlined'
                        fullWidth
                        id="removeOscarsResult"
                        name="removeOscarsResult"
                        autoComplete="removeOscarsResult"
                        autoFocus
                        defaultValue={removeOscarsResult}
                        value={removeOscarsResult}
                        color='primary'
                        sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                        slotProps={{
                           input: {
                              readOnly: true,
                           },
                        }}
                     />
                  </Grid>
               </Grid>

            </Grid>

            <Grid container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
               <Grid item sx={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
                  borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', margin: '30px', padding: '10px'
               }}>
                  <StyleButton text="Get Movies With Less Usa Box Office" onclick={handleGetLessUsaBoxOffice} disabled={isFetching} type="button" />
                  <Input
                     margin="dense"
                     type='number'
                     fullWidth
                     id="usaLessCount"
                     name="usaLessCount"
                     autoComplete="usaLessCount"
                     autoFocus
                     value={usaLessCount}
                     onChange={(e) => setUsaLessCount(e.target.value)}
                     sx={{ color: 'white', mb: 1 }}
                     inputProps={{ min: 0 }}
                     placeholder='Less USA Box Office Count (min=0)'
                  />
                  <TextField
                     margin="dense"
                     type='text'
                     variant='outlined'
                     fullWidth
                     id="genre"
                     name="genre"
                     autoComplete="genre"
                     autoFocus
                     defaultValue={usaLessCountResult}
                     value={usaLessCountResult}
                     color='primary'
                     sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                     slotProps={{
                        input: {
                           readOnly: true,
                        },
                     }}
                  />
               </Grid>
               <Grid item sx={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
                  borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', margin: '30px', padding: '10px'
               }}>
                  <StyleButton text="Get Movies by Tagline Substring" onclick={handleGetTaglineSubstring} disabled={isFetching} type="button" />
                  <Input
                     margin="dense"
                     type='text'
                     fullWidth
                     id="taglineSubstring"
                     name="taglineSubstring"
                     autoComplete="taglineSubstring"
                     autoFocus
                     value={taglineSubstring}
                     onChange={(e) => setTaglineSubstring(e.target.value)}
                     sx={{ color: 'white', mb: 1 }}
                     inputProps={{ min: 0 }}
                     placeholder='Tagline substring'
                  />
                  <TextField
                     margin="dense"
                     type='text'
                     variant='outlined'
                     fullWidth
                     id="genre"
                     name="genre"
                     autoComplete="genre"
                     autoFocus
                     maxRows={4}
                     defaultValue={taglineSubstringResult}
                     value={taglineSubstringResult}
                     color='primary'
                     sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                     slotProps={{
                        input: {
                           readOnly: true,
                        },
                     }}
                  />
               </Grid>
            </Grid>
         </Grid>

         <Box sx={{ borderWidth: '2px', borderColor: 'white', borderStyle: 'solid', margin: '30px', padding: '10px' }}>
            <StyleButton text="Get Directors Count" onclick={handleGetDirectorCount} disabled={isFetching} type="button" />
            <TableContainer className='main__table-container' sx={{ maxWidth: '100%', overflowX: 'auto' }}>
               <Table className="main__table" aria-label="data table">
                  <TableHead>
                     <TableRow>
                        <TableCell>Director ID</TableCell>
                        <TableCell>Movie Count</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {directorsCount.length > 0 && directorsCount.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                           <TableCell>{row[0].id}</TableCell>
                           <TableCell>{row[1]}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </Box>

      </Box >


      <Snackbar open={openError} autoHideDuration={3000} onClose={() => setOpenError(false)}>
         <Alert severity="error" sx={{ fontFamily: "Undertale" }}>
            {errorMessage}
         </Alert>
      </Snackbar>
   </>)
}


