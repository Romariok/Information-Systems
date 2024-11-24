import { useSelector, useDispatch } from 'react-redux';
import { appSelector } from "../../../storage/Slices/AppSlice";
import Graph from './Graph';
import { Box } from '@mui/material';

function MapPage() {
   const { moviesAll } = useSelector(appSelector);

   return (
      <>
         <Box sx={{
            mt: 1,
            background: 'white', padding: '20px', borderColor: 'white',
            borderWidth: '6px', textAlign: 'center', borderStyle: 'solid',
            marginTop: '30px', marginBottom: '30px'
         }}>
            <Graph points={moviesAll.map(movie => [movie.coordinates.x, movie.coordinates.y, movie.length, movie.userId])} 
            movies={moviesAll}/>
         </Box>
      </>
   );
}

export default MapPage