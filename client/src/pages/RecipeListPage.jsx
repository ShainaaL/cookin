// src/pages/RecipeListPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeList from '../components/RecipeList';

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/recipes'); // Endpoint pour récupérer les recettes
        setRecipes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des recettes:', err);
        setError('Erreur de récupération des recettes');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Liste des recettes</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default RecipeListPage;
