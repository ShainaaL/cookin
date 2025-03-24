import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/common/RecipeCard'; // Assure-toi que le chemin est correct
import ContinentCard from '../components/common/ContinentCard';
import Loader from '../components/common/Loader';

const HomePage = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [continents, setContinents] = useState([]);
  const [recipeOfDay, setRecipeOfDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesRes = await axios.get('http://localhost:5001/api/recipes/featured');
        setFeaturedRecipes(recipesRes.data);

        const continentsRes = await axios.get('http://localhost:5001/api/continents');
        setContinents(continentsRes.data);

        const recipeOfDayRes = await axios.get('http://localhost:5001/api/recipes/recipe-of-day');
        setRecipeOfDay(recipeOfDayRes.data);

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement de la page d\'accueil:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <section className="bg-indigo-700 text-white rounded-lg overflow-hidden shadow-xl mb-12">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl font-bold mb-6">
              Découvrez la cuisine du monde avec Cookin'
            </h1>
            <p className="text-xl mb-8">
              Des recettes authentiques sélectionnées par le chef pour vous 
              faire voyager à travers les saveurs de tous les continents.
            </p>
            <Link
              to="/continent/1"
              className="bg-white text-indigo-700 font-medium px-6 py-3 rounded-md hover:bg-indigo-100"
            >
              Commencer l'exploration
            </Link>
            
          </div>
          <div className="md:w-1/2">
            <img
              src="/images/world-map.png"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
              alt="Plats du monde"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Explorer par continent</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {continents.map((continent) => (
            <ContinentCard key={continent.id} continent={continent} />
          ))}
        </div>
      </section>

      {recipeOfDay && (
        <section className="mb-16 bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-8">Recette du jour</h2>
          <div className="md:flex items-start space-x-0 md:space-x-8">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <img
                src={recipeOfDay.image_url || '/images/xiaolongbao.jpg'}
                alt={recipeOfDay.title}
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">{recipeOfDay.title}</h3>
              <div className="flex items-center mb-4">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm mr-3">
                  {recipeOfDay.continent_name}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {recipeOfDay.cooking_time} min
                </span>
              </div>
              <p className="text-gray-700 mb-6">{recipeOfDay.description}</p>
              <Link
                to={`/recipes/${recipeOfDay.id}`}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md inline-block hover:bg-indigo-700"
              >
                Voir la recette
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recettes populaires</h2>
          <Link to="/recipes" className="text-indigo-600 hover:text-indigo-800">
            Voir toutes les recettes
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe) => (
            <RecipeCard recipe={recipe} onFavorite={addToFavorites} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
