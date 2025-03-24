import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Ajouter des logs pour le débogage
  console.log("PrivateRoute - isAuthenticated:", isAuthenticated);
  console.log("PrivateRoute - loading:", loading);
  
  // Attendre que la vérification d'authentification soit terminée
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Afficher le composant enfant si authentifié
  return children;
};

export default PrivateRoute;