import React from 'react';
import './HomePage.css';

const HomePage = ({ onLogin }) => {
  return (
    <div className="home-container">
      <div className="home-background">
        <div className="home-top-bar">
          <div className="home-brand">
            <h1>Campaign Tracker</h1>
          </div>
          <div className="login-icon-container">
            <button className="login-icon-btn" onClick={onLogin} aria-label="Login to Campaign Tracker">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="login-tooltip">
              <span>Click to Sign In</span>
            </div>
          </div>
        </div>
        
        <div className="home-main">
          <div className="home-header">
            <p>Manage your marketing campaigns efficiently</p>
          </div>
          
          <div className="home-content">
            <div className="home-features">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM21 11h-4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Campaign Management</h3>
                <p>Create, organize, and track all your marketing campaigns in one place</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3v5h5M3 8l9-5 9 5-9 5-9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 16v5h-5M21 21l-7-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Real-time Analytics</h3>
                <p>Monitor campaign performance with detailed analytics and reports</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Team Collaboration</h3>
                <p>Work together with your team to achieve campaign objectives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;