import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe, onFavorite }) => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/recipes/${recipe.id}`); // Redirige vers la page de la recette avec l'ID
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img 
        src={recipe.photo_url} 
        alt={recipe.titre} 
        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={handleImageClick} // Ajout de l'événement de clic
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{recipe.titre}</h3>
        <p className="text-gray-600 text-sm">{recipe.description}</p>
        <button 
          onClick={() => onFavorite(recipe.id)}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        >
          Ajouter aux favoris
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
