import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/common/RecipeCard';
import Loader from '../components/common/Loader';
import CommentForm from '../components/common/CommentForm'; // Formulaire pour ajouter un commentaire
import CommentList from '../components/common/CommentList'; // Liste des commentaires

const ContinentPage = () => {
  const { id } = useParams(); // ID du continent depuis l'URL
  const [continent, setContinent] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [commentsByRecipe, setCommentsByRecipe] = useState({}); // Stocker les commentaires par recette
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger les données du continent et des recettes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupération des détails du continent
        const continentResponse = await axios.get(`http://localhost:5001/api/continents/${id}`);
        setContinent(continentResponse.data);

        // Récupération des recettes pour le continent
        const recipesResponse = await axios.get(`http://localhost:5001/api/recipes/continent/${id}`);
        const fetchedRecipes = recipesResponse.data;
        setRecipes(fetchedRecipes);

        // Charger les commentaires pour chaque recette
        const commentsPromises = fetchedRecipes.map((recipe) =>
          axios.get(`http://localhost:5001/api/comments/recipe/${recipe.id}`)
        );
        const commentsResponses = await Promise.all(commentsPromises);
        const commentsData = commentsResponses.reduce((acc, response, index) => {
          acc[fetchedRecipes[index].id] = response.data;
          return acc;
        }, {});
        setCommentsByRecipe(commentsData);
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err);
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addToFavorites = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour ajouter une recette aux favoris.');
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:5001/api/favorites', { recipe_id: recipeId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Recette ajoutée aux favoris !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris :', error);
    }
  };

  const handleAddCommentToRecipe = async (recipeId, content) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour commenter.');
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:5001/api/comments/recipe', {
        id_recette: recipeId,
        contenu: content,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCommentsByRecipe((prev) => ({
        ...prev,
        [recipeId]: [...(prev[recipeId] || []), response.data], // Ajout du commentaire
      }));
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire :', err);
      alert('Impossible d\'ajouter le commentaire.');
    }
  };

  const handleDeleteComment = async (recipeId, commentId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/comments/${commentId}`);
      if (response.status === 200) {
        setCommentsByRecipe((prev) => ({
          ...prev,
          [recipeId]: prev[recipeId].filter((comment) => comment.id !== commentId), // Suppression locale
        }));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du commentaire :', err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-red-600 mb-4">{error}</h2>
        <p>Veuillez réessayer ultérieurement.</p>
      </div>
    );
  }

  if (!continent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl mb-4">Continent non trouvé</h2>
        <p>Nous n'avons pas pu trouver ce continent. Veuillez vérifier l'URL ou réessayer plus tard.</p>
      </div>
    );
  }

  return (
    <div className="container_a">
      {/* Titre principal */}
        <h1>{continent.nom}</h1>

      {/* Sous-titre */}
      <section className="py-8 text-center">
        <h2 className="text-3xl font-semibold mb-4">Recettes d'{continent.nom}</h2>
      </section>

      {/* Liste des recettes */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 py-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <RecipeCard recipe={recipe} onFavorite={addToFavorites} />
            <CommentList
              comments={commentsByRecipe[recipe.id] || []}
              onDelete={(commentId) => handleDeleteComment(recipe.id, commentId)}
            />
            <CommentForm onSubmit={(content) => handleAddCommentToRecipe(recipe.id, content)} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default ContinentPage;
