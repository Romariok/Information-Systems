import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../store";
import { MovieGenre, MpaaRating } from "../../assets/components/MovieTable";
import { Color, Country } from "../../assets/components/PersonTable";

import { LocationsArray } from "../../assets/components/LocationTable";
import { CoordinatesArray } from "../../assets/components/CoordinatesTable";
import { AdminRequestArray } from "../../assets/components/AdminRequestTable";
import { MovieArray } from "../../assets/components/MovieTable";
import { PersonArray } from "../../assets/components/PersonTable";

interface ICoordinate {
   id: number,
   x: number,
   y: number,
   userId: number;
}

export interface ISendCoordinate {
   x: number,
   y: number | null
}

interface IAdminRequest {
   id: number,
   userId: number;
}

interface ILocation {
   id: number,
   name: string,
   x: number,
   y: number,
   z: number,
   userId: number;
}

export interface ISendLocation {
   name: string,
   x: number,
   y: number,
   z: number;
}

interface IMovie {
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
}

export interface ISendMovie {
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
}

interface IPerson {
   id: number;
   eyeColor: Color;
   hairColor: Color;
   name: string;
   country: Country;
   weight: number;
   locationId: number;
   userId: number;
}

export interface ISendPerson {
   eyeColor: Color;
   hairColor: Color;
   name: string;
   country: Country;
   weight: number;
   locationId: number;
}

interface AppState {
   isFetching: boolean,
   isSuccess: boolean,
   isError: boolean,
   errorMessage: string,
   locations: LocationsArray,
   persons: PersonArray,
   movies: MovieArray,
   adminRequest: AdminRequestArray,
   coordinates: CoordinatesArray
}

export const getCoordinates = createAsyncThunk<
   any,
   void,
   { rejectValue: string }
>(
   "app/getCoordinates",
   async (_, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:8080/coordinates";

         const response = await axios.get<ICoordinate[]>(link, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const getAdminRequest = createAsyncThunk<
   any,
   void,
   { rejectValue: string }
>(
   "app/getAdminRequest",
   async (_, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:8080/admin";

         const response = await axios.get<IAdminRequest[]>(link, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const getLocation = createAsyncThunk<
   any,
   void,
   { rejectValue: string }
>(
   "app/getLocation",
   async (_, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:8080/location";

         const response = await axios.get<ILocation[]>(link, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const getPerson = createAsyncThunk<
   any,
   void,
   { rejectValue: string }
>(
   "app/getPerson",
   async (_, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:8080/person";

         const response = await axios.get<IPerson[]>(link, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const getMovie = createAsyncThunk<
   any,
   void,
   { rejectValue: string }
>(
   "app/getMovie",
   async (_, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:8080/movie";

         const response = await axios.get<IMovie[]>(link, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const sendCoordinates = createAsyncThunk<
   ICoordinate,
   ISendCoordinate,
   { rejectValue: string }
>(
   "app/coordinates/sendCoordinates",
   async ({ x, y }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:8080/coordinates";
         const params = {
            x,
            y
         };
         const response = await axios.post(link, params, {
            headers: {
               "Authorization": 'Bearer '+String(localStorage.getItem('token'))
            }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const sendLocation = createAsyncThunk<
   ILocation,
   ISendLocation,
   { rejectValue: string }
>(
   "app/sendLocation",
   async ({ name, x, y, z }, thunkAPI) => {
      try {
         const link = "http://localhost:8080/location";
         const params = {
            name,
            x,
            y,
            z
         };
         const response = await axios.post<ILocation>(link, params, {
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const sendPerson = createAsyncThunk<
   IPerson,
   ISendPerson,
   { rejectValue: string }
>(
   "app/sendPerson",
   async ({ name, eyeColor, hairColor, country, weight, locationId }, thunkAPI) => {
      try {
         const link = "http://localhost:8080/person";
         const params = {
            name,
            eyeColor,
            hairColor,
            country,
            weight,
            locationId
         };
         const response = await axios.post<IPerson>(link, params, {
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const sendMovie = createAsyncThunk<
   IMovie,
   ISendMovie,
   { rejectValue: string }
>(
   "app/sendMovie",
   async ({ budget, creationDate, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId }, thunkAPI) => {
      try {
         const link = "http://localhost:8080/movie";
         const params = {
            budget,
            creationDate,
            genre,
            goldenPalmCount,
            length,
            mpaaRating,
            name,
            oscarsCount,
            tagline,
            totalBoxOffice,
            usaBoxOffice,
            coordinatesId,
            directorId,
            operatorId,
            screenwriterId
         };
         const response = await axios.post<IMovie>(link, params, {
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

export const sendAdminRequest = createAsyncThunk<
   IAdminRequest,
   { rejectValue: string }
>(
   "app/sendCoordinate",
   async (_, thunkAPI) => {
      try {
         const link = "http://localhost:8080/admin";
         const response = await axios.post<IAdminRequest>(link, {}, {
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
         });
         const data = response.data;
         if (response.status === 200) {
            return data;
         } else {
            return thunkAPI.rejectWithValue(data.toString());
         }
      } catch (e) {
         const error = e as AxiosError<string>;
         console.log("Error", error.response?.data);
         return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
      }
   }
);

const initialState: AppState = {
   isFetching: false,
   isSuccess: false,
   isError: false,
   errorMessage: "",
   locations: [] as LocationsArray,
   persons: [] as PersonArray,
   movies: [] as MovieArray,
   adminRequest: [] as AdminRequestArray,
   coordinates: [] as CoordinatesArray
};

export const AppSlice = createSlice({
   name: "app",
   initialState,
   reducers: {
      clearState: (state) => {
         state.isError = false;
         state.isSuccess = false;
         state.isFetching = false;
         return state
      },
      clearAllStates: (state) => {
         state.isError = false;
         state.isSuccess = false;
         state.isFetching = false;
         state.errorMessage = "";
         state.locations = [] as LocationsArray;
         state.persons = [] as PersonArray;
         state.movies = [] as MovieArray;
         state.adminRequest = [] as AdminRequestArray;
         state.coordinates = [] as CoordinatesArray
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(sendCoordinates.fulfilled, (state, action: PayloadAction<ICoordinate[]>) => {
            state.isFetching = false;
            console.log("do");
            state.coordinates = action.payload as ICoordinate[];
            console.log("posle");
            return state; 
         })
         .addCase(sendCoordinates.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
         })
         .addCase(sendCoordinates.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getCoordinates.fulfilled, (state, action: PayloadAction<ICoordinate>) => {
            state.isFetching = false;
            state.coordinates = [];
            state.coordinates.push(action.payload);
            return state;
         })
         .addCase(getCoordinates.rejected, (state, action) => {
            state.isFetching = false;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            state.coordinates = [];
         })
         .addCase(getCoordinates.pending, (state) => {
            state.isFetching = true;
         })

   }
})

export const { clearState, clearAllStates } = AppSlice.actions;

export const appSelector = (state: RootState) => state.app;

export default AppSlice.reducer;