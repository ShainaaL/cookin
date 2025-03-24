const mysql = require('mysql2');

// Création de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ton utilisateur MySQL
  password: '', // Ton mot de passe MySQL (s'il est vide, sinon mettez-le)
  database: 'cookin' // Le nom de ta base de données
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données: ' + err.stack);
    return;
  }
  console.log('✅ Connecté à la base de données MySQL avec l\'ID ' + db.threadId);
});

module.exports = db;