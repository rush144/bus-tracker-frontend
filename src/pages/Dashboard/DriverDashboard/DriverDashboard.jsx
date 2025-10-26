import React, { useState, useRef } from 'react';
import socket from '../../../../socket';
import './style.css';
import { GlobalChat } from '../../../components/GlobalChat/GlobalChat';
import { MessageCircle, User, MapPin } from 'lucide-react';
import BusMap from '../../../components/BusMap/BusMap';

export default function DriverDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('map');
  const [sendingLocation, setSendingLocation] = useState(false);
  const watchIdRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleLocation = () => {
    if (sendingLocation) {
      // Stop location
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setSendingLocation(false);
    } else {
      // Start location
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          socket.emit('locationUpdate', {
            id: user.username,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      watchIdRef.current = watchId;
      setSendingLocation(true);
    }
  };

  return (
    <div className="driver-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Welcome, {user.name} (Driver) 👋</h2>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'map' && (
          <div className="tab-content map-tab">
            <button
              className={`location-button ${sendingLocation ? 'active' : ''}`}
              onClick={toggleLocation}
            >
              {sendingLocation ? '🛑 Stop Location' : '📍 Start Location'}
            </button>

            {/* <BusMap/> */}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="tab-content chat-tab">
            <GlobalChat username={user.username} role={user.role} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="tab-content profile-tab">
            <h3>Your Profile</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button className="logout-button" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={activeTab === 'map' ? 'nav-item active' : 'nav-item'}
          onClick={() => setActiveTab('map')}
        >
          <MapPin size={22} />
          <span>Map</span>
        </button>

        <button
          className={activeTab === 'chat' ? 'nav-item active' : 'nav-item'}
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle size={22} />
          <span>Chat</span>
        </button>

        <button
          className={activeTab === 'profile' ? 'nav-item active' : 'nav-item'}
          onClick={() => setActiveTab('profile')}
        >
          <User size={22} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
