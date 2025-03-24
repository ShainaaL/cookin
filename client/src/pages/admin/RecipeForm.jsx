// src/pages/AdminRecipeForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/common/Loader';

const AdminRecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prep_time: '',
    cook_time: '',
    servings: '',
    category: '',
    difficulty: 'facile',
    image_url: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchRecipe = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
          const recipe = response.data;
          
          setFormData({
            title: recipe.title || '',
            description: recipe.description || '',
            ingredients: recipe.ingredients || '',
            instructions: recipe.instructions || '',
            prep_time: recipe.prep_time || '',
            cook_time: recipe.cook_time || '',
            servings: recipe.servings || '',
            category: recipe.category || '',
            difficulty: recipe.difficulty || 'facile',
            image_url: recipe.image_url || ''
          });
          
          setImagePreview(recipe.image_url || '');
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement de la recette:', err);
          setError('Erreur lors du chargement de la recette');
          setLoading(false);
        }
      };
      
      fetchRecipe();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Créer une URL pour l'aperçu de l'image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Si une nouvelle image a été sélectionnée, l'uploader d'abord
      let imageUrl = formData.image_url;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await axios.post('http://localhost:5001/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        imageUrl = uploadResponse.data.imageUrl;
      }
      
      const recipeData = {
        ...formData,
        image_url: imageUrl
      };
      
      if (isEditMode) {
        // Mettre à jour une recette existante
        await axios.put(`http://localhost:5001/api/recipes/${id}`, recipeData);
      } else {
        // Créer une nouvelle recette
        await axios.post('http://localhost:5001/api/recipes', recipeData);
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la recette:', err);
      setError('Erreur lors de l\'enregistrement de la recette');
      setLoading(false);
    }
  };

  const difficultyOptions = ['facile', 'moyen', 'difficile'];
  const categoryOptions = [
    'entrée', 
    'plat principal', 
    'dessert', 
    'soupe', 
    'salade', 
    'apéritif', 
    'boisson'
  ];

  if (loading && isEditMode) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? 'Modifier la recette' : 'Ajouter une nouvelle recette'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Titre */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Titre de la recette
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>
          
          {/* Informations de base */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Temps de préparation (minutes)
            </label>
            <input
              type="number"
              name="prep_time"
              value={formData.prep_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Temps de cuisson (minutes)
            </label>
            <input
              type="number"
              name="cook_time"
              value={formData.cook_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Nombre de portions
            </label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Difficulté
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {difficultyOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categoryOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Ingrédients */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Ingrédients (un par ligne)
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="6"
              required
              placeholder="200g de farine&#10;2 œufs&#10;100g de beurre"
            />
          </div>
          
          {/* Instructions */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Instructions (une étape par ligne)
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="8"
              required
              placeholder="Préchauffer le four à 180°C&#10;Mélanger les ingrédients secs&#10;Ajouter les œufs un à un"
            />
          </div>
          
          {/* Image */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Image de la recette
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2"
            />
            
            {imagePreview && (
              <div className="mt-4">
                <p className="text-gray-700 font-bold mb-2">Aperçu :</p>
                <img
                  src={imagePreview}
                  alt="Aperçu de la recette"
                  className="h-40 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            disabled={loading}
          >
            Annuler
          </button>
          
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRecipeForm;