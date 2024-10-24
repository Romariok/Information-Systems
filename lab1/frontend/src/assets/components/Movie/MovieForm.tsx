import React, { useEffect, useState } from 'react';
import {
   Box,
   Input,
   Modal,
   Snackbar,
   Alert,
   Checkbox,
   TextField,
   MenuItem
} from '@mui/material';

import { appSelector, clearState, sendMovie } from "../../../storage/Slices/AppSlice";
import { useDispatch, useSelector } from 'react-redux';
import { ISendMovie } from "../../../storage/Slices/AppSlice";
import StyleButton from '../StyleButton';
import { AppDispatch } from '../../../storage/store';
import { MovieGenre, MpaaRating } from './MovieTable';


interface CoordinateFormProps {
   open: boolean;
   onClose: () => void;
}

interface FormData {
   budget: string;
   genre: MovieGenre;
   goldenPalmCount: string;
   length: string;
   mpaaRating: MpaaRating;
   name: string;
   oscarsCount: string;
   tagline: string;
   totalBoxOffice: string;
   usaBoxOffice: string;
   coordinatesId: string;
   directorId: string;
   operatorId: string;
   screenwriterId: string;
   adminCanModify: boolean;
}

const mpaa_rating = [{ value: "G", label: "G" }, { value: "PG", label: "PG" }, { value: "PG_13", label: "PG_13" }, { value: "R", label: "R" }, { value: "NC_17", label: "NC_17" }];
const movie_genre = [{ value: "DRAMA", label: "Drama" }, { value: "ADVENTURE", label: "Adventure" }, { value: "HORROR", label: "Horror" }, { value: "FANTASY", label: "Fantasy" }, { value: "", label: "NULL" }];

