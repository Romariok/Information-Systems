import React, { useEffect, useState } from 'react';
import {
   Box,
   Input,
   Modal,
   Snackbar,
   Alert,
   Checkbox
} from '@mui/material';
import { appSelector, clearState, IUpdateCoordinate, sendUpdatedCoordinates } from "../../../storage/Slices/AppSlice";
import { useDispatch, useSelector } from 'react-redux';
import StyleButton from '../StyleButton';
import { AppDispatch } from '../../../storage/store';


interface CoordinateFormProps {
   open: boolean;
   onClose: () => void;
}

interface FormData {
   id: number;
   x: string;
   y: string | null;
   adminCanModify: boolean;
}


const CoordinateUpdateForm: React.FC<CoordinateFormProps> = ({ open, onClose }) => {
   const dispatch = useDispatch<AppDispatch>();
   const { isFetching, isSuccess, isError, errorMessage, coordinate } = useSelector(appSelector);
   const [openError, setOpenError] = useState<boolean>(false);
   const [formData, setFormData] = useState<FormData>({
      id: 0,
      x: '',
      y: '',
      adminCanModify: false
   });

   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newData = {
         id: coordinate?.id,
         x: Number(formData.x),
         y: formData.y === '' ? null : Number(formData.y),
         adminCanModify: formData.adminCanModify
      };
      dispatch(sendUpdatedCoordinates(newData as IUpdateCoordinate));
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === 'adminCanModify') {
         setFormData((prevState) => ({
            ...prevState,
            [name]: e.target.checked,
         }));
      }
      else {
         setFormData((prevState) => ({
            ...prevState,
            [name]: value
         }));
      }

   };

   useEffect(() => {
      formData.id = coordinate === null ? 0 : coordinate.id;
      formData.x = coordinate === null ? '' : String(coordinate.x);
      formData.y = coordinate === null ? '' : String(coordinate.y);
      formData.adminCanModify = coordinate === null ? false : coordinate.adminCanModify;

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
         console.log("Coordinate Succesfully Updated");
         onClose();
         dispatch(clearState());
      }
   }, [isError, isSuccess, dispatch, coordinate]);

   return (
      <>
         <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="coordinate-form-modal"
            aria-describedby="coordinate-form-description"
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
                  id="x"
                  name="x"
                  autoComplete="x"
                  autoFocus
                  value={formData.x}
                  onChange={handleChange}
                  inputProps={{ min: -500, max: 500 }}
                  sx={{ color: 'white', mb: 1 }}
                  placeholder='X in (-500;500) Float Not NULL'
               />
               <Input
                  margin="dense"
                  type='number'
                  required
                  fullWidth
                  id="y"
                  name="y"
                  autoComplete="y"
                  autoFocus
                  value={formData.y}
                  onChange={handleChange}
                  sx={{ color: 'white', mb: 1 }}
                  inputProps={{ min: -500, max: 500 }}
                  placeholder='Y in (-500;500)'
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
                     onChange={handleChange}
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


               <StyleButton text="Update coordinate"
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

export default CoordinateUpdateForm;