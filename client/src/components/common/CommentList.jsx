import React from 'react';
import { useAuth } from '../../context/AuthContext';

const CommentList = ({ comments, onDelete }) => {
  const { user, isAdmin } = useAuth(); // Récupère l'utilisateur et la méthode isAdmin

  if (!comments || comments.length === 0) {
    return <p className="text-gray-600">Aucun commentaire pour l'instant.</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comment-list mt-6">
      <h3 className="text-xl font-semibold mb-4">Commentaires ({comments.length})</h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="comment bg-gray-50 p-4 rounded"> {/* Ajout de la clé ici */}
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{comment.user?.name || 'Utilisateur'}</div>
                <div className="text-sm text-gray-500">{formatDate(comment.date_creation)}</div>
              </div>
              {(isAdmin() || (user && user.id === comment.user_id)) && (
                <button
                  onClick={() => onDelete(comment.id)} // Appelle la méthode onDelete
                  className="text-red-500 hover:text-red-700"
                  title="Supprimer ce commentaire"
                >
                  Supprimer
                </button>
              )}
            </div>
            <div className="mt-2">{comment.contenu}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
