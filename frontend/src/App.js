import React, { useState, useEffect } from 'react';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';
import campaignService from './services/campaignService';
import './App.css';

function App() {
    const [campaigns, setCampaigns] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [networkError, setNetworkError] = useState(false);
    const [health, setHealth] = useState(null);

    // Load campaigns on component mount
    useEffect(() => {
        loadCampaigns();
    }, []);

    // Clear messages after 3 seconds
    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => {
                setError('');
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, successMessage]);

    // Load all campaigns
    const loadCampaigns = async () => {
        setIsLoading(true);
        try {
            const response = await campaignService.getAllCampaigns();
            setCampaigns(response.data || []);
            setNetworkError(false);
        } catch (error) {
            // If it's a network error, show a persistent notice
            // Normalize network error detection (avoid mixed &&/|| operators)
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

    // Derived counts for dashboard
    const counts = campaigns.reduce(
        (acc, c) => {
            acc.total += 1;
            if (c.status === 'active') acc.active += 1;
            if (c.status === 'paused') acc.paused += 1;
            if (c.status === 'completed') acc.completed += 1;
            return acc;
        },
        { total: 0, active: 0, paused: 0, completed: 0 }
    );

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

    // Update campaign status
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

    // Delete campaign
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

    return (
        <div className="App">
            <header className="app-header">
                <h1>Campaign Tracker</h1>
                <div className="header-actions">
                    <button
                        onClick={() => loadCampaigns()}
                        className="btn btn-secondary icon-btn"
                        title="Refresh campaigns"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M21 12a9 9 0 10-2.19 5.62l1.45-1.45A7 7 0 1119 12h2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="btn-label">Refresh</span>
                    </button>
                    <button
                        onClick={() => checkHealth()}
                        className="btn btn-ghost icon-btn"
                        title="Check API health"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="health-dot" style={{ background: health === 'ok' ? 'var(--success)' : (health === 'down' ? 'var(--danger)' : 'var(--muted)') }}></span>
                        <span className="btn-label">API</span>
                    </button>
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
                </div>
            </header>

            {networkError && (
                <div className="message error" style={{ margin: '12px 0' }}>
                    API unreachable — start the backend (run the server on port 5000) to enable full functionality.
                </div>
            )}

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="message success">{successMessage}</div>
            )}
            {error && (
                <div className="message error">{error}</div>
            )}

            <main className="app-main">
                <div className="top-controls">
                    <div className="dashboard">
                        <div>Total: {counts.total}</div>
                        <div>Active: {counts.active}</div>
                        <div>Paused: {counts.paused}</div>
                        <div>Completed: {counts.completed}</div>
                    </div>
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
        </div>
    );
}

export default App;
