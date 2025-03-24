const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Définir le répertoire de destination pour les uploads
const uploadDir = path.join(__dirname, '..', 'uploads');

// Créer le répertoire s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurer le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers autorisés (images uniquement)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images (jpeg, jpg, png, gif) sont autorisées'));
  }
};

// Créer le middleware avec les configurations
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limite à 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;