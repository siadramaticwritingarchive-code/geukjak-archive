import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './app/router';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />

      <Toaster
        richColors
        position="top-center"
        closeButton
      />
    </AuthProvider>
  </StrictMode>,
);
