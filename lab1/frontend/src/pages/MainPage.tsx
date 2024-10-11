import Box from '@mui/material/Box';
import {
  Link,
  MemoryRouter,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { appSelector, clearState, getCoordinates } from "../storage/Slices/AppSlice";

import { StaticRouter } from 'react-router-dom/server';
import { Grid } from '@mui/material';
import { List, ListItemButton, ListItemIcon, ListItemText, Paper, Snackbar } from '@mui/material';

import '/src/assets/css/main_page.css'

import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'; //Coordinate
import AddLocationIcon from '@mui/icons-material/AddLocation'; // Location
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AppDispatch } from '../storage/store';
import React, { useState, useEffect } from 'react';


function Router(props: { children?: React.ReactNode }) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/error">{children}</StaticRouter>;
  }

  return (
    <MemoryRouter initialEntries={['/app']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

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

function MainPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuccess } = useSelector(appSelector);

  useEffect(() => {
    return () => {
      dispatch(clearState());
      dispatch(getCoordinates());
    };
  }, [isSuccess]);

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', pt: '15%', scale: "200%" }}>
        <List sx={{
          color: 'white',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          scale: "130%"
        }}>
          <Grid container>
            <Grid item>
              <ListItemLink to="/app/movie" primary="Movie" icon={<MovieCreationIcon color='primary' />} />
              <ListItemLink to="/app/location" primary="Location" icon={<AddLocationIcon color='primary' />} />
            </Grid>
            <Grid item sx={{ pl: 10 }}>
              <ListItemLink to="/app/coordinates" primary="Coordinates" icon={<AddLocationAltIcon color='primary' />} />
              <ListItemLink to="/app/person" primary="Person" icon={<PersonAddIcon color='primary' />} />
            </Grid>
          </Grid>
          <ListItemLink to="/app/admin" primary="Admin Requests" icon={<AddModeratorIcon color='primary' />} />


        </List>

      </Box>

    </>
  )
}
export default MainPage