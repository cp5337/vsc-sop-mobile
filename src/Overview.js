import React from 'react';
import { Shield, AlertCircle, Users } from 'lucide-react';

const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Vehicle Security Center</h2>
        <p className="text-gray-300 mb-4">
          Port Authority of New York and New Jersey
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Version</p>
            <p className="font-semibold">2.0</p>
          </div>
          <div>
            <p className="text-gray-400">Effective Date</p>
            <p className="font-semibold">Sept 4, 2025</p>
          </div>
          <div>
            <p className="text-gray-400">Location</p>
            <p className="font-semibold">140 Liberty St.</p>
          </div>
          <div>
            <p className="text-gray-400">Document #</p>
            <p className="font-semibold">VSC-SOP-2025-002</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Users className="mr-2 text-blue-400" />
          PANYNJ Executive Management Team
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} className="text-center">
              <img 
                src={`/images/executives/exec-${num}.jpg`} 
                alt={`Executive ${num}`} 
                className="w-24 h-32 object-cover rounded-lg mx-auto mb-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-24 h-32 bg-gray-700 rounded-lg mx-auto mb-2 items-center justify-center hidden">
                <span className="text-gray-500 text-xs">Exec {num}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <div className="w-24 h-32 bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <span className="text-gray-500 text-xs">PM</span>
          </div>
          <p className="font-semibold">Oronde "Ron" Ward</p>
          <p className="text-sm text-gray-400">Project Manager</p>
          <p className="text-xs text-blue-400">(718) 872-8717</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Shield className="mr-2 text-blue-400" />
          Facility Overview
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          The VSC serves as the primary security screening point for all vehicles accessing the World Trade Center complex. 
          Operating 24/7/365, the facility features state-of-the-art screening technology including radiation portal monitors, 
          vehicle X-ray gantries, and explosive detection capabilities.
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4">Cone Configuration</h3>
        <p className="text-gray-300 text-sm mb-4">
          Green safety cones with reflective stripes must be positioned along the double yellow line from Entry Lane 1 guard booth to Liberty Street median.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Standard Pattern</p>
            <img src="/images/cone-pattern-1.jpg" alt="Standard cone pattern" className="rounded-lg w-full" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Alternate Angle</p>
            <img src="/images/cone-pattern-2.jpg" alt="Alternate view" className="rounded-lg w-full" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Full Configuration</p>
            <img src="/images/cone-pattern-3.jpg" alt="Full configuration" className="rounded-lg w-full" />
          </div>
        </div>
        <div className="mt-4 bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
          <p className="text-sm text-yellow-400">
            <strong>Maintenance:</strong> Check hourly, realign immediately if disrupted
          </p>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-700 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-400">Safety Requirements</h4>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• Wear appropriate PPE and safety vests</li>
              <li>• Always wear radiation dosimeter</li>
              <li>• Steel-toed boots required at operational posts</li>
              <li>• Follow all OSHA and PANYNJ safety rules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;