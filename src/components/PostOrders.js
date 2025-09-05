/**
 * Post Orders Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Post orders management component with search functionality and detailed post information
 * Provides post selection, acknowledgment tracking, and detailed modal views
 */
import React, { useState } from 'react';
import { Search, MapPin, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import PostDetailModal from './PostDetailModal';

const PostOrders = ({ posts, acknowledgedPosts, onAcknowledge }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.booth.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts or booths..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-gray-800 p-5 rounded-xl border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Booth {post.booth}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.shift}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {acknowledgedPosts.includes(post.id) && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          isAcknowledged={acknowledgedPosts.includes(selectedPost.id)}
          onClose={() => setSelectedPost(null)}
          onAcknowledge={() => {
            onAcknowledge(selectedPost.id);
            setSelectedPost(null);
          }}
        />
      )}
    </>
  );
};

export default PostOrders;
