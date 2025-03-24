const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middlewares/auth'); // Import des middlewares
const db = require('../config/database');

// Route pour récupérer les commentaires de l'utilisateur connecté
router.get('/api/user/comments', authenticateUser, (req, res) => {
  const userId = req.user.id; // Définition par authenticateUser

  const query = `
    SELECT c.id, c.contenu, c.date_creation 
    FROM commentaires c
    WHERE c.id_utilisateur = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur SQL (utilisateur commentaires) :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des commentaires.' });
    }
    res.status(200).json(results);
  });
});

// Route pour mettre à jour la visibilité d'un commentaire (admin uniquement)
router.put('/api/comments/:id', authenticateUser, isAdmin, (req, res) => {
  const { id } = req.params;
  const { is_visible } = req.body;

  const query = 'UPDATE commentaires SET is_visible = ? WHERE id = ?';
  db.query(query, [is_visible, id], (err) => {
    if (err) {
      console.error('Erreur SQL (mise à jour visibilité) :', err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du commentaire.' });
    }
    res.status(200).json({ message: 'Commentaire mis à jour avec succès' });
  });
});

// Route pour récupérer tous les commentaires (admin avec pagination et recherche)
router.get('/api/comments/admin', authenticateUser, isAdmin, (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;
  const offset = (page - 1) * perPage;

  const query = `
    SELECT c.id, c.contenu, u.nom AS utilisateur, r.titre AS recette, c.date_creation, c.is_visible
    FROM commentaires c
    LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id
    LEFT JOIN recettes r ON c.id_recette = r.id
    WHERE c.contenu LIKE ?
    LIMIT ? OFFSET ?
  `;

  db.query(query, [`%${search}%`, parseInt(perPage), offset], (err, results) => {
    if (err) {
      console.error('Erreur SQL (admin commentaires) :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des commentaires.' });
    }
    res.status(200).json(results);
  });
});

// Route pour supprimer un commentaire (admin uniquement)
router.delete('/api/comments/:id', authenticateUser, isAdmin, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM commentaires WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Erreur SQL (supprimer commentaire) :', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression du commentaire.' });
    }
    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  });
});

// Route pour récupérer les commentaires d'une recette
router.get('/api/comments/recipe/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT c.id, c.contenu, c.date_creation, u.nom AS utilisateur
    FROM commentaires c
    LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id
    WHERE c.id_recette = ? AND c.is_visible = TRUE
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur SQL (recette commentaires) :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des commentaires.' });
    }
    res.status(200).json(results);
  });
});

// Route pour récupérer les commentaires d'un continent
router.get('/api/comments/continent/:continentId', (req, res) => {
  const { continentId } = req.params;

  const query = `
    SELECT c.id, c.contenu, c.date_creation, u.nom AS utilisateur
    FROM commentaires c
    LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id
    WHERE c.id_continent = ? AND c.is_visible = TRUE
  `;

  db.query(query, [continentId], (err, results) => {
    if (err) {
      console.error('Erreur SQL (continent commentaires) :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des commentaires.' });
    }
    res.status(200).json(results);
  });
});

// Route pour ajouter un commentaire à un continent (utilisateur connecté)
router.post('/api/comments/continent', authenticateUser, (req, res) => {
  const { id_continent, contenu } = req.body;
  const userId = req.user.id;

  const query = `
    INSERT INTO commentaires (id_utilisateur, id_continent, contenu, is_visible, date_creation)
    VALUES (?, ?, ?, TRUE, NOW())
  `;

  db.query(query, [userId, id_continent, contenu], (err) => {
    if (err) {
      console.error('Erreur SQL (ajout commentaire continent) :', err);
      return res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire.' });
    }
    res.status(201).json({ message: 'Commentaire ajouté avec succès' });
  });
});

router.post('/api/comments/recipe', authenticateUser, (req, res) => {
  const { id_recette, contenu } = req.body;
  const userId = req.user.id;

  const query = `
    INSERT INTO commentaires (id_utilisateur, id_recette, contenu, is_visible, date_creation)
    VALUES (?, ?, ?, TRUE, NOW())
  `;

  db.query(query, [userId, id_recette, contenu], (err) => {
    if (err) {
      console.error('Erreur SQL lors de l\'ajout du commentaire :', err);
      res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire.' });
    } else {
      res.status(201).json({ message: 'Commentaire ajouté avec succès.' });
    }
  });
});


module.exports = router;
