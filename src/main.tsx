import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Toaster } from 'react-hot-toast';
import ErrorModalManager from '@/components/modals/ErrorModal/ErrorModal';
import 'maplibre-gl/dist/maplibre-gl.css';
import { router } from './router.tsx';
import { UserProvider } from '@/features/user';
import { ThemeProvider } from './context/ThemeContext';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
      <ErrorModalManager />
    </UserProvider>
  </ThemeProvider>,
);
