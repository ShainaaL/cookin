// src/pages/admin/CommentsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/comments/admin');
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des commentaires:', err);
        setError('Erreur lors du chargement des commentaires');
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const deleteComment = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        await axios.delete(`http://localhost:5001/api/comments/${id}`);
        setComments(comments.filter(comment => comment.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression du commentaire:', err);
        alert('Erreur lors de la suppression du commentaire');
      }
    }
  };

  const toggleCommentStatus = async (id, isVisible) => {
    try {
      await axios.put(`http://localhost:5001/api/comments/${id}`, {
        is_visible: !isVisible
      });
      
      // Mettre à jour l'état local
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, is_visible: !comment.is_visible } : comment
      ));
    } catch (err) {
      console.error('Erreur lors de la modification du statut:', err);
      alert('Erreur lors de la modification du statut');
    }
  };

  // Filtrer les commentaires
  const filteredComments = comments.filter(comment => {
    // Filtre de recherche
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.recipe?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre de statut
    if (filterStatus === 'all') {
      return matchesSearch;
    } else if (filterStatus === 'visible') {
      return matchesSearch && comment.is_visible;
    } else {
      return matchesSearch && !comment.is_visible;
    }
  });

  // Pagination
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  // Formatter la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

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
      <h1 className="text-3xl font-bold mb-8">Gestion des Commentaires</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Rechercher un commentaire..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">Tous les commentaires</option>
            <option value="visible">Commentaires visibles</option>
            <option value="hidden">Commentaires masqués</option>
          </select>
        </div>
      </div>

      {currentComments.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucun commentaire trouvé</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recette</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentComments.map((comment) => (
                <tr key={comment.id}>
                  <td className="px-6 py-4">
                    <div className="max-w-xs overflow-hidden text-ellipsis">
                      {comment.content}
                    </div>
                  </td>
                  <td className="px-6 py-4">{comment.user?.name || 'Utilisateur supprimé'}</td>
                  <td className="px-6 py-4">
                    <a 
                      href={`/recipe/${comment.recipe_id}`} 
                      className="text-blue-500 hover:underline"
                    >
                      {comment.recipe?.title || 'Recette inconnue'}
                    </a>
                  </td>
                  <td className="px-6 py-4">{formatDate(comment.created_at)}</td>
                  <td className="px-6 py-4">
                    <span 
                      className={`px-2 py-1 rounded text-xs ${
                        comment.is_visible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {comment.is_visible ? 'Visible' : 'Masqué'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleCommentStatus(comment.id, comment.is_visible)}
                        className={`px-3 py-1 rounded text-xs ${
                          comment.is_visible 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {comment.is_visible ? 'Masquer' : 'Afficher'}
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              &laquo;
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;