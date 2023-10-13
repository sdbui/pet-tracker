import './App.scss';

import { RouterProvider } from 'react-router-dom';
import router from './router';

import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';

function App() {
  return (
    <CssVarsProvider defaultMode='dark'>
      <CssBaseline/>
      <Sheet variant="soft">
        <div className="App">
          <PetAppBar></PetAppBar>
          <RouterProvider router={router}></RouterProvider>
        </div>
        
      </Sheet>

    </CssVarsProvider>
  );
}

function PetAppBar() {

  const { mode, setMode } = useColorScheme();

  function toggleColorScheme() {
    setMode(mode=== 'dark' ? 'light':'dark');
  }

  return (
    <Sheet sx={{display: 'flex', alignItems: 'center', padding: '10px'}}>
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
      <Button variant="solid" sx={{marginLeft: 'auto'}} onClick={toggleColorScheme}>
        {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>
    </Sheet>
  )
}

export default App;
