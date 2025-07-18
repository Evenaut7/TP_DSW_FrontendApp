import NotFoundPage from './pages/NotFoundPage.tsx'
import HomePage from './pages/HomePage.tsx'
import Localidad from './pages/Localidad.tsx'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {path: "/", element: <HomePage/>},
  {path: "/localidad/:id", element: <Localidad/>},
  {path: "*", element: <NotFoundPage/>}
])