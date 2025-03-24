import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false); // Contrôle du menu déroulant "Profil"

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-indigo-600 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo et navigation principale */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link to="/">
              <img src="/images/logo.png" width="200px" alt="Cookin' Logo" className="h-8" />
            </Link>

            {/* Navigation principale */}
            <nav className="flex space-x-6">
              <Link to="/" className="text-white hover:text-indigo-200">Accueil</Link>
              <Link to="/continent/1" className="text-white hover:text-indigo-200">Europe</Link>
              <Link to="/continent/2" className="text-white hover:text-indigo-200">Asie</Link>
              <Link to="/continent/3" className="text-white hover:text-indigo-200">Afrique</Link>
              <Link to="/continent/4" className="text-white hover:text-indigo-200">Amérique du Nord</Link>
              <Link to="/continent/5" className="text-white hover:text-indigo-200">Amérique du Sud</Link>
              <Link to="/continent/6" className="text-white hover:text-indigo-200">Océanie</Link>
            </nav>
          </div>

          {/* Section utilisateur à l'extrême droite */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Profil avec menu déroulant si connecté
              <div className="relative">
                <span
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="cursor-pointer text-white hover:text-indigo-200"
                >
                  Profil
                </span>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                      onClick={() => setMenuOpen(false)}
                    > Voir Profil </Link>
                    <span
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 cursor-pointer"
                    > Déconnexion
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Connexion et Inscription si non connecté
              <>
                <Link to="/login" className="text-white hover:text-indigo-200">
                  Connexion </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-indigo-200"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
