import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ 
        nom: '', 
        prenom: '', 
        email: '', 
        mdp: '', 
        role: '' // 🚨 Pas de valeur par défaut
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            setError("Veuillez sélectionner un rôle.");
            return;
        }

        console.log("📤 Données envoyées :", formData); // ✅ Debug

        try {
            axios.post('http://localhost:5001/api/users/register', formData)
            navigate('/login'); // Redirige vers la page de connexion
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'inscription. Veuillez réessayer.");
            /*setError("Erreur lors de l'inscription. Veuillez réessayer.");*/
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Inscription</h1>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nom" className="block text-gray-700 font-medium">Nom </label>
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="prenom" className="block text-gray-700 font-medium">Prénom </label>
                        <input
                            type="text"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium">Email </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mdp" className="block text-gray-700 font-medium">Mot de passe </label>
                        <input
                            type="password"
                            name="mdp"
                            value={formData.mdp}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-gray-700 font-medium">Rôle </label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            className="input-field"
                            required
                        >
                            <option value="">Sélectionnez un rôle</option> {/* 🚨 Option vide pour forcer le choix */}
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>
                    <br />
                    <button type="submit">S'inscrire</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
