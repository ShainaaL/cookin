const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Route pour récupérer tous les continents
router.get('/continents', (req, res) => {
  const query = 'SELECT * FROM continents';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur SQL :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des continents.' });
    }
    res.status(200).json(results);
  });
});

// Route pour récupérer les détails d'un continent par ID
router.get('/continents/:id', (req, res) => {
  const continentId = req.params.id;

  const query = 'SELECT * FROM continents WHERE id = ?';
  db.query(query, [continentId], (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Continent non trouvé.' });
    }

    return res.status(200).json(result[0]);
  });
});

module.exports = router;
