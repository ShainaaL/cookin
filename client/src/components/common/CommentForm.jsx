import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState(''); // Texte du commentaire
  const [error, setError] = useState(''); // Gestion des erreurs
  const [isSubmitting, setIsSubmitting] = useState(false); // Indicateur d'envoi
  const { user } = useAuth(); // Récupère l'utilisateur via AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Veuillez entrer un commentaire'); // Empêche l'envoi si le contenu est vide
      return;
    }

    if (!user) {
      setError('Vous devez être connecté pour commenter'); // Empêche l'envoi si l'utilisateur n'est pas connecté
      return;
    }

    try {
      setIsSubmitting(true); // Démarre l'indicateur d'envoi
      setError(''); // Réinitialise les erreurs

      const result = await onSubmit(content); // Appelle la méthode onSubmit passée en prop

      if (result?.success) { // Vérifie si la réponse indique un succès
        setContent(''); // Réinitialise le champ commentaire
      } else {
        setError(result?.message || 'Erreur lors de l\'ajout du commentaire');
      }
    } catch (err) {
      setError('Une erreur est survenue'); // Gère les erreurs
      console.error(err);
    } finally {
      setIsSubmitting(false); // Arrête l'indicateur d'envoi
    }
  };

  return (
    <div className="comment-form bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Ajouter un commentaire</h3>

      {!user && (
        <p className="text-orange-500 mb-4">
          Veuillez vous <a href="/login" className="underline">connecter</a> pour laisser un commentaire.
        </p>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Partagez votre avis..."
          disabled={!user || isSubmitting}
        ></textarea>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className={`px-4 py-2 rounded ${
              !user || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={!user || isSubmitting}
          >
            {isSubmitting ? 'Envoi...' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
