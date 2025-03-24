import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Créer le contexte et l'exporter
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Informations sur l'utilisateur
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Statut d'authentification
  const [loading, setLoading] = useState(true); // Indicateur de chargement

  // Vérification de l'authentification lors du chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('http://localhost:5001/api/users/profile'); // Récupère les infos utilisateur
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Erreur vérification auth:", error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false); // Arrête le chargement une fois l'auth vérifiée
    };

    checkAuth();
  }, []);

  // Fonction pour se connecter
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', { 
        email, 
        mdp: password 
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const userResponse = await axios.get('http://localhost:5001/api/users/profile');
      setUser(userResponse.data); // Définit les informations utilisateur
      setIsAuthenticated(true);
      return response.data; // Retourne les données utilisateur
    } catch (error) {
      console.error("Erreur login:", error);
      throw error; // Lance une exception pour gérer l'erreur dans le composant parent
    }
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user && user.role === 'admin'; // Retourne true si l'utilisateur est admin
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout, 
      isAdmin // Ajoute isAdmin au contexte
    }}>
      {children}
    </AuthContext.Provider>
  );
};
