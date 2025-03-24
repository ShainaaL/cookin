import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [commentsByRecipe, setCommentsByRecipe] = useState({}); // Stocke les commentaires par recette
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les favoris et leurs commentaires
  useEffect(() => {
    const fetchFavoritesWithComments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token non trouvé. Redirection vers la page de connexion...');
          return;
        }

        // Récupérer les favoris
        const favoritesResponse = await axios.get('http://localhost:5001/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedFavorites = favoritesResponse.data;
        setFavorites(fetchedFavorites);

        // Récupérer les commentaires pour chaque recette favorite
        const commentPromises = fetchedFavorites.map((favorite) =>
          axios.get(`http://localhost:5001/api/comments/recipe/${favorite.id_recette}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const commentResponses = await Promise.all(commentPromises);
        const commentsData = commentResponses.reduce((acc, response, index) => {
          acc[fetchedFavorites[index].id_recette] = response.data;
          return acc;
        }, {});

        setCommentsByRecipe(commentsData); // Mise à jour des commentaires
      } catch (err) {
        console.error("Erreur lors de la récupération des favoris ou commentaires :", err);
        setError('Impossible de charger les favoris.');
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchFavoritesWithComments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container_a">
      <h1 className="text-3xl font-bold mb-6">Mes Favoris</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600">Vous n'avez aucun plat dans vos favoris.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((recipe) => (
            <div key={recipe.id_recette} className="p-4 border rounded bg-white shadow">
              {/* Image de la recette */}
              <img
                src={recipe.photo_url || '/images/default-recipe.jpg'}
                alt={recipe.titre}
                width={500}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-bold">{recipe.titre}</h2>

              {/* Section des commentaires */}
              <div className="mt-4">
                <h3 className="font-semibold text-sm">Commentaires :</h3>
                {commentsByRecipe[recipe.id_recette]?.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {commentsByRecipe[recipe.id_recette].map((comment) => (
                      <li
                        key={comment.id}
                        className="bg-gray-100 p-2 rounded border"
                      >
                        <p>{comment.contenu}</p>
                        <p className="text-xs text-gray-500">
                          Posté par : {comment.utilisateur || 'Anonyme'}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">Aucun commentaire pour cette recette.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
