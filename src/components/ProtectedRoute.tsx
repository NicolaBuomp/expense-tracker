// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth()!;

  if (loading) {
    // Mostra uno spinner o un messaggio di caricamento mentre l'utente viene autenticato
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // Se l'utente non è autenticato, reindirizza alla pagina di login
    return <Navigate to="/login" replace />;
  }

  // Se l'utente è autenticato, visualizza il componente figlio
  return children;
};

export default ProtectedRoute;
