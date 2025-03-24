import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contactez-nous</h1>
      <p className="text-gray-700 mb-4">
        Nous serions ravis d'avoir de vos nouvelles! Si vous avez des questions, des suggestions 
        ou des idées, n'hésitez pas à nous envoyer un message.
      </p>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-600">Nom :</label>
          <input
            type="text"
            id="name"
            className="w-full border rounded px-3 py-2"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-600">Email :</label>
          <input
            type="email"
            id="email"
            className="w-full border rounded px-3 py-2"
            placeholder="Votre email"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-600">Message :</label>
          <textarea
            id="message"
            className="w-full border rounded px-3 py-2"
            placeholder="Votre message"
            rows="4"
          ></textarea>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
