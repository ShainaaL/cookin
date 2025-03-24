require('dotenv').config();
const jwt = require('jsonwebtoken');

// Utiliser la clé depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware pour authentifier l'utilisateur
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authentification manquante ou invalide." });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérification du token JWT
    req.user = decoded; // Associe les données utilisateur à la requête
    next();
  } catch (err) {
    console.error('Erreur lors de la vérification du token :', err);
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};


// Middleware pour autoriser uniquement les administrateurs

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé à l\'administrateur' });
  }
  next();
};

module.exports = { authenticateUser, isAdmin };

