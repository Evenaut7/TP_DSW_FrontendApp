import NotFoundPage from './pages/NotFoundPage.tsx';
import HomePage from './pages/HomePage.tsx';
import Localidad from './pages/Localidad.tsx';
import { createBrowserRouter } from 'react-router-dom';
import PDIPage from './pages/PDIPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import CreatePuntoDeInteres from './pages/CreatePDI.tsx';
import ProvinciaPage from './pages/CRUDProvincia.tsx';
import CRUDLocalidadPage from './pages/CRUDLocalidad.tsx';
import EditPDI from './pages/EditPDI.tsx';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/localidad/:id', element: <Localidad /> },
  { path: '*', element: <NotFoundPage /> },
  { path: '/pdi/:id', element: <PDIPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/CreatePDI', element: <CreatePuntoDeInteres /> },
  { path: '/provincias', element: <ProvinciaPage /> },
  { path: '/CRUDlocalidad/:id', element: <CRUDLocalidadPage /> },
  { path: '/EditPDI/:id', element: <EditPDI /> },
]);
