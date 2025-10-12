import React, { useState, useEffect } from 'react';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';
import Login from './components/Login';
import HomePage from './components/HomePage';
import campaignService from './services/campaignService';
import './App.css';
import './neon-theme.css';

function App() {
    const [campaigns, setCampaigns] = useState([]);
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [networkError, setNetworkError] = useState(false);
    const [health, setHealth] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        loadCampaigns();
        try {
            const raw = localStorage.getItem('ct_user');
            if (raw) setUser(JSON.parse(raw));
        } catch (err) {
            // ignore
        }
    }, []);

    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => {
                setError('');
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, successMessage]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserDropdown && !event.target.closest('.user-dropdown')) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserDropdown]);

    const loadCampaigns = async () => {
        setIsLoading(true);
        try {
            const response = await campaignService.getAllCampaigns();
            setCampaigns(response.data || []);
            setNetworkError(false);
        } catch (error) {
            if (
                (error && error.message === 'Network Error') ||
                error === 'Network Error' ||
                (error && error.success === false)
            ) {
                setNetworkError(true);
            }
            setError('Failed to load campaigns');
            console.error('Error loading campaigns:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkHealth = async () => {
        try {
            const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/health');
            if (!res.ok) throw new Error('unhealthy');
            const body = await res.json();
            setHealth('ok');
            setNetworkError(false);
            return body;
        } catch (err) {
            setHealth('down');
            setNetworkError(true);
            return null;
        }
    };

    // Search/filter state
    const [query, setQuery] = useState('');
    const filteredCampaigns = campaigns.filter(c =>
        !query ||
        c.campaign_name.toLowerCase().includes(query.toLowerCase()) ||
        c.client_name.toLowerCase().includes(query.toLowerCase())
    );

    // Create new campaign
    const handleCampaignCreated = async (campaignData) => {
        setIsLoading(true);
        try {
            const response = await campaignService.createCampaign(campaignData);
            setCampaigns(prev => [response.data, ...prev]);
            setSuccessMessage('Campaign created successfully!');
            setShowForm(false);
        } catch (error) {
            setError('Failed to create campaign');
            console.error('Error creating campaign:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (campaignId, newStatus) => {
        try {
            await campaignService.updateCampaignStatus(campaignId, newStatus);
            setCampaigns(prev =>
                prev.map(campaign =>
                    campaign.id === campaignId
                        ? { ...campaign, status: newStatus }
                        : campaign
                )
            );
            setSuccessMessage('Campaign status updated successfully!');
        } catch (error) {
            setError('Failed to update campaign status');
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteCampaign = async (campaignId) => {
        try {
            await campaignService.deleteCampaign(campaignId);
            setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
            setSuccessMessage('Campaign deleted successfully!');
        } catch (error) {
            setError('Failed to delete campaign');
            console.error('Error deleting campaign:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('ct_user');
        setUser(null);
        setShowUserDropdown(false);
        setShowLogin(false);
    };

    return (
        <div className="App neon-bg">
            {user && (
                <header className="app-header">
                    <div className="header-left">
                        <h1>Campaign Tracker</h1>
                    </div>
                    <div className="header-actions">
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn btn-primary icon-btn"
                            disabled={showForm}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="btn-label">Add New</span>
                        </button>

                        <div className="user-dropdown">
                            <button 
                                className="user-avatar-btn"
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                aria-label="User menu"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            {showUserDropdown && (
                                <div className="user-dropdown-menu">
                                    <div className="user-info">
                                        <div className="user-name">{user.name}</div>
                                        <div className="user-email">{user.email}</div>
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {!user && !showLogin && (
                <main className="app-main">
                    <HomePage onLogin={() => setShowLogin(true)} />
                </main>
            )}

            {!user && showLogin && (
                <main className="app-main">
                    <Login 
                        onLogin={(u) => { 
                            setUser(u); 
                            setShowLogin(false);
                        }}
                        showBackButton={true}
                        onBack={() => setShowLogin(false)}
                    />
                </main>
            )}

            {user && (
                <>
                    {networkError && (
                        <div className="message error" style={{ margin: '12px 0' }}>
                            API unreachable — start the backend (run the server on port 5000) to enable full functionality.
                        </div>
                    )}

                    {successMessage && (
                        <div className="message success">{successMessage}</div>
                    )}
                    {error && (
                        <div className="message error">{error}</div>
                    )}

                    <main className="app-main">
                        <div className="top-controls">
                            <div className="search">
                                <input
                                    type="text"
                                    placeholder="Search campaigns or clients..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {showForm ? (
                            <CampaignForm
                                onCampaignCreated={handleCampaignCreated}
                                onCancel={() => setShowForm(false)}
                                isLoading={isLoading}
                            />
                        ) : (
                            <CampaignList
                                campaigns={filteredCampaigns}
                                onStatusUpdate={handleStatusUpdate}
                                onDeleteCampaign={handleDeleteCampaign}
                                isLoading={isLoading}
                            />
                        )}
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
