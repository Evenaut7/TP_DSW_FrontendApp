import NotFoundPage from './pages/NotFoundPage.tsx';
import HomePage from './pages/HomePage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import Localidad from './pages/Localidad.tsx';
import PuntoDeInteres from './pages/PuntoDeInteres.tsx';
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';

export const router = createBrowserRouter([
  { path: '/', element: <SignUpPage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/localidad/:id', element: <Localidad /> },
  { path: '*', element: <NotFoundPage /> },
  { path: '/punto-de-interes/:id', element: <PuntoDeInteres /> },
  { path: '/login', element: <LoginPage /> }
]);
