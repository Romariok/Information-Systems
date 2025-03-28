import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../store";
import { MovieGenre, MpaaRating } from "../../assets/components/Movie/MovieTable";
import { Color, Nationality } from "../../assets/components/Person/PersonTable";

import { LocationsArray } from "../../assets/components/Location/LocationTable";
import { CoordinatesArray } from "../../assets/components/Coordinates/CoordinatesTable";
import { AdminRequestArray } from "../../assets/components/Admin/AdminRequestTable";
import { MovieArray } from "../../assets/components/Movie/MovieTable";
import { PersonArray } from "../../assets/components/Person/PersonTable";
import { ImportArray, OperationStatus } from "../../assets/components/ImportHistoryTable";

export interface ICoordinate {
   id: number,
   x: number,
   y: number | null,
   adminCanModify: boolean,
   userId: number;
}

export interface ISendCoordinate {
   x: number,
   y: number | null
   adminCanModify: boolean
}

export interface IUpdateCoordinate {
   x: number,
   y: number | null
   adminCanModify: boolean
   id: number
}

export interface ILocation {
   id: number,
   name: string,
   x: number,
   y: number | null,
   z: number,
   adminCanModify: boolean,
   userId: number;
}

export interface ISendLocation {
   name: string,
   x: number,
   y: number | null,
   z: number,
   adminCanModify: boolean;
}

export interface IUpdateLocation {
   id: number,
   name: string,
   x: number,
   y: number | null,
   z: number,
   adminCanModify: boolean;
}

export interface IMovie {
   id: number;
   budget: number | null;
   creationDate: string;
   genre: MovieGenre | null;
   goldenPalmCount: number | null;
   length: number;
   mpaaRating: MpaaRating;
   name: string;
   oscarsCount: number | null;
   tagline: string | null;
   totalBoxOffice: number | null;
   usaBoxOffice: number | null;
   coordinatesId: number | null;
   directorId: number;
   operatorId: number | null;
   screenwriterId: number | null;
   adminCanModify: boolean;
   userId: number;
}

export interface ISendMovie {
   budget: number | null;
   genre: MovieGenre | null;
   goldenPalmCount: number | null;
   length: number;
   mpaaRating: MpaaRating;
   name: string;
   oscarsCount: number | null;
   tagline: string | null;
   totalBoxOffice: number | null;
   usaBoxOffice: number | null;
   coordinatesId: number | null;
   directorId: number;
   operatorId: number | null;
   screenwriterId: number | null;
   adminCanModify: boolean;
}

export interface IUpdateMovie {
   id: number;
   budget: number | null;
   genre: MovieGenre | null;
   goldenPalmCount: number | null;
   length: number;
   mpaaRating: MpaaRating;
   name: string;
   oscarsCount: number | null;
   tagline: string | null;
   totalBoxOffice: number | null;
   usaBoxOffice: number | null;
   coordinatesId: number | null;
   directorId: number;
   operatorId: number | null;
   screenwriterId: number | null;
   adminCanModify: boolean;
}

export interface IPerson {
   id: number;
   eyeColor: Color;
   hairColor: Color | null;
   name: string;
   nationality: Nationality | null;
   weight: number;
   locationId: number | null;
   adminCanModify: boolean;
   userId: number;
}

export interface ISendPerson {
   eyeColor: Color;
   hairColor: Color | null;
   name: string;
   nationality: Nationality | null;
   weight: number;
   locationId: number | null;
   adminCanModify: boolean;
}

export interface IUpdatePerson {
   id: number;
   eyeColor: Color;
   hairColor: Color | null;
   name: string;
   nationality: Nationality | null;
   weight: number;
   locationId: number | null;
   adminCanModify: boolean;
}

interface IAdminRequest {
   id: number,
   username: string;
}

interface IRole {
   role: string;
}

export interface IImport {
   id: number;
   importStatus: OperationStatus;
   importTime: string;
   importedCount: number;
   userId: number;
   fileUrl: string;
};


interface AppState {
   isFetching: boolean,
   isSuccess: boolean,
   isError: boolean,
   isAuth: boolean,
   errorMessage: string,
   locations: LocationsArray,
   persons: PersonArray,
   movies: MovieArray,
   adminRequest: AdminRequestArray,
   coordinates: CoordinatesArray,
   coordinatesPage: number,
   coordinate: ICoordinate | null,
   locationPage: number,
   location: ILocation | null,
   personPage: number,
   person: IPerson | null,
   moviePage: number,
   movie: IMovie | null,
   adminRequestPage: number,
   moviesAll: MovieArray,
   importPage: number,
   imports: ImportArray
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getCoordinates = createAsyncThunk<
   any,
   number,
   { rejectValue: string }
>(
   "app/getCoordinates",
   async (page, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:5252/coordinates";

         const response = await axios.get<ICoordinate[]>(link, { params: { from: page * 10, size: 10 } });
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
   async ({ x, y, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/coordinates`;
         const params = {
            x,
            y,
            adminCanModify
         };
         const response = await axios.post(link, params, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const sendUpdatedCoordinates = createAsyncThunk<
   ICoordinate,
   IUpdateCoordinate,
   { rejectValue: string }
>(
   "app/coordinates/sendUpdatedCoordinates",
   async ({ id, x, y, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/coordinates/${id}`;
         const params = {
            x,
            y,
            adminCanModify
         };
         const response = await axios.patch(link, params, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const sendDeleteCoordinates = createAsyncThunk<
   ICoordinate,
   { id: number },
   { rejectValue: string }
>(
   "app/coordinates/sendDeleteCoordinates",
   async ({ id }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/coordinates/${id}`;
         const response = await axios.delete(link, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getLocation = createAsyncThunk<
   any,
   number,
   { rejectValue: string }
>(
   "app/getLocation",
   async (page, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:5252/location";

         const response = await axios.get<ILocation[]>(link, { params: { from: page * 10, size: 10 } });
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
   "app/location/sendLocation",
   async ({ name, x, y, z, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/location`;
         const params = {
            name,
            x,
            y,
            z,
            adminCanModify
         };
         const response = await axios.post(link, params, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const sendUpdatedLocation = createAsyncThunk<
   ILocation,
   IUpdateLocation,
   { rejectValue: string }
>(
   "app/coordinates/sendUpdatedLocation",
   async ({ id, name, x, y, z, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/location/${id}`;
         const params = {
            name,
            x,
            y,
            z,
            adminCanModify
         };
         const response = await axios.patch(link, params, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const sendDeleteLocation = createAsyncThunk<
   ILocation,
   { id: number },
   { rejectValue: string }
>(
   "app/coordinates/sendDeleteLocation",
   async ({ id }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/location/${id}`;
         const response = await axios.delete(link, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
// name, eyeColor, hairColor, nationality, weight, locationId

export const getPerson = createAsyncThunk<
   any,
   number,
   { rejectValue: string }
>(
   "app/getPerson",
   async (page, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:5252/person";

         const response = await axios.get<IPerson[]>(link, { params: { from: page * 10, size: 10 } });
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
   "app/coordinates/sendPerson",
   async ({ name, eyeColor, hairColor, nationality, weight, locationId, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/person`;
         const params = {
            name, eyeColor, hairColor, nationality, weight, locationId, adminCanModify
         };
         const response = await axios.post(link, params, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const sendUpdatedPerson = createAsyncThunk<
   IPerson,
   IUpdatePerson,
   { rejectValue: string }
>(
   "app/coordinates/sendUpdatedPerson",
   async ({ id, name, eyeColor, hairColor, nationality, weight, locationId, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/person/${id}`;
         const params = {
            name, eyeColor, hairColor, nationality, weight, locationId, adminCanModify
         };
         const response = await axios.patch(link, params, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const sendDeletePerson = createAsyncThunk<
   IPerson,
   { id: number },
   { rejectValue: string }
>(
   "app/coordinates/sendDeletePerson",
   async ({ id }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/person/${id}`;
         const response = await axios.delete(link, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
// budget, creationDate, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId


export const getMovie = createAsyncThunk<
   any,
   number,
   { rejectValue: string }
>(
   "app/getMovie",
   async (page, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:5252/movie";

         const response = await axios.get<IMovie[]>(link, { params: { from: page * 5, size: 5 } });
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

export const getMovieAll = createAsyncThunk<
   any,
   void,
   { rejectValue: string }
>(
   "app/getMovieAll",
   async (_, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:5252/movie/all";

         const response = await axios.get<IMovie[]>(link, {});
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
   "app/coordinates/sendMovie",
   async ({ budget, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/movie`;
         const params = {
            budget, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId, adminCanModify
         };
         const response = await axios.post(link, params, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const sendUpdatedMovie = createAsyncThunk<
   IMovie,
   IUpdateMovie,
   { rejectValue: string }
>(
   "app/coordinates/sendUpdatedMovie",
   async ({ id, budget, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/movie/${id}`;
         const params = {
            budget, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId, adminCanModify
         };
         const response = await axios.patch(link, params, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const sendDeleteMovie = createAsyncThunk<
   IMovie,
   { id: number },
   { rejectValue: string }
>(
   "app/movie/sendDeleteMovie",
   async ({ id }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/movie/${id}`;
         const response = await axios.delete(link, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

export const getAdminRequest = createAsyncThunk<
   any,
   number,
   { rejectValue: string }
>(
   "app/getAdminRequest",
   async (page, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:5252/admin";

         const response = await axios.get<IAdminRequest[]>(link, { params: { from: page * 10, size: 10 } });
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

export const getUserRole = createAsyncThunk<
   any,
   string,
   { rejectValue: string }
>(
   "app/getUserRole",
   async (username, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/user/role/${username}`;

         const response = await axios.get(link, {});
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
   any,
   void,
   { rejectValue: string }
>(
   "app/sendAdminRequest",
   async (_, thunkAPI) => {
      try {
         const link = "http://localhost:5252/admin";
         const response = await axios.post(link, {}, {
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

export const sendApproveAdminRequest = createAsyncThunk<
   any,
   { id: number },
   { rejectValue: string }
>(
   "app/admin/sendApproveAdminRequest",
   async ({ id }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/admin/${id}`;
         const response = await axios.put(link, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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

export const getImport = createAsyncThunk<
   any,
   number,
   { rejectValue: string }
>(
   "app/import",
   async (page, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:5252/import";

         const response = await axios.get<IImport[]>(link, {
            params: { from: page * 10, size: 10 }, headers: {
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

export const sendDeleteImport = createAsyncThunk<
   IImport,
   { id: number },
   { rejectValue: string }
>(
   "app/import/sendDeleteImport",
   async ({ id }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:5252/import/${id}`;
         const response = await axios.delete(link, {
            headers: {
               "Authorization": 'Bearer ' + String(localStorage.getItem('token'))
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
   isAuth: false,
   errorMessage: "",
   locations: [] as LocationsArray,
   persons: [] as PersonArray,
   movies: [] as MovieArray,
   moviesAll: [] as MovieArray,
   adminRequest: [] as AdminRequestArray,
   coordinates: [] as CoordinatesArray,
   coordinatesPage: 0,
   coordinate: null,
   locationPage: 0,
   location: null,
   personPage: 0,
   person: null,
   moviePage: 0,
   movie: null,
   adminRequestPage: 0,
   importPage: 0,
   imports: [] as ImportArray
};

export const AppSlice = createSlice({
   name: "app",
   initialState,
   reducers: {
      clearState: (state) => {
         state.isError = false;
         state.isSuccess = false;
         state.isFetching = false;
         if (localStorage.getItem('token')?.length > 0) {
            state.isAuth = true;
         }
         else {
            state.isAuth = false;
         }
         return state
      },
      clearAllStates: (state) => {
         state.isAuth = false;
         state.isError = false;
         state.isSuccess = false;
         state.isFetching = false;
         state.errorMessage = "";
         state.coordinate = null;
         state.location = null;
         state.person = null;
         state.movie = null;
      },
      setCoordinatesPage: (state, action) => {
         state.coordinatesPage = action.payload;
      },
      setUpdatedCoordinate: (state, action) => {
         state.coordinate = action.payload;
      },
      setLocationPage: (state, action) => {
         state.locationPage = action.payload;
      },
      setUpdatedLocation: (state, action) => {
         state.location = action.payload;
      },
      setPersonPage: (state, action) => {
         state.personPage = action.payload;
      },
      setUpdatedPerson: (state, action) => {
         state.person = action.payload;
      },
      setMoviePage: (state, action) => {
         state.moviePage = action.payload;
      },
      setUpdatedMovie: (state, action) => {
         state.movie = action.payload;
      },
      setAdminRequestPage: (state, action) => {
         state.adminRequestPage = action.payload;
      },
      setFetching: (state, action) => {
         state.isFetching = action.payload;
      },
      setError(state, action) {
         state.isError = action.payload;
      },
      setErrorMessage(state, action) {
         state.errorMessage = action.payload;
      },
      setSuccess(state, action) {
         state.isSuccess = action.payload;
      },
      setImportPage(state, action) {
         state.importPage = action.payload;
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(sendCoordinates.fulfilled, (state) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state;
         })
         .addCase(sendCoordinates.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendCoordinates.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendUpdatedCoordinates.fulfilled, (state) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state;
         })
         .addCase(sendUpdatedCoordinates.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendUpdatedCoordinates.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getCoordinates.fulfilled, (state, action) => {
            state.isFetching = false;
            state.coordinates = action.payload;
            return state;
         })
         .addCase(getCoordinates.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            state.coordinates = [];
         })
         .addCase(getCoordinates.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendDeleteCoordinates.fulfilled, (state) => {
            state.isFetching = false;
            return state;
         })
         .addCase(sendDeleteCoordinates.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendDeleteCoordinates.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getLocation.fulfilled, (state, action) => {
            state.isFetching = false;
            state.locations = action.payload;
            return state;
         })
         .addCase(getLocation.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            state.locations = [];
         })
         .addCase(getLocation.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendLocation.fulfilled, (state) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state;
         })
         .addCase(sendLocation.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendLocation.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendUpdatedLocation.fulfilled, (state) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state;
         })
         .addCase(sendUpdatedLocation.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendUpdatedLocation.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendDeleteLocation.fulfilled, (state) => {
            state.isFetching = false;
            return state;
         })
         .addCase(sendDeleteLocation.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendDeleteLocation.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendPerson.fulfilled, (state) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state;
         })
         .addCase(sendPerson.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendPerson.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendUpdatedPerson.fulfilled, (state) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state;
         })
         .addCase(sendUpdatedPerson.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendUpdatedPerson.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendDeletePerson.fulfilled, (state) => {
            state.isFetching = false;
            return state;
         })
         .addCase(sendDeletePerson.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendDeletePerson.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getPerson.fulfilled, (state, action) => {
            state.isFetching = false;
            state.persons = action.payload;
            return state;
         })
         .addCase(getPerson.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            state.persons = [];
         })
         .addCase(getPerson.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getMovie.fulfilled, (state, action) => {
            state.isFetching = false;
            state.movies = action.payload;
            return state;
         })
         .addCase(getMovie.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            state.movies = [];
         })
         .addCase(getMovie.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendMovie.fulfilled, (state) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state;
         })
         .addCase(sendMovie.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendMovie.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendUpdatedMovie.fulfilled, (state) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state;
         })
         .addCase(sendUpdatedMovie.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendUpdatedMovie.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendDeleteMovie.fulfilled, (state) => {
            state.isFetching = false;
            return state;
         })
         .addCase(sendDeleteMovie.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendDeleteMovie.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getAdminRequest.fulfilled, (state, action) => {
            state.isFetching = false;
            state.adminRequest = action.payload;
            return state;
         })
         .addCase(getAdminRequest.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            state.adminRequest = [];
         })
         .addCase(getAdminRequest.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendAdminRequest.fulfilled, (state) => {
            state.isFetching = false;
            return state;
         })
         .addCase(sendAdminRequest.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendAdminRequest.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendApproveAdminRequest.fulfilled, (state) => {
            state.isFetching = false;
            return state;
         })
         .addCase(sendApproveAdminRequest.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            }
         })
         .addCase(sendApproveAdminRequest.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getUserRole.fulfilled, (state, action) => {
            state.isFetching = false;
            localStorage.setItem('role', action.payload);
            return state;
         })
         .addCase(getUserRole.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
         })
         .addCase(getUserRole.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getMovieAll.fulfilled, (state, action) => {
            state.isFetching = false;
            state.moviesAll = action.payload;
            return state;
         })
         .addCase(getMovieAll.rejected, (state) => {
            state.isFetching = false;
            state.moviesAll = [];
         })
         .addCase(getMovieAll.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(getImport.fulfilled, (state, action) => {
            state.isFetching = false;
            state.imports = action.payload;
            return state;
         })
         .addCase(getImport.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = (action.payload as { message?: string }).message || "An error occurred";
            state.imports = [];
         })
         .addCase(getImport.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(sendDeleteImport.fulfilled, (state) => {
            state.isFetching = false;
            return state;
         })
         .addCase(sendDeleteImport.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            if (action?.payload?.status == 500) {
               state.errorMessage = "You have no rights to commit this!";
            }
            else if (action?.payload?.status == 400) {
               state.errorMessage = "Invalid parameters!";
            }
            else {
               state.errorMessage = (action.payload as { data?: string }).data || "An error occurred";
            }
         })
         .addCase(sendDeleteImport.pending, (state) => {
            state.isFetching = true;
         })
   }
})



export const { clearState, clearAllStates, setCoordinatesPage, setUpdatedCoordinate, setLocationPage, setUpdatedLocation,
   setPersonPage, setUpdatedPerson, setMoviePage, setUpdatedMovie, setAdminRequestPage, setFetching, setError, setErrorMessage,
   setSuccess, setImportPage
} = AppSlice.actions;


export const appSelector = (state: RootState) => state.app;

export default AppSlice.reducer;