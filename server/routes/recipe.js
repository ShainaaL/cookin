const express = require('express');
const router = express.Router();
const db = require('../config/database');
const upload = require('../middlewares/upload.js');

// Route pour ajouter une nouvelle recette
router.post('/recipes', upload.single('image'), (req, res) => {
  const { titre, description, id_continent, featured } = req.body;
  const photo_url = req.file ? req.file.path : ''; // Utilise le chemin de l'image si elle est chargée

  // Vérification des champs requis
  if (!titre || !description || !id_continent) {
    return res.status(400).json({ error: "Tous les champs (titre, description, id_continent) sont requis." });
  }

  const query = `
    INSERT INTO recettes (titre, description, photo_url, id_continent, featured)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [titre, description, photo_url, id_continent, featured || 0], (err, results) => {
    if (err) {
      console.error("❌ Erreur lors de l'ajout de la recette :", err.message);
      return res.status(500).json({ error: "Erreur serveur, veuillez réessayer plus tard." });
    }

    const recetteId = results.insertId;

    db.query('SELECT * FROM recettes WHERE id = ?', [recetteId], (err, recette) => {
      if (err) {
        console.error("❌ Erreur lors de la récupération de la recette nouvellement ajoutée :", err.message);
        return res.status(500).json({ message: "Recette ajoutée, mais impossible de récupérer ses détails.", recetteId });
      }
      res.status(201).json({ message: "Recette ajoutée avec succès.", recette: recette[0] });
    });
  });
});


// =======================================
// Route : Récupérer toutes les recettes d'un continent
// =======================================
router.get('/recipes/continent/:id', (req, res) => {
  const continentId = req.params.id;

  // Vérifie que l'ID du continent est fourni
  if (!continentId) {
    return res.status(400).json({ error: "L'ID du continent est requis." });
  }

  const query = `
    SELECT r.id, r.titre, r.description, r.photo_url, r.date_creation
    FROM recettes r
    WHERE r.id_continent = ?
  `;

  db.query(query, [continentId], (err, results) => {
    if (err) {
      console.error("❌ Erreur SQL :", err.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des recettes." });
    }

    if (results.length === 0) {
      console.log(`⚠️ Aucune recette trouvée pour le continent ID : ${continentId}`);
      return res.status(404).json({ error: "Aucune recette trouvée pour ce continent." });
    }

    res.status(200).json(results);
  });
});

// =======================================
// Route : Récupérer les recettes mises en avant ("featured")
// =======================================
router.get('/recipes/featured', (req, res) => {
  const query = 'SELECT * FROM recettes WHERE featured = 1'; // Requiert une colonne "featured" dans la table

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Erreur SQL :", err.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des recettes mises en avant." });
    }

    res.status(200).json(results);
  });
});

// Route pour récupérer une recette du jour
router.get('/recipes/recipe-of-day', (req, res) => {
  const query = `
    SELECT * 
    FROM recettes 
    ORDER BY RAND() 
    LIMIT 1
  `; // La fonction SQL RAND() sélectionne une recette aléatoire

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur SQL :', err.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération de la recette du jour.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Aucune recette trouvée pour la recette du jour.' });
    }

    res.status(200).json(results[0]);
  });
});

router.get('/recipes/:id', (req, res) => {
  console.log(`Requête reçue pour l'ID : ${req.params.id}`);
  const { id } = req.params;

  const query = 'SELECT * FROM recettes WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération de la recette.' });
    } else if (results.length === 0) {
      console.log('Recette non trouvée pour cet ID.');
      res.status(404).json({ error: 'Recette non trouvée.' });
    } else {
      console.log('Recette trouvée :', results[0]);
      res.status(200).json(results[0]);
    }
  });
});



module.exports = router;
