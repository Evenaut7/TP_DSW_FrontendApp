import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/react-router';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//pages
import NotFoundPage from './pages/NotFoundPage.tsx';
import HomePage from './pages/HomePage.tsx';
import Localidad from './pages/Localidad.tsx';
import PuntoDeInteres from './pages/PuntoDeInteres.tsx';
// import LoginPage from './pages/LoginPage.tsx';
// import SignUpPage from './pages/SignUpPage.tsx';
import CreatePuntoDeInteres from './pages/CreatePDI.tsx';
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInUrl='/login'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          {/* <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} /> */}
          <Route path='/localidad/:id' element={<Localidad />} />
          <Route path='/punto-de-interes/:id' element={<PuntoDeInteres />} />
          <Route path='/CreatePDI' element={<CreatePuntoDeInteres />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
