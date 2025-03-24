import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importez le contexte d'auth
import axios from 'axios';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    mdp: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Utilisez le hook useAuth

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const loginData = {
      email: formData.email,
      mdp: formData.mdp,
    };
  
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', loginData);
      console.log('Connexion réussie :', response.data);
  
      // Stocker le token pour les futures requêtes
      localStorage.setItem('token', response.data.token);
  
      // Rediriger ou mettre à jour l'état de l'utilisateur
      navigate('/profile');
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      setError(error.response?.data?.error || "Une erreur s'est produite.");
    }
  };
  


  return (
    <div className="container">
    <div className="form-container">
      <h1 >Connexion</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mdp">
            Mot de passe </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="mdp"
            type="password"
            name="mdp"
            value={formData.mdp}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Se connecter
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;