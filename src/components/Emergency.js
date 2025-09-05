/**
 * Emergency Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Emergency procedures and codes display component for critical security operations
 * Provides quick access to emergency protocols and communication procedures
 */
import React from 'react';
import { Radio, ArrowLeft } from 'lucide-react';

const Emergency = ({ emergencyCodes, onBack }) => {
  return (
    <div className="space-y-6">
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
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-white flex items-center">
          <Radio className="mr-2" />
          Emergency Codes
        </h3>
        {emergencyCodes.map((code) => (
          <div key={code.code} className="mb-6 last:mb-0">
            <div className="flex items-start justify-between mb-3">
              <span className={`font-mono font-bold text-xl ${
                code.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {code.code}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                code.severity === 'critical' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
              }`}>
                {code.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-white font-semibold text-lg mb-2">{code.description}</p>
            <p className="text-sm text-gray-300 mb-3">{code.action}</p>
            
            {code.response && (
              <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">Response Procedures:</h4>
                <ol className="space-y-1">
                  {code.response.map((step, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2 font-bold">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4">Evacuation Routes</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Primary Route</h4>
            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
              <li>Exit booth onto Liberty Street</li>
              <li>Turn RIGHT (East)</li>
              <li>Proceed to SE corner Greenwich & Liberty</li>
              <li>Report to MSA supervisor</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Alternate Route</h4>
            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
              <li>Exit toward West Street</li>
              <li>Turn LEFT (South)</li>
              <li>Proceed to Battery Park City</li>
              <li>Call command center</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
