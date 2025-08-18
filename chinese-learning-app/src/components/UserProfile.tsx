import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVocabulary } from '../contexts/VocabularyContext';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { vocabulary } = useVocabulary();
  const [showProfile, setShowProfile] = useState<boolean>(false);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  const getVocabularyStats = () => {
    const level1 = vocabulary.filter(word => word.level === 1).length;
    const level2 = vocabulary.filter(word => word.level === 2).length;
    const level3 = vocabulary.filter(word => word.level === 3).length;
    return { level1, level2, level3, total: vocabulary.length };
  };

  const stats = getVocabularyStats();

  return (
    <div className="user-profile-container">
      <button 
        className="profile-button"
        onClick={() => setShowProfile(!showProfile)}
      >
        <span className="user-icon">👤</span>
        {user.username}
      </button>

      {showProfile && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <h3>Welcome, {user.username}!</h3>
            <p className="user-email">{user.email}</p>
            <p className="member-since">
              Member since: {new Date(user.registeredAt).toLocaleDateString()}
            </p>
          </div>

          <div className="profile-stats">
            <h4>Your Progress</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total Words</span>
              </div>
              <div className="stat-item level-1">
                <span className="stat-number">{stats.level1}</span>
                <span className="stat-label">Beginner</span>
              </div>
              <div className="stat-item level-2">
                <span className="stat-number">{stats.level2}</span>
                <span className="stat-label">Intermediate</span>
              </div>
              <div className="stat-item level-3">
                <span className="stat-number">{stats.level3}</span>
                <span className="stat-label">Advanced</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;