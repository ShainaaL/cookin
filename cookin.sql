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

INSERT INTO recettes_continents (recette_id, continent_id) VALUES
(27, 3), 
(28, 3), 
(29, 3), 
(30, 3), 
(31, 4), 
(32, 4), 
(33, 4), 
(34, 4), 
(35, 4), 
(36, 6), 
(37, 6), 
(38, 6); 


INSERT INTO commentaires (id, contenu, id_utilisateur, id_recette, id_continent, date_creation, status, date_modification, is_visible) VALUES
(17, 'très simple', 8, 12, NULL, '2025-03-24 10:45:12', 'en_attente', NULL, 1),
(18, 'super simple mes enfants ont adorés !', 8, 29, NULL, '2025-03-24 10:50:38', 'en_attente', NULL, 1);


INSERT INTO recettes (id, titre, description, ingredients, instructions, prep_time, origin, difficulty, photo_url, id_continent, date_creation, featured, date_modification) VALUES
(1, 'Malatang', 'Cuire les brochettes de viande et les légumes dans un bouillon épicé.', 'Brochettes de viande, légumes, bouillon épicé', '1. Couper les morceaux de viande ou de légumes et les réserver.\n2. Préparer un bouillon épicé avec vos épices préférées.\n3. Cuire les morceaux de viande et les légumes dans le bouillon jusqu\'à tendreté.\n4. Servir chaud avec du riz ou des accompagnements selon votre goût.', '40 min', 'Chine', 'Facile', '/images/malatang.jpg', 2, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(2, 'Ravioli', 'Farcir les pâtes avec la viande, les légumes ou les fruits de mer puis cuire à la vapeur.', 'Pâte, viande, légumes ou fruits de mer', '1. Préparer la farce avec la viande, les légumes ou les fruits de mer.\n2. Farcir les pâtes avec la préparation.\n3. Cuire à la vapeur ou frire les raviolis jusqu\'à ce qu\'ils soient bien dorés.\n4. Servir avec une sauce ou des légumes frais.', '50 min', 'Chine', 'Moyen', '/images/ravioli.jpg', 2, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(3, 'Dim sum', 'Préparer des petits plats variés et les cuire à la vapeur ou les frire.', 'Petites portions variées (poulet, légumes, crevettes)', '1. Préparer les petits plats variés (poulet, légumes, crevettes, etc.).\n2. Disposer les plats sur des assiettes ou dans des paniers vapeur.\n3. Cuire à la vapeur ou frire les ingrédients selon votre préférence.\n4. Servir chaud avec des sauces d\'accompagnement.', '30 min', 'Chine', 'Facile', '/images/dim sum.png', 2, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(4, 'Xiaolongbao', 'Préparer les raviolis farcis de soupe et cuire à la vapeur.', 'Pâte, farce de soupe (porc ou poulet), bouillon', '1. Préparer la farce pour les raviolis en mélangeant les ingrédients.\n2. Étaler la pâte et y placer la farce.\n3. Refermer les raviolis soigneusement pour qu\'ils retiennent la soupe.\n4. Cuire les raviolis à la vapeur et servir avec un bouillon chaud.', '1h 20 min', 'Chine', 'Difficile', '/images/xiaolongbao.jpg', 2, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(5, 'Hongshaorou', 'Faire braiser le porc avec la sauce soja, le sucre et les épices.', 'Porc, sauce soja, sucre, épices (cannelle, anis étoilé)', '1. Découper le porc en morceaux et préparer les épices.\n2. Faire braiser le porc dans une poêle chaude avec la sauce soja et le sucre.\n3. Ajouter les épices et laisser mijoter jusqu\'à tendreté.\n4. Servir chaud avec du riz ou des légumes.', '2h', 'Chine', 'Moyen', '/images/Hongshaorou.jpg', 2, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(7, 'Pierogi', 'Farcir la pâte avec les ingrédients, puis cuire à l\'eau ou frire.', 'Pâte, farce (pommes de terre, fromage, ou champignons)', '1. Mélanger les pommes de terre avec le fromage et les épices.\n2. Étaler la pâte et y placer la préparation.\n3. Refermer soigneusement et cuire à l\'eau ou frire jusqu\'à ce que ce soit doré.\n4. Servir avec une sauce ou une salade.', '1h', 'Pologne', 'Moyen', '/images/Pierogi.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(8, 'Rosol', 'Cuire le poulet dans un bouillon puis servir avec des nouilles.', 'Poulet, bouillon, nouilles, légumes', '1. Préparer le bouillon avec des épices et des légumes.\n2. Ajouter le poulet et laisser mijoter jusqu\'à ce qu\'il soit bien cuit.\n3. Cuire les nouilles séparément et les ajouter au bouillon.\n4. Servir chaud avec des légumes frais.', '1h', 'Pologne', 'Facile', '/images/Rosol.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(9, 'Barszcz', 'Préparer une soupe avec des betteraves et des légumes, à servir chaude ou froide.', 'Betteraves, légumes (carottes, céleri), bouillon, crème', '1. Éplucher les betteraves et les légumes.\n2. Faire cuire les légumes dans une casserole avec de l\'eau bouillante.\n3. Mixer les betteraves avec le bouillon pour une texture homogène.\n4. Servir chaud avec une cuillère de crème fraîche.', '1h 15 min', 'Pologne', 'Facile', '/images/Barszcz.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(10, 'Poulet Tikka Masala', 'Faire mariner le poulet dans les épices, puis cuire dans une sauce tomate crémeuse.', 'Poulet, épices (curcuma, garam masala), tomates, crème', '1. Faire mariner le poulet avec du curcuma, du garam masala, et du yaourt.\n2. Préparer une sauce crémeuse avec des tomates et de la crème.\n3. Ajouter le poulet dans la sauce et laisser mijoter jusqu\'à tendreté.\n4. Servir avec du riz ou des naans.', '50 min', 'Inde', 'Moyen', '/images/poulet-TM.jpg', 2, '2025-03-18 11:36:04', 0, '2025-03-24 16:14:07'),
(11, 'Butter Chicken', 'Faire cuire le poulet dans une sauce au beurre avec des épices et des tomates.', 'Poulet, beurre, tomates, épices (curcuma, garam masala)', '1. Couper le poulet en morceaux et le faire mariner avec des épices telles que le curcuma, le garam masala, et le piment.\n2. Faire chauffer une grande casserole et préparer une sauce avec le beurre, les tomates et une pincée de sucre.\n3. Ajouter les morceaux de poulet marinés dans la sauce et laisser mijoter jusqu\'à ce qu\'ils soient bien cuits.\n4. Servir chaud avec du riz ou des naans pour accompagner.', '50 min', 'Inde', 'Moyen', '/images/butter-chicken.jpg', 2, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:44'),
(12, 'Bandera Paisa', 'Servir le riz, les haricots, la viande de porc, l\'œuf, l\'avocat et l\'arepa.', 'Riz, haricots rouges, viande de porc, œufs, avocat, arepa', '1. Préparer les haricots, cuire la viande de porc à feu moyen, et couper les autres accompagnements (avocat, œuf, arepa).\n2. Disposer le riz et les haricots cuits sur une grande assiette.\n3. Ajouter la viande de porc et les autres accompagnements pour compléter le plat.\n4. Servir chaud avec une sauce épicée ou une vinaigrette.', '1h', 'Colombie', 'Moyen', '/images/Bandeja-Paisa.jpeg', 5, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:44'),
(13, 'Arroz Con Pollo', 'Cuire le riz avec le poulet, les légumes et les épices.', 'Riz, poulet, légumes (carottes, pois), épices (cumin, coriandre)', '1. Cuire les morceaux de poulet avec des épices comme le cumin, la coriandre et le paprika, puis réserver.\n2. Cuire le riz avec des légumes hachés tels que des carottes et des pois.\n3. Ajouter le poulet cuit dans le riz, bien mélanger et laisser mijoter quelques minutes.\n4. Servir chaud avec des quartiers de citron ou une sauce.', '45 min', 'Amérique latine', 'Facile', '/images/Arroz Con Pollo.jpg', 5, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:44'),
(14, 'Arroz Paisa', 'Servir le riz avec des haricots, de la viande et des légumes.', 'Riz, haricots rouges, viande (porc ou bœuf), légumes', '1. Préparer le riz en le rinçant et le cuire dans de l\'eau bouillante.\n2. Cuire séparément les haricots rouges avec des épices.\n3. Mélanger le riz cuit avec les haricots et ajouter des légumes sautés si désiré.\n4. Servir chaud avec une viande ou une sauce épicée.', '1h', 'Colombie', 'Facile', '/images/Arroz-Paisa.jpg', 5, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:44'),
(15, 'Boeuf Bourguignon', 'Faire braiser le bœuf dans le vin rouge avec des légumes et des champignons.', 'Bœuf, vin rouge, carottes, oignons, champignons, épices', '1. Couper le bœuf en morceaux et le faire dorer dans une cocotte avec un peu d\'huile.\n2. Ajouter les carottes, les oignons et les champignons, puis déglacer avec du vin rouge.\n3. Laisser mijoter à feu doux pendant plusieurs heures pour attendrir la viande.\n4. Servir chaud avec des pommes de terre ou du pain frais.', '3h', 'France', 'Difficile', '/images/Boeuf-Bourguignon.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:44'),
(16, 'Gratin dauphinois', 'Plat traditionnel français à base de pommes de terre, crème et fromage, cuit au four.', 'Pommes de terre, crème, fromage, ail, muscade', '1. Éplucher et trancher finement les pommes de terre.\n2. Préparer un mélange de crème, fromage râpé et une pincée de muscade.\n3. Disposer les tranches de pommes de terre dans un plat à gratin en les recouvrant de crème.\n4. Cuire au four jusqu\'à ce que le dessus soit doré et croustillant.\n5. Servir chaud en accompagnement ou comme plat principal.', '1h 30 min', 'France', 'Moyen', '/images/gratin-dauphinois.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:44'),
(17, 'Confit de Canard', 'Cuisiner lentement le canard dans sa propre graisse pour un résultat tendre et croustillant.', 'Canard, graisse de canard, ail, thym', '1. Assaisonner les morceaux de canard avec de l\'ail et du thym.\n2. Faire cuire lentement le canard dans sa propre graisse à feu doux.\n3. Retirer et faire dorer le canard à feu vif pour obtenir une peau croustillante.\n4. Servir chaud avec des pommes de terre sautées ou une salade.', '2h', 'France', 'Difficile', '/images/confit-de-canard.jpeg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:44'),
(18, 'Pizza', 'Garnir la pâte avec de la sauce tomate et du fromage, puis cuire au four.', 'Pâte à pizza, sauce tomate, fromage, garnitures (selon goût)', '1. Préparer une pâte à pizza en mélangeant farine, eau, levure, et sel.\n2. Étaler la pâte et la garnir de sauce tomate, fromage râpé et d\'autres ingrédients au choix.\n3. Cuire la pizza au four préchauffé à 220°C jusqu\'à ce que la pâte soit bien dorée.\n4. Servir chaud avec une salade ou en entrée.', '30 min', 'Italie', 'Facile', '/images/pizza.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:44'),
(19, 'Pâtes Carbonara', 'Cuire les pâtes et mélanger avec une sauce à base d\'œufs, de fromage et de guanciale.', 'Pâtes, œufs, fromage Pecorino ou Parmigiano, guanciale, poivre', '1. Faire cuire les pâtes al dente dans une grande casserole d\'eau salée.\n2. Préparer une sauce en mélangeant œufs, fromage Pecorino, et poivre moulu.\n3. Faire revenir le guanciale ou la pancetta jusqu\'à ce qu\'elle soit croustillante.\n4. Mélanger les pâtes avec la sauce et le guanciale chaud pour obtenir une texture crémeuse.\n5. Servir immédiatement avec un peu de fromage râpé.', '25 min', 'Italie', 'Facile', '/images/pate-carbonara.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:45'),
(20, 'Lasagne', 'Alterner les couches de pâtes, de viande hachée, de béchamel et de fromage avant de cuire au four.', 'Pâtes à lasagne, viande hachée, béchamel, fromage, sauce tomate', '1. Préparer une sauce à la viande avec des tomates, oignons, et ail.\n2. Préparer une béchamel en mélangeant beurre, farine et lait.\n3. Dans un plat à gratin, alterner des couches de pâtes, de sauce à la viande, et de béchamel.\n4. Recouvrir de fromage râpé et cuire au four jusqu\'à ce que le dessus soit doré.\n5. Servir chaud avec une salade.', '1h 15 min', 'Italie', 'Moyen', '/images/lasagne.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:52:45'),
(21, 'Paella', 'Cuire le riz avec les fruits de mer, le poulet, les légumes et le safran.', 'Riz, fruits de mer, poulet, légumes, safran', '1. Nettoyer les fruits de mer (crevettes, moules, calamars) et les réserver.\n2. Faire chauffer une grande poêle avec un filet d\'huile et y faire revenir le poulet jusqu\'à ce qu\'il soit doré.\n3. Ajouter les légumes (tomates, poivrons, petits pois) et les faire cuire avec le poulet.\n4. Incorporer le riz et le safran en mélangeant bien.\n5. Ajouter les fruits de mer et laisser mijoter à feu doux jusqu\'à absorption complète du liquide.\n6. Servir chaud avec un quartier de citron.', '1h 30 min', 'Espagne', 'Moyen', '/images/paella.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:54:58'),
(22, 'Tortilla de Patata', 'Faire frire les pommes de terre puis les mélanger avec les œufs pour une omelette épaisse.', 'Pommes de terre, œufs, huile d\'olive, oignons (optionnels)', '1. Éplucher les pommes de terre et les couper en fines rondelles.\n2. Faire chauffer une poêle avec un filet d\'huile d\'olive et y faire frire les pommes de terre jusqu\'à ce qu\'elles soient légèrement dorées.\n3. Battre les œufs dans un bol avec une pincée de sel et de poivre.\n4. Ajouter les pommes de terre frites aux œufs battus et bien mélanger.\n5. Cuire le mélange dans une poêle chaude pour former une omelette épaisse.\n6. Retourner délicatement l\'omelette pour cuire l\'autre côté.\n7. Servir chaud ou tiède, en tranches.', '45 min', 'Espagne', 'Facile', '/images/tortilla-patata.jpg', 1, '2025-03-18 11:36:04', 0, '2025-03-24 16:54:58'),
(25, 'Dahl', 'Faire cuire les lentilles dans un curry épicé.', 'Lentilles, tomates, oignons, épices (curry, curcuma, cumin, gingembre)', '1. Rincer les lentilles dans de l\'eau froide et les réserver.\n2. Faire chauffer une casserole avec un filet d\'huile et y faire revenir les oignons avec les épices (curry, curcuma, cumin, gingembre).\n3. Ajouter les lentilles et les tomates concassées dans la casserole, puis couvrir avec de l\'eau.\n4. Laisser mijoter à feu doux jusqu\'à ce que les lentilles soient tendres.\n5. Servir chaud avec du riz ou des naans.', '40 min', 'Inde', 'Facile', '/images/Dahl.jpg', 2, '2025-03-18 11:36:04', 1, '2025-03-24 16:54:58'),
(26, 'Samossa', 'Farcir la pâte avec des légumes épicés puis frire.', 'Pâte, légumes (pommes de terre, pois, carottes), épices (curry, cumin)', '1. Préparer une farce avec les légumes râpés (pommes de terre, carottes, pois) et les épices (curry, cumin).\n2. Étaler la pâte et découper des petits cercles ou triangles.\n3. Placer une cuillère de farce au centre de chaque portion de pâte et refermer soigneusement.\n4. Chauffer une grande poêle avec de l\'huile et y faire frire les samossas jusqu\'à ce qu\'ils soient dorés et croustillants.\n5. Servir chaud avec une sauce épicée ou sucrée.', '1h', 'Inde', 'Moyen', '/images/Samossa.jpg', 2, '2025-03-18 11:36:04', 0, '2025-03-24 16:54:58'),
(27, 'Mafé', 'Plat ouest-africain à base de viande en sauce d\'arachide', 'Viande (bœuf ou agneau), beurre de cacahuète, tomates, oignons, épices (piment, gingembre, ail)', '1. Couper la viande en morceaux et les assaisonner avec les épices (piment, gingembre, ail).\n2. Faire chauffer une grande casserole avec un filet d\'huile et y faire revenir la viande.\n3. Ajouter les oignons émincés et les tomates concassées, puis mélanger.\n4. Incorporer le beurre de cacahuète et un peu d\'eau pour obtenir une sauce onctueuse.\n5. Laisser mijoter à feu doux jusqu\'à ce que la viande soit tendre.\n6. Servir chaud avec du riz ou du manioc.', '1h 30 min', 'Sénégal', 'Moyen', '/images/mafe.jpg', 3, '2025-03-20 10:43:39', 0, '2025-03-24 16:54:58'),
(28, 'Yassa Poulet', 'Plat traditionnel sénégalais à base de poulet mariné au citron et aux oignons', 'Poulet, oignons, citron, moutarde, épices (ail, piment)', '1. Faire mariner le poulet dans le jus de citron avec de l\'ail et du piment, puis réserver.\n2. Faire revenir les oignons émincés dans une casserole avec un peu d\'huile.\n3. Ajouter le poulet mariné dans la casserole et laisser cuire quelques minutes.\n4. Ajouter de l\'eau et de la moutarde pour créer une sauce légère.\n5. Laisser mijoter jusqu\'à ce que le poulet soit bien tendre.\n6. Servir chaud avec du riz ou des légumes.', '1h', 'Sénégal', 'Facile', '/images/poulet-yassa.jpg', 3, '2025-03-21 21:43:47', 0, '2025-03-24 16:54:58'),
(29, 'Couscous', 'Plat traditionnel maghrébin à base de semoule et de légumes', 'Semoule de blé, légumes (carottes, courgettes, pois chiches), viande (agneau ou poulet), épices (ras el hanout)', '1. Préparer la semoule en la faisant gonfler avec un peu d\'eau chaude.\n2. Dans une grande casserole, faire cuire les légumes (carottes, courgettes, pois chiches) avec des épices (ras el hanout).\n3. Ajouter la viande (agneau ou poulet) et laisser mijoter jusqu\'à tendreté.\n4. Servir les légumes et la viande sur la semoule, accompagnés d\'un bouillon épicé.', '1h 30 min', 'Maroc', 'Moyen', '/images/Couscous.jpg', 3, '2025-03-21 21:43:59', 0, '2025-03-24 16:54:58'),
(30, 'Mlawi', 'Pain plat traditionnel du Maghreb, souvent accompagné de miel ou d\'huile d\'olive.', 'Farine, eau, huile, sel, miel ou huile d\'olive (pour accompagner)', '1. Mélanger la farine avec de l\'eau et une pincée de sel pour créer une pâte souple.\n2. Diviser la pâte en petites portions et les aplatir avec un rouleau à pâtisserie.\n3. Faire cuire les portions de pâte dans une poêle chaude jusqu\'à ce qu\'elles soient dorées des deux côtés.\n4. Servir chaud avec du miel, de l\'huile d\'olive ou une sauce au choix.', '30 min', 'Maghreb', 'Facile', '/images/mlawi.png', 3, '2025-03-21 23:38:55', 0, '2025-03-24 16:54:58'),
(31, 'Fritay', 'Un plat traditionnel haïtien comprenant des morceaux de porc ou de poulet frits, souvent accompagnés de bananes plantains et de pikliz.', 'Porc ou poulet, bananes plantains, pikliz (chou et carottes marinés), épices', '1. Préparer la viande en la coupant en morceaux et en l\'assaisonnant avec les épices de votre choix.\n2. Chauffer une poêle avec de l\'huile à feu moyen et y frire les morceaux de viande jusqu\'à ce qu\'ils soient bien dorés.\n3. Dans une autre poêle, faire frire les bananes plantains coupées en rondelles jusqu\'à ce qu\'elles soient dorées des deux côtés.\n4. Servir la viande et les bananes plantains accompagnées de pikliz pour ajouter une touche épicée et fraîche.', '1h 15 min', 'Haïti', 'Moyen', '/images/fritay.jpg', 4, '2025-03-24 11:27:34', 0, '2025-03-24 16:12:45'),
(32, 'Candinga', 'Un plat hondurien épicé préparé avec du foie ou de la viande, souvent servi avec des accompagnements locaux.', 'Foie ou viande, légumes locaux, épices (piment, ail, coriandre)', '1. Couper la viande ou le foie en morceaux et les assaisonner avec les épices (ail, coriandre, piment).\n2. Faire chauffer une poêle avec un peu d\'huile à feu moyen et y faire revenir la viande jusqu\'à ce qu\'elle soit bien dorée.\n3. Ajouter les légumes coupés en morceaux (carottes, pommes de terre, ou autres légumes locaux) et bien mélanger.\n4. Couvrir la poêle et laisser mijoter à feu doux jusqu\'à ce que les légumes soient tendres.\n5. Servir chaud avec des accompagnements locaux tels que du riz ou des tortillas.', '50 min', 'Honduras', 'Facile', '/images/candinga.jpg', 4, '2025-03-24 11:27:34', 0, '2025-03-24 16:12:46'),
(33, 'Tapado', 'Un ragoût de fruits de mer et de légumes originaire du Guatemala, souvent servi avec du lait de coco.', 'Fruits de mer, lait de coco, légumes (carottes, céleri, tomates), épices', '1. Nettoyer les fruits de mer (crevettes, crabes, poisson) et les réserver au frais.\n2. Dans une grande casserole, faire revenir les légumes coupés (carottes, céleri, tomates) avec un filet d\'huile et les épices.\n3. Ajouter le lait de coco et laisser mijoter quelques minutes pour que les saveurs se mélangent.\n4. Incorporer les fruits de mer et laisser cuire à feu doux jusqu\'à ce qu\'ils soient tendres et imbibés de saveur.\n5. Servir chaud, accompagné de riz ou de pain.', '1h', 'Guatemala', 'Moyen', '/images/tapado.jpg', 4, '2025-03-24 11:27:34', 0, '2025-03-24 16:12:46'),
(34, 'Riz Djondjon', 'Un riz noir aromatisé à base de champignons séchés (djon-djon), très populaire dans la cuisine haïtienne.', 'Riz, champignons séchés (djon-djon), haricots rouges, épices', '1. Faire cuire les haricots rouges dans de l\'eau bouillante jusqu\'à ce qu\'ils soient tendres, puis les égoutter.\n2. Dans une casserole, faire bouillir les champignons djon-djon pour libérer leur arôme et leur couleur, puis filtrer l\'eau.\n3. Utiliser l\'eau infusée de djon-djon pour cuire le riz avec des épices et des herbes (ciboulette, thym).\n4. Mélanger le riz cuit avec les haricots et laisser cuire encore quelques minutes pour que les saveurs se mélangent.\n5. Servir chaud avec du poisson ou de la viande, selon les goûts.', '1h 15 min', 'Haïti', 'Moyen', '/images/riz-djondjon.jpeg', 4, '2025-03-24 11:27:34', 0, '2025-03-24 16:12:46'),
(35, 'Soupe Joumou', 'Une soupe traditionnelle haïtienne à base de potiron, servie pour célébrer l’indépendance haïtienne.', 'Potiron, viande (facultatif), légumes (carottes, navets), épices', '1. Éplucher le potiron et les légumes, puis les couper en morceaux.\n2. Faire cuire le potiron, les carottes et les navets dans une grande casserole d\'eau avec des épices (thym, piment).\n3. Mixer les légumes cuits pour obtenir une soupe épaisse et homogène.\n4. Si vous souhaitez ajouter de la viande, faites-la cuire séparément et incorporez-la à la soupe.\n5. Servir chaud avec du pain ou des croûtons.', '1h', 'Haïti', 'Facile', '/images/soupe-joumou.jpeg', 4, '2025-03-24 11:27:34', 0, '2025-03-24 16:12:46'),
(36, 'Sapasui', 'Un plat traditionnel samoan, souvent appelé le chop suey samoan, composé de nouilles, viande et légumes.', 'Nouilles, viande (bœuf, poulet ou porc), légumes (carottes, oignons), sauce soja', '1. Faire cuire les nouilles dans de l\'eau bouillante salée jusqu\'à ce qu\'elles soient al dente, puis les égoutter.\n2. Dans une poêle chaude, faire revenir la viande coupée en morceaux avec un filet d\'huile jusqu\'à ce qu\'elle soit bien dorée.\n3. Ajouter les légumes (carottes râpées, oignons émincés) et les faire sauter avec la viande.\n4. Incorporer les nouilles cuites dans la poêle et ajouter de la sauce soja pour lier les saveurs.\n5. Mélanger et servir chaud.', '45 min', 'Samoa', 'Facile', '/images/sapasui.jpg', 6, '2025-03-24 11:42:47', 0, '2025-03-24 16:12:46'),
(37, 'Meat Pies', 'Une tartelette emblématique d\'Australie et de Nouvelle-Zélande, farcie avec de la viande, souvent servie chaude.', 'Pâte, viande (bœuf, poulet ou agneau), oignons, épices (poivre, sel)', '1. Préparer la farce en mélangeant la viande hachée avec les oignons émincés et les épices.\n2. Étaler la pâte et découper des cercles ou des rectangles pour former les pies.\n3. Placer une cuillère de farce au centre de chaque portion de pâte et refermer soigneusement les bords.\n4. Disposer les pies sur une plaque et les cuire au four préchauffé à 200°C jusqu\'à ce qu\'ils soient dorés.\n5. Servir chaud, accompagné d\'une sauce ou d\'une salade.', '1h', 'Australie et Nouvelle-Zélande', 'Moyen', '/images/meat-pies.jpg', 6, '2025-03-24 11:42:47', 0, '2025-03-24 16:12:46'),
(38, 'Kokoda', 'Un plat fidjien rafraîchissant à base de poisson cru mariné dans du lait de coco, avec des légumes et des épices.', 'Poisson cru (thon ou mahi-mahi), lait de coco, légumes (tomates, oignons), citron, épices (ail, gingembre)', '1. Découper le poisson cru en petits morceaux et le faire mariner dans le jus de citron pendant 20 minutes.\n2. Ajouter le lait de coco, les tomates coupées en dés et les oignons émincés.\n3. Assaisonner avec les épices (ail, gingembre râpé) et bien mélanger.\n4. Réfrigérer le plat pendant quelques minutes pour qu\'il reste frais.\n5. Servir comme entrée ou plat principal, accompagné de pain ou de légumes frais.', '30 min', 'Fidji', 'Facile', '/images/kokoda.jpg', 6, '2025-03-24 11:42:47', 0, '2025-03-24 16:12:46');

INSERT INTO utilisateurs (id, nom, prenom, email, mdp, role, date_creation) VALUES
(16, 'Admin', 'Cookin', 'admin@cookin.com', '967520ae23e8ee14888bae72809031b98398ae4a636773e18fff917d77679334', 'admin', '2025-03-22 22:30:14');
