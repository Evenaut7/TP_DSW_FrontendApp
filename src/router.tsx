import { createBrowserRouter } from 'react-router-dom';

// Pages
import NotFoundPage from '@/pages/NotFoundPage';
import WorkingOnItPage from '@/pages/WorkingOnItPage';

// Features
import { HomePage } from '@/features/home';
import { PerfilPage, FavoritosPage } from '@/features/user';
import { TagsPage } from '@/features/tags';
import { Localidad, EditLocalidad } from '@/features/localidades';
import { PDIPage, EditPDI } from '@/features/pdi';
import { CRUDProvincia } from '@/features/provincias';
import { CrudUsuarios } from '@/features/user';
import { CreatorDashboard, CreatorEventsPage } from '@/features/creator';
import MapPage from './features/map/MapPage.tsx';
import HistoriasPage from './features/historias/HistoriasPage.tsx';
import AgendaPage from './features/agenda/AgendaPage.tsx';

export const router = createBrowserRouter([
  { path: '*', element: <NotFoundPage /> },
  { path: '/', element: <HomePage /> },
  { path: '/perfil', element: <PerfilPage /> },
  { path: '/favoritos', element: <FavoritosPage /> },
  { path: '/tags', element: <TagsPage /> },
  { path: '/creator', element: <CreatorDashboard /> },
  { path: '/creator/pdi/:id/events', element: <CreatorEventsPage /> },
  { path: '/working-on-it', element: <WorkingOnItPage /> },
  { path: '/localidad/:id', element: <Localidad /> },
  { path: '/pdi/:id', element: <PDIPage /> },
  { path: '/provincias', element: <CRUDProvincia /> },
  { path: '/EditPDI/:id', element: <EditPDI /> },
  { path: '/editLocalidad/:id', element: <EditLocalidad /> },
  { path: '/map', element: <MapPage /> },
  { path: '/usuarios', element: <CrudUsuarios /> },
  { path: '/pdi/:id/historias', element: <HistoriasPage /> },
  { path: '/agenda', element: <AgendaPage /> },
]);
