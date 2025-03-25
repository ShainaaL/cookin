import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');

  // Récupérer les informations utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login'); // Redirige si non connecté
        return;
      }

      try {
        // Récupération des données utilisateur
        const response = await axios.get('http://localhost:5001/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur :', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Récupération des favoris
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des favoris :', err);
        setError('Impossible de récupérer vos favoris.');
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/user/comments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserComments(response.data); // Met à jour les commentaires utilisateur
      } catch (err) {
        console.error('Erreur lors de la récupération des commentaires :', err);
        setError('Erreur lors du chargement des commentaires.');
      }
    };

    fetchUserComments();
  }, []);

  useEffect(() => {
    const updateUserData = async () => {
      const token = localStorage.getItem('token'); // Récupère le token pour l'authentification
  
      if (token) {
        try {
          const response = await axios.get('http://localhost:5001/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // Mets à jour l'état utilisateur
        } catch (err) {
          console.error('Erreur lors de la récupération des données utilisateur mises à jour :', err);
        }
      }
    };
  
    updateUserData(); // Récupère les données mises à jour
  }, []);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur : {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Mon Profil</h1>

        {/* Informations utilisateur */}
        <div className="profile-info space-y-4">
          <div className="border-b pb-2">
            <p className="text-gray-600">Nom</p>
            <p className="font-semibold">{user.nom}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">Prénom</p>
            <p className="font-semibold">{user.prenom}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{user.email}</p>
            <button
        onClick={() => navigate('/update-email')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
      >
        Modifier l'email
      </button>
          </div>
        </div>
        <div className="container mx-auto py-10">
      
      <p>Email actuel : {user.email}</p>
      
    </div>

        {/* Bouton déconnexion */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Favoris */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">Mes Favoris</h2>
        {favorites.length === 0 ? (
          <p>Aucun favori pour le moment.</p>
        ) : (
          <>
            <ul>
              {favorites.slice(0, 3).map((favorite) => (
                <li key={favorite.id_recette} className="mb-2">
                  <div className="flex items-center space-x-4">
                    <p>{favorite.titre}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <a href="/favorites" className="text-blue-500 underline">
                Voir tous mes favoris
              </a>
            </div>
          </>
        )}
    </div>
    {/* Section des commentaires */}
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
    <h2 className="text-2xl font-bold mb-4">Mes Commentaires</h2>
    {userComments.length === 0 ? (
      <p>Aucun commentaire pour le moment.</p>
    ) : (
      <ul className="space-y-2">
        {userComments.map((comment) => (
          <li key={comment.id} className="p-4 border rounded bg-gray-50">
            <p>{comment.contenu}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
);
};


export default ProfilePage;
