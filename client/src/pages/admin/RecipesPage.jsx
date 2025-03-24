// src/components/RecipeCard.js
import React from 'react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.image_url} alt={recipe.title}   style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}className="recipe-image" />
      <h3 className="recipe-title">{recipe.title}</h3>
      <p className="recipe-description">{recipe.description}</p>
    </div>
  );
};

export default RecipeCard;
