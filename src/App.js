import './App.scss';

import { RouterProvider } from 'react-router-dom';
import router from './router';

import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import {CssVarsProvider} from '@mui/joy/styles';

function App() {
  return (
    <CssVarsProvider>
      <div className="App">
        <PetAppBar></PetAppBar>
        <RouterProvider router={router}></RouterProvider>
      </div>

    </CssVarsProvider>
  );
}

function PetAppBar() {
  return (
    <div>
      <Typography>
        PET TRACKER
      </Typography>
      <Breadcrumbs sx={{color: 'white'}} separator="|">
        <Link sx={{color: 'white'}} onClick={()=> router.navigate('/pets')}>
          <Typography>PETS</Typography>
        </Link>
        <Link sx={{color: 'white'}} onClick={()=> router.navigate('/treats')}>
          <Typography>TREATS</Typography>
        </Link>
      </Breadcrumbs>
    </div>
  )
}

export default App;
