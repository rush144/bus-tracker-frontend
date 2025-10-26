import React, { useState } from 'react';
import './style.css';
import BusMap from '../../../components/BusMap/BusMap';
import { GlobalChat } from '../../../components/GlobalChat/GlobalChat';
import { useNavigate } from 'react-router-dom';
import { MapPin, MessageCircle, User } from 'lucide-react';

export default function PassengerDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'chat' | 'profile'

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="passenger-dashboard">
      {/* Header */}
      <header className="passenger-header">
        <h2>Welcome, {user.name} 👋</h2>
      </header>

      {/* Main content */}
      <div className="dashboard-content">
        {activeTab === 'map' && (
          <div className="tab-content">
            <p className="info-text">See live bus locations below:</p>
            <BusMap />
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
