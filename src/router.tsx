import NotFoundPage from './pages/NotFoundPage.tsx';
import HomePage from './pages/HomePage.tsx';
import Localidad from './pages/Localidad.tsx';
import { createBrowserRouter } from 'react-router-dom';
import PDIPage from './pages/PDIPage.tsx';
import CreatePuntoDeInteres from './pages/CreatePDI.tsx';
import ProvinciaPage from './pages/CRUDProvincia.tsx';
import CRUDLocalidadPage from './pages/CRUDLocalidad.tsx';
import EditPDI from './pages/EditPDI.tsx';
import EditLocalidad from './pages/EditLocalidad.tsx';
import PerfilPage from './pages/PerfilPage.tsx';

export const router = createBrowserRouter([
  { path: '*', element: <NotFoundPage /> },
  { path: '/', element: <HomePage /> },
  { path: '/perfil', element: <PerfilPage /> },
  { path: '/localidad/:id', element: <Localidad /> },
  { path: '/pdi/:id', element: <PDIPage /> },
  { path: '/CreatePDI', element: <CreatePuntoDeInteres /> },
  { path: '/provincias', element: <ProvinciaPage /> },
  { path: '/CRUDlocalidad/:id', element: <CRUDLocalidadPage /> },
  { path: '/EditPDI/:id', element: <EditPDI /> },
  { path: '/editLocalidad/:id', element: <EditLocalidad /> },
]);
