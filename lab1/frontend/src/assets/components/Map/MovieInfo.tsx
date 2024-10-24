import React, { useEffect, useState } from 'react';
import {
   Box,
   TextField,
   Modal,
   Checkbox,
} from '@mui/material';

import { appSelector } from "../../../storage/Slices/AppSlice";
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../storage/store';
import { MovieGenre, MpaaRating } from '../Movie/MovieTable';


interface CoordinateFormProps {
   open: boolean;
   onClose: () => void;
}

interface FormData {
   id: number;
   budget: string;
   genre: MovieGenre | null;
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
   const {movie } = useSelector(appSelector);
   const [formData, setFormData] = useState<FormData>({
      id: 0,
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


   useEffect(() => {
      formData.id = movie === null ? 0 : movie.id;
      formData.budget = movie === null || movie.budget === null ? '' : String(movie.budget);
      formData.genre = movie === null || movie.genre === null ? '' as MovieGenre : movie.genre;
      formData.goldenPalmCount = movie === null || movie.goldenPalmCount === null ? '' : String(movie.goldenPalmCount);
      formData.length = movie === null ? '' : String(movie.length);
      formData.mpaaRating = movie === null ? '' as MpaaRating : movie.mpaaRating;
      formData.name = movie === null ? '' : movie.name;
      formData.oscarsCount = movie === null || movie.oscarsCount === null ? '' : String(movie.oscarsCount);
      formData.tagline = movie === null || movie.tagline === null ? '' : movie.tagline;
      formData.totalBoxOffice = movie === null || movie.totalBoxOffice === null ? '' : String(movie.totalBoxOffice);
      formData.usaBoxOffice = movie === null || movie.usaBoxOffice === null ? '' : String(movie.usaBoxOffice);
      formData.coordinatesId = movie === null ? '' : String(movie.coordinates.id);
      formData.directorId = movie === null ? '' : String(movie.director.id);
      formData.operatorId = movie === null || movie.operator === null ? '' : String(movie.operator.id);
      formData.screenwriterId = movie === null || movie.screenwriter === null ? '' : String(movie.screenwriter.id);
      formData.adminCanModify = movie === null ? false : movie.adminCanModify;
   }, [dispatch, movie]);


   
   return (
      <>
         <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="movie-form-modal"
            aria-describedby="movie-form-description"
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

            >
               <TextField
                  margin="dense"
                  type='text'
                  fullWidth
                  id="genre"
                  name="genre"
                  autoComplete="genre"
                  autoFocus
                  label="Budget"
                  variant='standard'
                  defaultValue={""}
                  value={formData.budget}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  placeholder='Budget (Positive)'
               />

               <TextField
                  margin="dense"
                  type='text'
                  variant='standard'
                  fullWidth
                  id="genre"
                  name="genre"
                  autoComplete="genre"
                  autoFocus
                  label="Movie Genre"
                  defaultValue={""}
                  value={formData.genre}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               />
               <TextField
                  margin="dense"
                  type='number'
                  fullWidth
                  id="goldenPalmCount"
                  name="goldenPalmCount"
                  autoComplete="goldenPalmCount"
                  autoFocus
                  label="Golden Palm Count"
                  variant='standard'
                  value={formData.goldenPalmCount}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  
                  placeholder='Golden Palm Count (Positive)'
               />
               <TextField
                  margin="dense"
                  type='number'
                  fullWidth
                  id="length"
                  name="length"
                  autoComplete="length"
                  autoFocus
                  label="Length"
                  variant='standard'
                  value={formData.length}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  
                  placeholder='Length (Positive, Not NULL)'
               />
               <TextField
                  margin="dense"
                  type='text'
                  variant='standard'
                  fullWidth
                  id="mpaaRating"
                  name="mpaaRating"
                  autoComplete="mpaaRating"
                  autoFocus
                  label="Mpaa Rating"
                  defaultValue={""}
                  value={formData.mpaaRating}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               />
               <TextField
                  margin="dense"
                  type='text'
                  required
                  fullWidth
                  id="name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  label="Name"
                  variant='standard'
                  value={formData.name}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  placeholder='Name (Not NULL)'
               />
               <TextField
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="oscarsCount"
                  name="oscarsCount"
                  autoComplete="oscarsCount"
                  autoFocus
                  label="Oscars Count"
                  variant='standard'
                  value={formData.oscarsCount}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  
                  placeholder='Oscars Count (Positive)'
               />
               <TextField
                  margin="dense"
                  type='text'
                  required
                  fullWidth
                  id="tagline"
                  name="tagline"
                  autoComplete="tagline"
                  autoFocus
                  label="Tagline"
                  variant='standard'
                  value={formData.tagline}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  placeholder='Tagline'
               />
               <TextField
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="totalBoxOffice"
                  name="totalBoxOffice"
                  autoComplete="totalBoxOffice"
                  autoFocus
                  label="Total Box Office"
                  variant='standard'
                  value={formData.totalBoxOffice}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  
                  placeholder='Total Box Office (Positive)'
               />
               <TextField
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="usaBoxOffice"
                  name="usaBoxOffice"
                  autoComplete="usaBoxOffice"
                  autoFocus
                  label="Usa Box Office"
                  variant='standard'
                  value={formData.usaBoxOffice}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  
                  placeholder='Usa Box Office (Positive)'
               />
               <TextField
                  margin="dense"
                  type='text'
                  variant='standard'
                  fullWidth
                  id="coordinatesId"
                  name="coordinatesId"
                  autoComplete="coordinatesId"
                  autoFocus
                  label="Coordinates ID"
                  defaultValue={""}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  value={formData.coordinatesId}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               />
               <TextField
                  margin="dense"
                  type='text'
                  variant='standard'
                  fullWidth
                  id="directorId"
                  name="directorId"
                  autoComplete="directorId"
                  autoFocus
                  label="Director ID"
                  defaultValue={""}
                  value={formData.directorId}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               />
               <TextField
                  margin="dense"
                  type='text'
                  variant='standard'
                  fullWidth
                  id="operatorId"
                  name="operatorId"
                  autoComplete="operatorId"
                  autoFocus
                  label="Operator ID"
                  defaultValue={""}
                  value={formData.operatorId}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               />
               <TextField
                  margin="dense"
                  type='text'
                  variant='standard'
                  fullWidth
                  id="screenwriterId"
                  name="screenwriterId"
                  autoComplete="screenwriterId"
                  autoFocus
                  label="Screenwriter ID"
                  defaultValue={""}
                  value={formData.screenwriterId}
                  slotProps={{
                     input: {
                        readOnly: true,
                     },
                  }}
                  color='primary'
                  sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
               />

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
                     checked={formData.adminCanModify}

                     sx={{ color: 'white', mb: 1, WebkitTextFillColor: 'white' }}
                  />
                  <label style={{
                     fontFamily: "Undertale",
                     backgroundColor: 'black',
                     color: 'white'
                  }}>
                     ADMIN CAN MODIFY
                  </label>
               </Box>
            </Box>
         </Modal>
      </>
   );
};

export default LocationForm;