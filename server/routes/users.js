const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middlewares/auth.js');
const db = require('../config/database'); // Configuration pour la base de données

// Route accessible uniquement aux admins (liste des utilisateurs)
router.get('/all-users', authenticateUser, isAdmin, (req, res) => {
  const query = 'SELECT id, nom, prenom, email, role FROM utilisateurs';
  db.query(query, (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
    res.status(200).json(result);
  });
});

// Route d'inscription
router.post('/register', async (req, res) => {
  console.log("📩 Données reçues :", req.body);

  const { nom, prenom, email, mdp, role } = req.body;
  const userRole = role && role === 'admin' ? 'admin' : 'user';

  try {
    if (!nom || !prenom || !email || !mdp) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const hashedPassword = await bcrypt.hash(mdp, 10);
    const query = 'INSERT INTO utilisateurs (nom, prenom, email, mdp, role) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nom, prenom, email, hashedPassword, userRole], (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL :", err);
        return res.status(500).json({ error: "Erreur de création de l'utilisateur." });
      }
      return res.status(201).json({ message: 'Utilisateur inscrit avec succès.', role: userRole });
    });
  } catch (err) {
    console.error("❌ Erreur lors de l'inscription :", err);
    return res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// Route de connexion de l'utilisateur
router.post('/login', async (req, res) => {
  console.log("📩 Données reçues pour la connexion :", req.body);

  const { email, mdp } = req.body;

  if (!email || !mdp) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    const query = 'SELECT * FROM utilisateurs WHERE email = ?';
    db.query(query, [email], async (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL :", err);
        return res.status(500).json({ error: 'Erreur serveur.' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      const user = result[0];
      const isPasswordValid = await bcrypt.compare(mdp, user.mdp);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET, // Utilise la clé JWT du fichier .env
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Connexion réussie.',
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err);
    return res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});

// Route pour récupérer le profil de l'utilisateur
router.get('/profile', authenticateUser, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT id, nom, prenom, email, role FROM utilisateurs WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const user = {
      id: result[0].id,
      nom: result[0].nom,
      prenom: result[0].prenom,
      email: result[0].email,
      role: result[0].role,
    };

    return res.status(200).json(user);
  });
});

router.put('/update-email', authenticateUser, (req, res) => {
  const { userId, newEmail } = req.body;

  if (!userId || !newEmail) {
    return res.status(400).json({ error: "L'ID utilisateur et le nouvel email sont requis." });
  }

  const query = 'UPDATE utilisateurs SET email = ? WHERE id = ?';
  db.query(query, [newEmail, userId], (err, result) => {
    if (err) {
      console.error('Erreur SQL lors de la mise à jour de l\'email :', err);
      return res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
    }

    // Vérifie si une ligne a été mise à jour
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Email mis à jour avec succès." });
  });
});

module.exports = router;

