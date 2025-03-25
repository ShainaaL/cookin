import React from 'react';

const LegalPage = () => {
  return (
    <div className="container_a">
      {/* Titre centré */}
      <h1 className="text-2xl font-bold mb-8">Mentions légales</h1>

      {/* Texte central */}
      <p className="text-gray-700 mb-16">
        Cookin' est une plateforme de partage de recettes, détenue et opérée par Piz.
        Tous les contenus publiés sur ce site, y compris les textes, les images et les vidéos,
        sont protégés par les lois sur le droit d'auteur. Toute reproduction ou utilisation non autorisée est interdite.
      </p>

      {/* Texte en bas, espacé */}
      <p className="text-gray-700 mt-16">
        Pour toute question juridique concernant notre site, veuillez nous contacter à l'adresse suivante :
        <strong> legal@cookin.com</strong>.
      </p>
    </div>
  );
};

export default LegalPage;
