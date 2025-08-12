import NotFoundPage from './pages/NotFoundPage.tsx';
import HomePage from './pages/HomePage.tsx';
import Localidad from './pages/Localidad.tsx';
import PuntoDeInteres from './pages/PuntoDeInteres.tsx';
import { createBrowserRouter } from 'react-router-dom';
import CreatePuntoDeInteres from './pages/CreatePDI.tsx';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/localidad/:id', element: <Localidad /> },
  { path: '*', element: <NotFoundPage /> },
  { path: '/punto-de-interes/:id', element: <PuntoDeInteres /> },
  { path: '/CreatePDI', element: <CreatePuntoDeInteres /> },
]);
