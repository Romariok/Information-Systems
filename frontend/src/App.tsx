import * as React from 'react';

import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import MenuIcon from '@mui/icons-material/Menu';

import {
  Link,
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import { Grid, Typography } from '@mui/material';

import Error from './pages/Error.tsx'
import SignIn from './pages/SignIn.tsx';
import Register from './pages/Register.tsx';
import MainPage from './pages/MainPage.tsx';

import '/src/assets/css/main_page.css'
import MovieTable from './assets/components/Movie/MovieTable.tsx';
import CoordinatesTable from './assets/components/Coordinates/CoordinatesTable.tsx';
import LocationsTable from './assets/components/Location/LocationTable.tsx';
import PersonTable from './assets/components/Person/PersonTable.tsx';
import AdminRequestTable from './assets/components/Admin/AdminRequestTable.tsx';
import { appSelector, clearAllStates } from './storage/Slices/AppSlice.tsx';
import { clearUserData } from './storage/Slices/LoginSlice.tsx';
import StyleButton from './assets/components/StyleButton.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './storage/store.tsx';
import SpecialFunctions from './assets/components/SpecialFunctions.tsx';
import MapPage from './assets/components/Map/MapPage.tsx';
import ImportFile from './pages/ImportFile.tsx';

interface ListItemLinkProps {
  icon?: React.ReactElement<unknown>;
  primary: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  return (
    <ListItemButton component={Link} to={to} onClick={switchPlay}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItemButton>
  );
}

const switchTabs = new Audio('src/assets/sounds/switch_tabs.mp3');
switchTabs.volume = 0.2;
const switchPlay = () => {
  switchTabs.play();
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuth } = useSelector(appSelector);
  return (
    <Router>
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
        <label style={{
          fontFamily: "Undertale",
          backgroundColor: 'black',
          color: 'white',
          padding: 5,
          borderRadius: 5,
          // alignItems: 'flex-end',
          flexDirection: 'column',
          display: 'flex',
        }}>
          LOGIN STATUS: <label style={{ color: "orange" }}>{isAuth ? "LOGGED IN AS" + " " + localStorage.getItem('username')
            : "NOT LOGGED IN"}</label>
          <br />
          <label style={{ color: "white" }}>{isAuth ? " ROLE: " : ""}</label>
          <label style={{ color: "orange" }}>{isAuth ? localStorage.getItem('role') : ""}</label>
        </label>

      </div>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={1} >
          <List aria-label="main sections" sx={{
            color: 'white',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            scale: "130%"
          }}>
            <ListItemLink to="/app" primary="App" icon={<MenuIcon color='primary' />} />
            {!isAuth && <><ListItemLink to="/user/signIn" primary="SignIn" icon={<AccountCircleIcon color='primary' />} />
              <ListItemLink to="/user/register" primary="Register" icon={<PersonAddAltRoundedIcon color='primary' />} /></>}
            {isAuth && <>        <StyleButton text="LOGOUT"
              disabled={!isAuth}
              onclick={() => {
                dispatch(clearAllStates());
                dispatch(clearUserData());
              }}
              type="button"
            /></>}
          </List>
        </Paper>
      </Box>
      <Grid container maxWidth={'xs'}>
        <Grid item sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Routes>
            <Route path="/user/signIn" element={<SignIn />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/app/*" element={<MainPage />} />
            <Route path="/app/movie" element={<MovieTable />} />
            <Route path="/app/coordinates" element={<CoordinatesTable />} />
            <Route path="/app/location" element={<LocationsTable />} />
            <Route path="/app/person" element={<PersonTable />} />
            <Route path="/app/admin" element={<AdminRequestTable />} />
            <Route path="/app/special" element={<SpecialFunctions />} />
            <Route path="/app/map" element={<MapPage />} />
            <Route path="/app/import" element={<ImportFile />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </Grid>
      </Grid>
    </Router>
  )
}

export default App
