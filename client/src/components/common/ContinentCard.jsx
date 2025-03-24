// src/components/common/ContinentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ContinentCard = ({ continent }) => {
  return (
    <Link to={`/continent/${continent.id}`} className="block">
      <div className="continent-card bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
        <div className="relative h-48">
          <img 
            src={continent.image_url || '/images/platM.jpg'} 
            alt={continent.name}
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">{continent.name}</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-600">{continent.description}</p>
          <div className="mt-3 text-sm text-blue-600">
            {continent.recipe_count} recettes disponibles
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContinentCard;