import React from 'react';

import { X } from 'lucide-react';
import { getPostDetails } from '../data/constants';

const PostDetailModal = ({ post, isAcknowledged, onClose, onAcknowledge }) => {
  const details = getPostDetails(post.id);
  
  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Location</p>
              <p className="font-semibold">Booth {post.booth}</p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Shift Hours</p>
              <p className="font-semibold">{post.shift}</p>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Key Responsibilities</p>
              <ul className="text-sm space-y-1">
                {details.responsibilities.map((resp, index) => (
                  <li key={index}>• {resp}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Required Equipment</p>
              <ul className="text-sm space-y-1">
                {details.equipment.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            {!isAcknowledged && (
              <button
                onClick={onAcknowledge}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                Acknowledge This Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
