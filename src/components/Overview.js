/**
 * Overview Dashboard Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Main dashboard component displays VSC status, quick actions, and executive team
 * 30% LOC will be implemented for further development
 */
import React, { useState } from 'react';

import { Shield, AlertCircle, Users, Clock, MapPin, CheckCircle, Phone, FileWarning, Camera, QrCode, FileText, ChevronDown, ChevronUp, Settings, RefreshCw, Calendar, Plus, Hash, ClipboardList, Scan, BarChart3, Activity, Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';
import WTCLogo from './WTCLogo';

const Overview = ({ onQuickAction }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showExecutives, setShowExecutives] = useState(false);
  const [weather, setWeather] = useState(null);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather fetching function gets current weather conditions
  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
        
        // Try NYC weather first as a simple test
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=New York&appid=${apiKey}&units=imperial`
        );
        
        if (response.ok) {
          const data = await response.json();
          setWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description
          });
        } else {
          // Fallback to mock data if API fails
          setWeather({
            temp: 72,
            condition: 'Clear',
            description: 'clear sky'
          });
        }
      } catch (error) {
        // Fallback to mock data if API fails
        setWeather({
          temp: 72,
          condition: 'Clear',
          description: 'clear sky'
        });
      }
    };

    fetchWeather();
  }, []);

  // Weather icon function returns appropriate icon based on weather condition
  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase();
    if (conditionLower?.includes('clear') || conditionLower?.includes('sun')) {
      return <Sun className="w-4 h-4 text-yellow-400" />;
    } else if (conditionLower?.includes('rain') || conditionLower?.includes('drizzle')) {
      return <CloudRain className="w-4 h-4 text-blue-400" />;
    } else if (conditionLower?.includes('snow')) {
      return <CloudSnow className="w-4 h-4 text-blue-200" />;
    } else if (conditionLower?.includes('wind')) {
      return <Wind className="w-4 h-4 text-gray-400" />;
    } else {
      return <Cloud className="w-4 h-4 text-gray-400" />;
    }
  };

  const quickActions = [
    { icon: Phone, label: 'Emergency', color: 'bg-red-800 hover:bg-red-900', action: 'emergency' },
    { icon: FileWarning, label: 'Incident Report', color: 'bg-slate-700 hover:bg-slate-800', action: 'incident-report' },
    { icon: CheckCircle, label: 'Daily Checklist', color: 'bg-slate-700 hover:bg-slate-800', action: 'checklist' },
    { icon: Shield, label: 'Post Orders', color: 'bg-slate-700 hover:bg-slate-800', action: 'posts' },
    { icon: Camera, label: 'Take Photo', color: 'bg-slate-600 hover:bg-slate-700', action: 'camera' },
    { icon: QrCode, label: 'Scan QR', color: 'bg-slate-600 hover:bg-slate-700', action: 'qr' },
    { icon: FileText, label: 'Scan Document', color: 'bg-slate-600 hover:bg-slate-700', action: 'document' },
    { icon: Settings, label: 'Admin Panel', color: 'bg-slate-600 hover:bg-slate-700', action: 'admin' },
    { icon: RefreshCw, label: 'QR Updates', color: 'bg-slate-600 hover:bg-slate-700', action: 'qr-updates' },
    { icon: Calendar, label: 'Daily Check-In', color: 'bg-slate-600 hover:bg-slate-700', action: 'daily-checkin' },
    { icon: Hash, label: 'View Logs', color: 'bg-slate-600 hover:bg-slate-700', action: 'view-logs' },
    { icon: ClipboardList, label: 'Task Manager', color: 'bg-slate-600 hover:bg-slate-700', action: 'task-manager' },
    { icon: Scan, label: 'Scan Task', color: 'bg-slate-600 hover:bg-slate-700', action: 'task-scanner' },
    { icon: BarChart3, label: 'Task Dashboard', color: 'bg-slate-600 hover:bg-slate-700', action: 'task-dashboard' },
    { icon: Plus, label: 'Generate QR', color: 'bg-slate-600 hover:bg-slate-700', action: 'qr-generator' }
  ];

  return (
    <div className="space-y-4">
      {/* Header with WTC/PANYNJ branding */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <div>
            <WTCLogo size="default" showTagline={true} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-white">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-blue-200">
              {currentTime.toLocaleDateString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              v1.8
            </div>
            {/* Weather display shows current temperature and condition */}
            {weather && (
              <div className="flex items-center justify-end mt-2 text-white">
                {getWeatherIcon(weather.condition)}
                <span className="ml-1 text-sm font-medium">{weather.temp}°F</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex items-center text-white">
            <MapPin className="w-4 h-4 mr-2 text-blue-200" />
            <span>140 Liberty St.</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onQuickAction && onQuickAction(action.action)}
            className={`${action.color} p-4 rounded-xl text-white text-center hover:opacity-90 transition-opacity`}
          >
            <action.icon className="w-8 h-8 mx-auto mb-2" />
            <div className="font-semibold text-sm">{action.label}</div>
          </button>
        ))}
      </div>

      {/* Status Cards */}
      <div className="bg-blue-600 p-4 rounded-xl border border-blue-500">
        <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
          <Clock className="mr-2 text-blue-200" />
          WTC VSC Status
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 bg-blue-700 border border-blue-400 rounded-lg">
            <span className="text-white font-medium">All Systems Operational</span>
            <CheckCircle className="w-5 h-5 text-green-300" />
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-700 border border-blue-400 rounded-lg">
            <span className="text-white font-medium">24/7 Operations Active</span>
            <Activity className="w-5 h-5 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <button
          onClick={() => setShowExecutives(!showExecutives)}
          className="w-full flex items-center justify-between text-left hover:bg-gray-700 p-2 rounded-lg transition-colors"
        >
          <h3 className="text-xl font-bold flex items-center">
            <Users className="mr-2 text-blue-400" />
            WTC Executive Management Team
          </h3>
          {showExecutives ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {showExecutives && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div key={num} className="text-center">
                  <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                    <img 
                      src={`/images/executives/exec-${num}.jpg`} 
                      alt={`Executive ${num}`} 
                      className="w-full h-32 object-cover rounded-lg mb-2"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-32 bg-gray-800 rounded-lg mb-2 flex items-center justify-center hidden">
                      <div className="text-center">
                        <div className="text-xl mb-1">👤</div>
                        <span className="text-gray-400 text-xs">Executive {num}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 font-medium">Executive {num}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-bold">PM</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Oronde "Ron" Ward</p>
                  <p className="text-sm text-gray-400">Project Manager</p>
                  <p className="text-xs text-blue-400">(718) 872-8717</p>
                </div>
              </div>
            </div>
          </div>
        )}
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <p className="text-sm text-gray-300 mb-3 font-medium">Standard Pattern</p>
              <img 
                src="/images/Cones 1.jpg" 
                alt="Standard cone pattern" 
                className="rounded-lg w-full h-48 object-contain bg-gray-800"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="bg-gray-800 rounded-lg w-full h-48 flex items-center justify-center hidden">
                <div className="text-center">
                  <div className="text-2xl mb-2">🟢</div>
                  <span className="text-gray-400 text-sm">Green cones with reflective stripes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <p className="text-sm text-gray-300 mb-3 font-medium">Alternate Angle</p>
              <img 
                src="/images/Cones 2.jpg" 
                alt="Alternate view" 
                className="rounded-lg w-full h-48 object-contain bg-gray-800"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="bg-gray-800 rounded-lg w-full h-48 flex items-center justify-center hidden">
                <div className="text-center">
                  <div className="text-2xl mb-2">🟡</div>
                  <span className="text-gray-400 text-sm">Double yellow line positioning</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <p className="text-sm text-gray-300 mb-3 font-medium">Full Configuration</p>
              <img 
                src="/images/Cones 4.jpg" 
                alt="Full configuration" 
                className="rounded-lg w-full h-48 object-contain bg-gray-800"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="bg-gray-800 rounded-lg w-full h-48 flex items-center justify-center hidden">
                <div className="text-center">
                  <div className="text-2xl mb-2">🛣️</div>
                  <span className="text-gray-400 text-sm">Entry Lane 1 to Liberty Street</span>
                </div>
              </div>
            </div>
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