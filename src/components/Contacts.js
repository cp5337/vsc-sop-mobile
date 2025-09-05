/**
 * Contacts Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Contact management component providing quick access to emergency and operational contacts
 * Implements native phone dialing functionality for mobile devices
 */
import React from 'react';
import { Phone, ArrowLeft } from 'lucide-react';

const Contacts = ({ contacts, onBack }) => {
  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Overview
        </button>
      </div>
      {contacts.map((contact) => (
        <a
          key={contact.name}
          href={`tel:${contact.number.replace(/[^\d]/g, '')}`}
          className={`block p-5 rounded-xl border transition-colors ${
            contact.priority === 'primary' 
              ? 'bg-gray-800 border-gray-600 hover:border-red-500' 
              : 'bg-gray-800 border-gray-700 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{contact.name}</h3>
              <p className="text-blue-400 font-mono">{contact.number}</p>
              <p className="text-sm text-gray-400 mt-1">{contact.purpose}</p>
            </div>
            <Phone className="w-6 h-6 text-gray-400" />
          </div>
        </a>
      ))}
    </div>
  );
};

export default Contacts;
