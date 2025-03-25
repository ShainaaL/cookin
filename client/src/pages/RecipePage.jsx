import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentList from '../components/common/CommentList';
import CommentForm from '../components/common/CommentForm.jsx';
import Loader from '../components/common/Loader';


const RecipePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [commentsByRecipe, setCommentsByRecipe] = useState({}); // Stocker les commentaires par recette
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer les détails de la recette
        const recipeRes = await axios.get(`http://localhost:5001/api/recipes/${id}`);
        setRecipe(recipeRes.data);

        // Récupérer les commentaires
        const commentsRes = await axios.get(`http://localhost:5001/api/comments/recipe/${id}`);
        setCommentsByRecipe(commentsRes.data);

        // Vérifier si la recette est dans les favoris (si l'utilisateur est connecté)
        if (user) {
          const token = localStorage.getItem('token');
          const favoriteRes = await axios.get(`http://localhost:5001/api/favorites/check/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFavorite(favoriteRes.data.isFavorite);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Une erreur est survenue lors du chargement des données.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleAddCommentToRecipe = async (recipeId, content) => {
    if (!user) {
      navigate('/login'); // Redirige si l'utilisateur n'est pas connecté
      return;
    }
  
    console.log('Données envoyées :', { recipeId, content }); // Ajoute ce log
  
    try {
      const response = await axios.post('http://localhost:5001/api/comments/recipe', {
        id_recette: recipeId,
        contenu: content,
      });
      setCommentsByRecipe([...commentsByRecipe, response.data]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire :', error);
    }
  };
  

  const handleDeleteComment = async (recipeId, commentId) => {
    if (!user) {
      navigate('/login'); // Redirige si l'utilisateur n'est pas connecté
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5001/api/comments/${commentId}`);
      // Met à jour les commentaires après suppression
      setCommentsByRecipe(
        commentsByRecipe.filter((comment) => comment.id !== commentId)
      );
      alert('Commentaire supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login'); // Redirige si l'utilisateur n'est pas connecté
      return;
    }
  
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5001/api/favorites/${id}`);
        setIsFavorite(false); // Met à jour l'état après suppression
        alert('Recette retirée des favoris.');
      } else {
        await axios.post(`http://localhost:5001/api/favorites`, { recipe_id: id });
        setIsFavorite(true); // Met à jour l'état après ajout
        alert('Recette ajoutée aux favoris !');
      }
    } catch (error) {
      console.error('Erreur lors de la modification des favoris :', error);
      alert('Une erreur est survenue.');
    }
  };
  

  useEffect(() => {
    const fetchComments = async () => {
      const commentsRes = await axios.get(`http://localhost:5001/api/comments/recipe/${id}`);
      const visibleComments = commentsRes.data.filter(comment => comment.is_visible);
      setCommentsByRecipe(visibleComments);
    };

    fetchComments();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (user) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/favorites/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(response.data.isFavorite); // Met à jour l'état
      }
    };
  
    checkFavorite();
  }, [id, user]);


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

if (!recipe) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl mb-4">Recette non trouvée</h2>
    </div>
  );
}

// Convertir les instructions et ingrédients en tableaux (si nécessaire)
const ingredientsList = recipe.ingredients
  ? recipe.ingredients.split('\n').filter(item => item.trim() !== '')
  : [];

const instructionsList = recipe.instructions
  ? recipe.instructions.split('\n').filter(item => item.trim() !== '')
  : [];


return (
  <div>
    {/* En-tête de la recette */}
    <div className="relative mb-8">
      <h1>{recipe.titre}</h1>
      <img
        src={recipe.photo_url}
        alt={recipe.titre}
        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
        className="w-full h-96 object-cover rounded-lg"
      />

      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={toggleFavorite}
          className={`p-3 rounded-full ${isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          disabled={!user}
          title={user ? 'Ajouter/retirer des favoris' : 'Connectez-vous pour ajouter aux favoris'}
        >
          <i className={`fas fa-heart ${isFavorite ? 'text-white' : ''}`} />Ajouter aux favoris
        </button>
      </div>
    </div>

    {/* Détails de la recette */}
    <div className="container_a">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <p className="text-lg mb-2">Origine : {recipe.origin}</p>
      <p className="text-md mb-2">Temps de préparation : {recipe.prep_time}</p>
      <p className="text-md mb-4">Niveau de difficulté : {recipe.difficulty}</p>

      <h2 className="text-2xl font-semibold mb-2">Ingrédients</h2>
      <ul className="list-disc pl-6 mb-4">
        {ingredientsList.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
      <p className="list-decimal pl-6">
        {instructionsList.map((instruction, index) => (
          <p key={index}>{instruction}</p>
        ))}
      </p>

      {/* Commentaire Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>
        <CommentList
          comments={commentsByRecipe || []} // Transmet la liste des commentaires
          onDelete={(commentId) => handleDeleteComment(recipe.id, commentId)}
        />
        <CommentForm onSubmit={(content) => handleAddCommentToRecipe(recipe.id, content)} />

      </div>
    </div>
  </div>
);
};

export default RecipePage;
