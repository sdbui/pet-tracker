import {
    createBrowserRouter,
    redirect,
} from 'react-router-dom';

import Pets, { petsLoader } from './views/pets';
import Treats, { treatsLoader } from './views/treats';

const router = createBrowserRouter([
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
    {
        path: '*',
        loader: () => {
        return redirect('/pets');
        }
    }
]);

export default router;