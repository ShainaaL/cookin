
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(10);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/recipes/admin');
        setRecipes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des recettes:', err);
        setError('Erreur lors du chargement des recettes');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const deleteRecipe = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      try {
        await axios.delete(`http://localhost:5001/api/recipes/${id}`);
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression de la recette:', err);
        alert('Erreur lors de la suppression de la recette');
      }
    }
  };

  // Filtrer les recettes selon le terme de recherche
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les recettes pour la page actuelle
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-red-600 mb-4">{error}</h2>
        <p>Veuillez réessayer ultérieurement.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
        <Link 
          to="/admin/recipes/new" 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Ajouter une nouvelle recette
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher une recette..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRecipes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Aucune recette trouvée
                </td>
              </tr>
            ) : (
              currentRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={recipe.image_url || '/images/default-recipe.jpg'} 
                      alt={recipe.title}
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{recipe.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{recipe.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/recipes/edit/${recipe.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => deleteRecipe(recipe.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredRecipes.length > recipesPerPage && (
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex space-x-2">
              {Array.from({ length: Math.ceil(filteredRecipes.length / recipesPerPage) }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;