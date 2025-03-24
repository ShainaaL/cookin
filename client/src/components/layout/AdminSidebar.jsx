
// src/components/layout/AdminSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Tableau de bord' },
    { path: '/admin/recipes', icon: '🍲', label: 'Recettes' },
    { path: '/admin/users', icon: '👥', label: 'Utilisateurs' },
    { path: '/admin/comments', icon: '💬', label: 'Commentaires' },
    { path: '/', icon: '🏠', label: 'Retour au site' }
  ];

  return (
    <aside className="w-64 bg-indigo-800 text-white">
      <div className="p-4">
        <Link to="/admin" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Cookin'</span>
          <span className="text-sm bg-indigo-600 px-2 py-1 rounded">Admin</span>
        </Link>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm ${
                  location.pathname === item.path
                    ? 'bg-indigo-900 border-l-4 border-white'
                    : 'hover:bg-indigo-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;