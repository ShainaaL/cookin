// eslint-disable-next-line no-unused-vars
import { useContext } from 'react';

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import AdminLayout from '../layout/AdminLayout';

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth;

  if (loading) {
    return <Loader />;
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  // ou vers la page d'accueil s'il n'est pas administrateur
  if (!user) {
    return <Navigate to="/login?redirect=/admin/dashboard" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est authentifié et est admin, afficher le contenu dans le layout admin
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminRoute;