import logo from './logo.svg';
import './App.scss';

import Pets, { petsLoader } from './views/pets';
import Treats, { treatsLoader } from './views/treats';

import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello router root path</div>
  },
  {
    path: '/pets',
    element: <Pets></Pets>,
    loader: petsLoader,
  },
  {
    path: '/treats',
    element: <Treats></Treats>,
    loader: treatsLoader,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
