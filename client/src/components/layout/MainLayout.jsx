import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();

  // Vérifie si la route est "register" ou "login", dans ce cas le footer ne sera pas affiché
  const showFooter = location.pathname !== '/register' && location.pathname !== '/login' && location.pathname !== '/profile' && location.pathname !== '/legal' && location.pathname !== '/about' && location.pathname !== '/favorites' && location.pathname !== '/update-email';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Affichage du Footer uniquement si la route n'est ni /register ni /login */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;

