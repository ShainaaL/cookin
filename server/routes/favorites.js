const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Connexion à la base de données
const { authenticateUser } = require('../middlewares/auth'); // Middleware d'authentification


// Route pour récupérer les favoris d'un utilisateur
router.get('/api/favorites', authenticateUser, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT f.id_recette, r.id AS recipe_id, r.titre, r.photo_url, f.date_ajout
    FROM favoris f
    JOIN recettes r ON f.id_recette = r.id
    WHERE f.id_utilisateur = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur SQL lors de la récupération des favoris :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des favoris.' });
    }
    res.status(200).json(results);
  });
});


// Route pour ajouter une recette aux favoris
router.post('/api/favorites', authenticateUser, (req, res) => {
  const userId = req.user.id; // Utilisateur validé par le token
  const { recipe_id } = req.body;

  const query = `
    INSERT INTO favoris (id_utilisateur, id_recette)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE date_ajout = CURRENT_TIMESTAMP
  `;

  db.query(query, [userId, recipe_id], (err) => {
    if (err) {
      console.error('Erreur SQL :', err);
      return res.status(500).json({ error: 'Erreur lors de l\'ajout aux favoris.' });
    }
    res.status(201).json({ message: 'Recette ajoutée aux favoris.' });
  });
});


// Route pour vérifier si une recette est dans les favoris
router.get('/api/favorites/check/:id', authenticateUser, (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;

  const query = `
    SELECT 1 FROM favoris
    WHERE id_utilisateur = ? AND id_recette = ?
  `;

  db.query(query, [userId, recipeId], (err, results) => {
    if (err) {
      console.error('Erreur SQL :', err);
      return res.status(500).json({ error: 'Erreur lors de la vérification des favoris.' });
    }
    res.status(200).json({ isFavorite: results.length > 0 });
  });
});

// Route pour retirer une recette des favoris
router.delete('/api/favorites/:id', authenticateUser, (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;

  const query = `
    DELETE FROM favoris
    WHERE id_utilisateur = ? AND id_recette = ?
  `;

  db.query(query, [userId, recipeId], (err) => {
    if (err) {
      console.error('Erreur SQL :', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression des favoris.' });
    }
    res.status(200).json({ message: 'Recette retirée des favoris.' });
  });
});

module.exports = router;
