-- Création de la base de données
CREATE DATABASE IF NOT EXISTS cookin;
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE cookin;

-- Création de la table utilisateurs
CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(200) NOT NULL,
  prenom VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  mdp VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table continents
CREATE TABLE continents (
id INT PRIMARY KEY AUTO_INCREMENT,
nom VARCHAR(150) NOT NULL
);

-- Création de la table recettes
CREATE TABLE recettes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  description TEXT,
  ingredients TEXT,
  instructions TEXT,
  prep_time VARCHAR(50),
  origin VARCHAR(100),
  difficulty ENUM('Facile', 'Moyen', 'Difficile'),
  photo_url VARCHAR(255),
  id_continent INT,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  featured TINYINT(1) DEFAULT 0,
  date_modification DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_continent) REFERENCES continents(id)
);
-- Création de la table favoris
CREATE TABLE favoris (
    id_utilisateur INT,
    id_recette INT,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_utilisateur, id_recette),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id),
    FOREIGN KEY (id_recette) REFERENCES recettes(id)
);

-- Création de la table commentaires
CREATE TABLE commentaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contenu TEXT NOT NULL,
  id_utilisateur INT,
  id_recette INT,
  id_continent INT,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  is_visible TINYINT(1) DEFAULT 1,
  FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id),
  FOREIGN KEY (id_recette) REFERENCES recettes(id),
  FOREIGN KEY (id_continent) REFERENCES continents(id)
);

CREATE TABLE recettes_continents (
    recette_id INT,
    continent_id INT,
    PRIMARY KEY (recette_id, continent_id),
    FOREIGN KEY (recette_id) REFERENCES recettes(id) ON DELETE CASCADE,
    FOREIGN KEY (continent_id) REFERENCES continents(id) ON DELETE CASCADE
);

-- insertion des continents
INSERT INTO continents (nom) VALUES 
('Europe'),
('Asie'),
('Afrique'),
('Amérique du Nord'),
('Amérique du Sud'),
('Océanie');


