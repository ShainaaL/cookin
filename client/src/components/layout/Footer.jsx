import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Alignement horizontal */}
        <div className="flex justify-between items-start space-x-8">
          {/* Section Cookin' */}
          <div>
            <h3 className="font-semibold mb-2">Cookin'</h3>
            <p>
              Découvrez des recettes du monde entier, soigneusement sélectionnées par notre chef
              pour vous faire voyager à travers les saveurs.
            </p>
          </div>

          {/* Section Explorez */}
          <div>
            <h3 className="font-semibold mb-2">Explorez</h3>
            <div className="space-x-4">
              <Link 
                to="/continent/1" 
                className="text-white hover:text-indigo-300 no-underline"
              >
                Europe </Link>
              <Link 
                to="/continent/2" 
                className="text-white hover:text-indigo-300 no-underline"
              > Asie </Link>
              <Link 
                to="/continent/3" 
                className="text-white hover:text-indigo-300 no-underline"
              >  Afrique </Link>
              <Link 
                to="/continent/4" 
                className="text-white hover:text-indigo-300 no-underline"
              > Amérique du Nord </Link>
              <Link 
                to="/continent/5" 
                className="text-white hover:text-indigo-300 no-underline"
              > Amérique du Sud </Link>
              <Link 
                to="/continent/6" 
                className="text-white hover:text-indigo-300 no-underline"
              > Océanie </Link>
            </div>
          </div>

          {/* Section À propos */}
          <div>
            <h3 className="font-semibold mb-2">À propos</h3>
            <div className="space-x-4">
              <Link 
                to="/about" 
                className="text-white hover:text-indigo-300 no-underline"
              > Le Chef </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-indigo-300 no-underline"
              > Contact </Link>
              <Link 
                to="/legal" 
                className="text-white hover:text-indigo-300 no-underline"
              > Mentions légales </Link>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} Cookin'. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
