import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        if (username.length < 1) {
          setError('Please enter your username or email');
          setIsLoading(false);
          return;
        }

        if (password.length < 1) {
          setError('Please enter your password');
          setIsLoading(false);
          return;
        }

        const success = await login(username, password);
        if (success) {
          onClose();
          resetForm();
        } else {
          setError('Invalid username/email or password');
        }
      } else {
        // Register
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }

        if (username.length < 3) {
          setError('Username must be at least 3 characters long');
          setIsLoading(false);
          return;
        }

        if (!email.includes('@') || email.length < 5) {
          setError('Please enter a valid email address');
          setIsLoading(false);
          return;
        }

        const success = await register(username, email, password);
        if (success) {
          onClose();
          resetForm();
        } else {
          setError('Username or email already exists');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              {isLogin ? 'Username or Email' : 'Username'}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              placeholder={isLogin ? 'Enter username or email' : 'Choose a username'}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Confirm your password"
                minLength={6}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-button"
              onClick={handleToggleMode}
              disabled={isLoading}
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>

        <div className="demo-info">
          <h4>Demo Information</h4>
          <p>This is a demo authentication system using localStorage.</p>
          <p>In production, use proper authentication services like Firebase Auth, Auth0, or custom backend APIs.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;