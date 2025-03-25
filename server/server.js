const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const db = require('./config/database')

const fs = require('fs');
const path = require('path');
const recipeRoutes = require('./routes/recipe');
const continentRoutes = require('./routes/continent');


console.log('Clé JWT_SECRET:', process.env.JWT_SECRET);

const commentRoutes = require('./routes/comment');
const favoritesRoutes = require('./routes/favorites');

const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(commentRoutes);
app.use(favoritesRoutes);
// Montage des routes avec le préfixe /api
app.use('/api/users', userRoutes);
//app.use('/api', recipeRoutes);
app.use('/api', require('./routes/recipe.js'));
app.use('/api', continentRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.send('API Cookin est en ligne!');
});

// Gestion des erreurs 404 pour les routes non définies
app.use((req, res) => {
  console.log(`❌ Route non trouvée: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

