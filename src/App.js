import logo from './logo.svg';
import './App.css';

import Pets from './views/pets';

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
    element: <Pets></Pets>
  },
  {
    path: '/treats',
    element: <ul><li>treat1</li><li>treat2</li><li>treat3</li></ul>
  }
]);

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
