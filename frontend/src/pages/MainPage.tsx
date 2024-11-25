import {
  Link,

} from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { appSelector, clearState, getAdminRequest, getCoordinates, getLocation, getMovie, getMovieAll, getPerson, getUserRole } from "../storage/Slices/AppSlice";

import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import { Grid, Paper } from '@mui/material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import '/src/assets/css/main_page.css'

import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'; //Coordinate
import AddLocationIcon from '@mui/icons-material/AddLocation'; // Location
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MapIcon from '@mui/icons-material/Map';
import PublishIcon from '@mui/icons-material/Publish';
import { AppDispatch } from '../storage/store';
import React, { useEffect } from 'react';

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
  const { coordinatesPage, locationPage, personPage, moviePage, adminRequestPage } = useSelector(appSelector);


  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearState());
      dispatch(getCoordinates(coordinatesPage));
      dispatch(getLocation(locationPage));
      dispatch(getPerson(personPage));
      dispatch(getMovie(moviePage));
      dispatch(getMovieAll());
      dispatch(getAdminRequest(adminRequestPage));

      if (localStorage.getItem('username') !== undefined && localStorage.getItem('username') !== null) {
        dispatch(getUserRole(localStorage.getItem('username') as string));
      }
      const sock = new SockJS("http://localhost:5252/ws");
      const stompClient = Stomp.over(sock);
      stompClient.connect({
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }
      }, () => {
        stompClient.subscribe("/topic", (message) => {
          dispatch(getCoordinates(coordinatesPage));
          dispatch(getLocation(locationPage));
          dispatch(getPerson(personPage));
          dispatch(getMovie(moviePage));
          dispatch(getMovieAll());
          dispatch(getAdminRequest(adminRequestPage));
        },
          {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          }
        )
      })
    }, 1000);
  }, []);

  return (
    <>

      <Paper elevation={0} sx={{ backgroundColor: 'black', pt: "20%" }}>
        <List sx={{
          color: 'white',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          scale: "200%",
        }}>
          <Grid container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Grid item sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <ListItemLink to="/app/movie" primary="Movie" icon={<MovieCreationIcon color='primary' />} />
              <ListItemLink to="/app/location" primary="Location" icon={<AddLocationIcon color='primary' />} />
              <ListItemLink to="/app/coordinates" primary="Coordinates" icon={<AddLocationAltIcon color='primary' />} />
            </Grid>
            <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <ListItemLink to="/app/person" primary="Person" icon={<PersonAddIcon color='primary' />} />
              <ListItemLink to="/app/admin" primary="Admin Requests" icon={<AddModeratorIcon color='primary' />} />
              <ListItemLink to="/app/special" primary="Special Functions" icon={<MoreHorizIcon color='primary' />} />
            </Grid>
            <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <ListItemLink to="/app/import" primary="Import" icon={<PublishIcon color='primary' />} />
              <ListItemLink to="/app/map" primary="Map" icon={<MapIcon color='primary' />} />
            </Grid>

          </Grid>

        </List>
      </Paper>
    </>
  )
}
export default MainPage