const LocationForm: React.FC<CoordinateFormProps> = ({ open, onClose }) => {
   const dispatch = useDispatch<AppDispatch>();
   const { isFetching, isSuccess, isError, errorMessage, persons, coordinates } = useSelector(appSelector);
   const [openError, setOpenError] = useState<boolean>(false);
   const [formData, setFormData] = useState<FormData>({
      budget: '',
      genre: '' as MovieGenre,
      goldenPalmCount: '',
      length: '',
      mpaaRating: '' as MpaaRating,
      name: '',
      oscarsCount: '',
      tagline: '',
      totalBoxOffice: '',
      usaBoxOffice: '',
      coordinatesId: '',
      directorId: '',
      operatorId: '',
      screenwriterId: '',
      adminCanModify: false
   });

   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newData = {
         budget: formData.budget === '' ? null : Number(formData.budget),
         genre: formData.genre === '' ? null : formData.genre,
         goldenPalmCount: formData.goldenPalmCount === '' ? null : Number(formData.goldenPalmCount),
         length: formData.length === '' ? null : Number(formData.length),
         mpaaRating: formData.mpaaRating === '' ? null : formData.mpaaRating,
         name: formData.name === '' ? null : formData.name,
         oscarsCount: formData.oscarsCount === '' ? null : Number(formData.oscarsCount),
         tagline: formData.tagline === '' ? null : formData.tagline,
         totalBoxOffice: formData.totalBoxOffice === '' ? null : Number(formData.totalBoxOffice),
         usaBoxOffice: formData.usaBoxOffice === '' ? null : Number(formData.usaBoxOffice),
         coordinatesId: formData.coordinatesId === '' ? null : Number(formData.coordinatesId),
         directorId: formData.directorId === '' ? null : Number(formData.directorId),
         operatorId: formData.operatorId === '' ? null : Number(formData.operatorId),
         screenwriterId: formData.screenwriterId === '' ? null : Number(formData.screenwriterId),
         adminCanModify: formData.adminCanModify
      };
      dispatch(sendMovie(newData as ISendMovie));
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
         ...prevState,
         [name]: value
      }));
   };

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

      if (isSuccess) {
         console.log("Movie Succesfully Created");
         onClose();
         dispatch(clearState());
      }
   }, [isError, isSuccess, dispatch]);

   return (
      <>
         <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="person-form-modal"
            aria-describedby="person-form-description"
            sx={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}
         >
            <Box
               component="form"
               noValidate
               sx={{
                  mt: 1,
                  marginTop: '8',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  textAlign: 'center',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  border: '2px solid #000',
                  p: 4,
                  borderColor: 'white',
                  borderWidth: '6px',
                  borderStyle: 'solid',
               }}
               onSubmit={handleFormSubmit}

            >
               <Input
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="budget"
                  name="budget"
                  autoComplete="budget"
                  autoFocus
                  value={formData.budget}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  inputProps={{ min: 0 }}
                  placeholder='Budget (Positive)'
               />

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
                  value={formData.genre}
                  onChange={handleChange}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               >{movie_genre.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                     {option.label}
                  </MenuItem>
               ))}</TextField>
               <Input
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="goldenPalmCount"
                  name="goldenPalmCount"
                  autoComplete="goldenPalmCount"
                  autoFocus
                  value={formData.goldenPalmCount}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  inputProps={{ min: 0 }}
                  placeholder='Golden Palm Count (Positive)'
               />
               <Input
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="length"
                  name="length"
                  autoComplete="length"
                  autoFocus
                  value={formData.length}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  inputProps={{ min: 0 }}
                  placeholder='Length (Positive, Not NULL)'
               />
               <TextField
                  margin="dense"
                  type='text'
                  select
                  variant='standard'
                  required
                  fullWidth
                  id="mpaaRating"
                  name="mpaaRating"
                  autoComplete="mpaaRating"
                  autoFocus
                  label="Mpaa Rating"
                  defaultValue={""}
                  value={formData.mpaaRating}
                  onChange={handleChange}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               >{mpaa_rating.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                     {option.label}
                  </MenuItem>
               ))}</TextField>
               <Input
                  margin="dense"
                  type='text'
                  required
                  fullWidth
                  id="name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  placeholder='Name (Not NULL)'
               />
               <Input
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="oscarsCount"
                  name="oscarsCount"
                  autoComplete="oscarsCount"
                  autoFocus
                  value={formData.oscarsCount}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  inputProps={{ min: 0 }}
                  placeholder='Oscars Count (Positive)'
               />
               <Input
                  margin="dense"
                  type='text'
                  required
                  fullWidth
                  id="tagline"
                  name="tagline"
                  autoComplete="tagline"
                  autoFocus
                  value={formData.tagline}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  placeholder='Tagline'
               />
               <Input
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="totalBoxOffice"
                  name="totalBoxOffice"
                  autoComplete="totalBoxOffice"
                  autoFocus
                  value={formData.totalBoxOffice}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  inputProps={{ min: 0 }}
                  placeholder='Total Box Office (Positive)'
               />
               <Input
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="usaBoxOffice"
                  name="usaBoxOffice"
                  autoComplete="usaBoxOffice"
                  autoFocus
                  value={formData.usaBoxOffice}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  inputProps={{ min: 0 }}
                  placeholder='Usa Box Office (Positive)'
               />
               <TextField
                  margin="dense"
                  type='text'
                  select
                  variant='standard'
                  required
                  fullWidth
                  id="coordinatesId"
                  name="coordinatesId"
                  autoComplete="coordinatesId"
                  autoFocus
                  label="Coordinates ID"
                  defaultValue={""}
                  value={formData.coordinatesId}
                  onChange={handleChange}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               >{coordinates !== undefined ? coordinates.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                     {option.id}
                  </MenuItem>)) : ''}
               </TextField>
               <TextField
                  margin="dense"
                  type='text'
                  select
                  variant='standard'
                  required
                  fullWidth
                  id="directorId"
                  name="directorId"
                  autoComplete="directorId"
                  autoFocus
                  label="Director ID"
                  defaultValue={""}
                  value={formData.directorId}
                  onChange={handleChange}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               >{persons !== undefined ? persons.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                     {option.id}
                  </MenuItem>)) : ''}
               </TextField>
               <TextField
                  margin="dense"
                  type='text'
                  select
                  variant='standard'
                  fullWidth
                  id="operatorId"
                  name="operatorId"
                  autoComplete="operatorId"
                  autoFocus
                  label="Operator ID"
                  defaultValue={""}
                  value={formData.operatorId}
                  onChange={handleChange}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               >{persons !== undefined ? persons.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                     {option.id}
                  </MenuItem>)) : ''}
                  <MenuItem key={"NULL"} value={""}>
                     {"NULL"}
                  </MenuItem>
               </TextField>
               <TextField
                  margin="dense"
                  type='text'
                  select
                  variant='standard'
                  fullWidth
                  id="screenwriterId"
                  name="screenwriterId"
                  autoComplete="screenwriterId"
                  autoFocus
                  label="Screenwriter ID"
                  defaultValue={""}
                  value={formData.screenwriterId}
                  onChange={handleChange}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               >{persons !== undefined ? persons.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                     {option.id}
                  </MenuItem>)) : ''}
                  <MenuItem key={"NULL"} value={""}>
                     {"NULL"}
                  </MenuItem>
               </TextField>

               <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
               }}>
                  <Checkbox
                     required
                     id="adminCanModify"
                     name="adminCanModify"
                     autoFocus
                     value={formData.adminCanModify}
                     onChange={(e) => formData.adminCanModify = e.target.checked}
                     sx={{ color: 'white', mb: 1 }}
                  />
                  <label style={{
                     fontFamily: "Undertale",
                     backgroundColor: 'black',
                     color: 'white'
                  }}>
                     ADMIN CAN MODIFY
                  </label>
               </Box>


               <StyleButton text="Create Movie"
                  disabled={isFetching}
                  type="submit" />
            </Box>
         </Modal>
         <Snackbar open={openError} autoHideDuration={3000} onClose={() => setOpenError(false)}>
            <Alert severity="error" sx={{ fontFamily: "Undertale" }}>
               {errorMessage}
            </Alert>
         </Snackbar>
      </>
   );
};

export default LocationForm;