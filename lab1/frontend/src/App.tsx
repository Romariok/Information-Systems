import * as React from 'react';

import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import AodIcon from '@mui/icons-material/Aod';

import {
  Link,
  Route,
  Routes,
  BrowserRouter as Router,
} from 'react-router-dom';
import { Grid, Typography } from '@mui/material';

import Error from './pages/Error.tsx'
import SignIn from './pages/SignIn.tsx';
import Register from './pages/Register.tsx';
import MainPage from './pages/MainPage.tsx';

import '/src/assets/css/main_page.css'
import MovieTable from './assets/components/MovieTable.tsx';
import CoordinatesTable from './assets/components/CoordinatesTable.tsx';
import LocationsTable from './assets/components/LocationTable.tsx';
import PersonTable from './assets/components/PersonTable.tsx';
import AdminRequestTable from './assets/components/AdminRequestTable.tsx';

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
  return (
    <Router>
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
            <ListItemLink to="/user/signIn" primary="SignIn" icon={<AccountCircleIcon color='primary' />} />
            <ListItemLink to="/user/register" primary="Register" icon={<PersonAddAltRoundedIcon color='primary' />} />
            <ListItemLink to="/app" primary="App" icon={<AodIcon color='primary' />} />
          </List>
        </Paper>
      </Box>
      <Grid container maxWidth={'xs'}>
        <Grid item sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Routes>
            <Route path="/user/signIn" element={<SignIn />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/app/*" element={<MainPage />} />
            <Route path="/error" element={<Error />} />
            <Route path="/app/movie" element={<MovieTable />} />
            <Route path="/app/coordinates" element={<CoordinatesTable />} />
            <Route path="/app/location" element={<LocationsTable />} />
            <Route path="/app/person" element={<PersonTable />} />
            <Route path="/app/admin" element={<AdminRequestTable />} />
          </Routes>
        </Grid>
      </Grid>
    </Router>
  )
}

export default App
