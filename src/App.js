import './App.scss';

import { RouterProvider } from 'react-router-dom';
import router from './router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Typography, Box, Button } from '@mui/material';

function App() {
  return (
    <div className="App">
      <PetAppBar></PetAppBar>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

function PetAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>
          PET TRACKER
        </Typography>
        <Box sx={{flexGrow: 1, display: 'flex'}}>
          <Button sx={{color: 'white'}} onClick={()=> router.navigate('/pets')}>PETS</Button>
          <Button sx={{color: 'white'}} onClick={()=> router.navigate('/treats')}>TREATS</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default App;
