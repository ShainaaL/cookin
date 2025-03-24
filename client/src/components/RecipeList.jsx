import React, { useState, useEffect } from 'react';
import RecipeCard from './common/RecipeCard';
import axios from 'axios';

const RecipeList = () => {
  /*const [recipes, setRecipes] = useState([]);*/
  const recipes = [
    { id: 1, titre: 'Spaghetti Bolognese', photo_url: '', description: 'Un classique italien.' },
    { id: 2, titre: 'Poulet Rôti', photo_url: '', description: 'Délicieux poulet croustillant.' }
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes');
        setRecipes(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des recettes :', err);
      }
    };

    fetchRecipes();
  }, []);

  const addToFavorites = async (recipeId) => {
    console.log(`Recette ${recipeId} ajoutée aux favoris`);
    try {
      const token = localStorage.getItem('token'); // Récupère le token JWT
      await axios.post('/api/favorites', { id_recette: recipeId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Recette ajoutée aux favoris !');
    } catch (err) {
      console.error('Erreur lors de l\'ajout aux favoris :', err);
    }
  };

  app.post('/api/favorites', authenticateUser, (req, res) => {
    const { id_recette } = req.body;
    const userId = req.user.id; // Récupéré via authenticateUser
  
    const query = `
      INSERT INTO favoris (id_utilisateur, id_recette)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE date_ajout = CURRENT_TIMESTAMP
    `;
  
    db.query(query, [userId, id_recette], (err) => {
      if (err) {
        console.error('Erreur SQL :', err);
        return res.status(500).json({ error: 'Erreur lors de l\'ajout aux favoris.' });
      }
      res.status(201).json({ message: 'Recette ajoutée aux favoris.' });
    });
  });
  

  return (
    <div className="grid grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onFavorite={addToFavorites} />
      ))}
    </div>
  );
};

export default RecipeList;
