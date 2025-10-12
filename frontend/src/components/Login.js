import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, showBackButton = false, onBack }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const loadUsers = () => {
    try {
      const raw = localStorage.getItem('ct_users');
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  };

  const saveUsers = (users) => {
    try { localStorage.setItem('ct_users', JSON.stringify(users)); } catch (err) { }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!validateName(name)) {
      setError('Name must be at least 2 characters long');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const users = loadUsers();
    if (users[email.toLowerCase()]) {
      setError('An account with this email already exists');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      users[email.toLowerCase()] = { name: name.trim(), email: email.toLowerCase(), password };
      saveUsers(users);
      localStorage.setItem('ct_user', JSON.stringify({ name: name.trim(), email: email.toLowerCase() }));
      onLogin({ name: name.trim(), email: email.toLowerCase() });
      setIsLoading(false);
    }, 800);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    const users = loadUsers();
    const found = users[email.toLowerCase()];
    
    // Simulate API delay
    setTimeout(() => {
      if (!found || found.password !== password) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }
      localStorage.setItem('ct_user', JSON.stringify({ name: found.name, email: found.email }));
      onLogin({ name: found.name, email: found.email });
      setIsLoading(false);
    }, 600);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-header">
          <h1>Campaign Tracker</h1>
          <p>Manage your campaigns efficiently</p>
        </div>
        
        <div className="login-card-wrapper">
          {showBackButton && (
            <button type="button" className="back-button" onClick={onBack}>
              ← Back to Home
            </button>
          )}
          
          <div className="login-card">
            <div className="form-header">
              <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="form-subtitle">
                {mode === 'login' 
                  ? 'Sign in to access your campaigns' 
                  : 'Join us to start tracking your campaigns'
                }
              </p>
            </div>

            <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
              {error && <div className="error-message">{error}</div>}

              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    className={error && !validateName(name) ? 'error' : ''}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  className={error && !validateEmail(email) ? 'error' : ''}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder={mode === 'register' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                  disabled={isLoading}
                  className={error && !validatePassword(password) ? 'error' : ''}
                />
              </div>

              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className={error && password !== confirmPassword ? 'error' : ''}
                  />
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary-login"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>

              <div className="form-footer">
                {mode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button type="button" className="link-button" onClick={() => switchMode('register')} disabled={isLoading}>
                      Create one here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button type="button" className="link-button" onClick={() => switchMode('login')} disabled={isLoading}>
                      Sign in instead
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
