import React, { useState } from 'react';
import './App.css';
import ChineseTextInput from './components/ChineseTextInput';
import VocabularyManager from './components/VocabularyManager';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { VocabularyProvider } from './contexts/VocabularyContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DisplaySettingsProvider } from './contexts/DisplaySettingsContext';

const AppContent: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Chinese Learning App</h1>
            <p>Enter Chinese text to segment and learn with Pinyin and translations</p>
          </div>
          <div className="header-right">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <button 
                className="login-button"
                onClick={() => setShowAuthModal(true)}
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="App-main">
        <ChineseTextInput />
        <VocabularyManager />
      </main>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <VocabularyProvider>
        <DisplaySettingsProvider>
          <AppContent />
        </DisplaySettingsProvider>
      </VocabularyProvider>
    </AuthProvider>
  );
}

export default App;
