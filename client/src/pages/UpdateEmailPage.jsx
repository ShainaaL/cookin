import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateEmailPage = ({ user }) => {
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdateEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('http://localhost:5001/api/update-email', {
        userId: user.id, // L'ID de l'utilisateur connecté
        newEmail,
      });

      setMessage(response.data.message); // Message de succès
      setTimeout(() => navigate('/profile'), 2000); // Redirige vers la page profil après mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'email :", error);
      setMessage(error.response?.data?.error || "Une erreur est survenue.");
    }
  };

  // Vérifie si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Accès refusé</h1>
        <p className="text-lg">Vous devez être connecté pour modifier votre email.</p>
      </div>
    );
  }

  return (
    <div className="container_a">
      <h1 className="text-3xl font-bold mb-6">Modifier votre email</h1>
      <form onSubmit={handleUpdateEmail} className="mt-4">
        <label className="block mb-2">
          Nouveau email :
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            required
          />
        </label>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
          onClick={() => navigate('/profile')}
        >
            
          Mettre à jour
        </button>
      </form>
      {message && (
        <p className={`mt-4 ${message.includes('succès') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UpdateEmailPage;
