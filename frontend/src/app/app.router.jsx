import { createBrowserRouter } from 'react-router';
import Register from '../features/auth/pages/Register';
import Login from '../features/auth/pages/Login';

import AllProducts from '../features/products/pages/AllProducts';
import CreateProducts from '../features/products/pages/CreateProduct';

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <AllProducts/>
    },
    {
        path: "/products",
        element: <AllProducts/>
    },
    {
        path: "/products/create",
        element: <CreateProducts/>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
  
]);

export const Routes = routes;
