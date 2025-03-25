import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages publiques
import HomePage from './pages/HomePage';
import ContinentPage from './pages/ContinentPage';
import RecipePage from './pages/RecipePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import FavoritesPage from './pages/FavoritesPage'
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import UpdateEmailPage from './pages/UpdateEmailPage';

// Pages admin
import AdminDashboard from './pages/admin/DashboardPage';
import AdminRecipes from './pages/admin/RecipesPage';
import AdminUsers from './pages/admin/UsersPage';
import AdminComments from './pages/admin/CommentsPage';

// Middleware
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';

function App() {
  const {user} = useAuth();
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="continent/:id" element={<ContinentPage />} />
            <Route path="recipes/:id" element={<RecipePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="/update-email" element={<UpdateEmailPage user={user} />} />
            <Route path="/favorites" element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Routes administratives */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="recipes" element={<AdminRecipes />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="comments" element={<AdminComments />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
