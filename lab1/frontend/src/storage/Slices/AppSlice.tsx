import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../store";
import { MovieGenre, MpaaRating } from "../../assets/components/MovieTable";
import { Color, Nationality } from "../../assets/components/Person/PersonTable";

import { LocationsArray } from "../../assets/components/Location/LocationTable";
import { CoordinatesArray } from "../../assets/components/Coordinates/CoordinatesTable";
import { AdminRequestArray } from "../../assets/components/AdminRequestTable";
import { MovieArray } from "../../assets/components/MovieTable";
import { PersonArray } from "../../assets/components/Person/PersonTable";

export interface ICoordinate {
   id: number,
   x: number,
   y: number,
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
   y: number,
   z: number,
   adminCanModify: boolean,
   userId: number;
}

export interface ISendLocation {
   name: string,
   x: number,
   y: number,
   z: number,
   adminCanModify: boolean;
}

export interface IUpdateLocation {
   id: number,
   name: string,
   x: number,
   y: number,
   z: number,
   adminCanModify: boolean;
}

export interface IMovie {
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
   adminCanModify: boolean;
}

export interface IUpdateMovie {
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
}

export interface IPerson {
   id: number;
   eyeColor: Color;
   hairColor: Color;
   name: string;
   nationality: Nationality;
   weight: number;
   locationId: number;
   adminCanModify: boolean;
   userId: number;
}

export interface ISendPerson {
   eyeColor: Color;
   hairColor: Color;
   name: string;
   nationality: Nationality;
   weight: number;
   locationId: number;
   adminCanModify: boolean;
}

export interface IUpdatePerson {
   id: number;
   eyeColor: Color;
   hairColor: Color;
   name: string;
   nationality: Nationality;
   weight: number;
   locationId: number;
   adminCanModify: boolean;
}

interface IAdminRequest {
   id: number,
   userId: number;
}





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
   movie: IMovie | null
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
         const link = "http://localhost:8080/coordinates";

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
         const link = `http://localhost:8080/coordinates`;
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
         const link = `http://localhost:8080/coordinates/${id}`;
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
         const link = `http://localhost:8080/coordinates/${id}`;
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
         const link = "http://localhost:8080/location";

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
   "app/coordinates/sendLocation",
   async ({ name, x, y, z, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:8080/location`;
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
         const link = `http://localhost:8080/location/${id}`;
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
         const link = `http://localhost:8080/location/${id}`;
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
         const link = "http://localhost:8080/person";

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
         const link = `http://localhost:8080/person`;
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
         const link = `http://localhost:8080/person/${id}`;
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
         const link = `http://localhost:8080/person/${id}`;
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

export const getMovie = createAsyncThunk<
   any,
   number,
   { rejectValue: string }
>(
   "app/getMovie",
   async (page, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = "http://localhost:8080/movie";

         const response = await axios.get<IMovie[]>(link, { params: { from: page * 10, size: 10 } });
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
   async ({budget, creationDate, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:8080/movie`;
         const params = {
            budget, creationDate, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId, adminCanModify
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
   async ({ id, budget, creationDate, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId, adminCanModify }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:8080/movie/${id}`;
         const params = {
            budget, creationDate, genre, goldenPalmCount, length, mpaaRating, name, oscarsCount, tagline, totalBoxOffice, usaBoxOffice, coordinatesId, directorId, operatorId, screenwriterId, adminCanModify
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
   "app/coordinates/sendDeleteMovie",
   async ({ id }, thunkAPI) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
         const link = `http://localhost:8080/movie/${id}`;
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
   isAuth: false,
   errorMessage: "",
   locations: [] as LocationsArray,
   persons: [] as PersonArray,
   movies: [] as MovieArray,
   adminRequest: [] as AdminRequestArray,
   coordinates: [] as CoordinatesArray,
   coordinatesPage: 0,
   coordinate: null,
   locationPage: 0,
   location: null,
   personPage: 0,
   person: null,
   moviePage: 0,
   movie: null
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

   }
})



export const { clearState, clearAllStates, setCoordinatesPage, setUpdatedCoordinate, setLocationPage, setUpdatedLocation,
   setPersonPage, setUpdatedPerson
} = AppSlice.actions;


export const appSelector = (state: RootState) => state.app;

export default AppSlice.reducer;