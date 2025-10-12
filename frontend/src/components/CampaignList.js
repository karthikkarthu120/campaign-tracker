import React from 'react';
import './CampaignList.css';

const CampaignList = ({ 
    campaigns, 
    onStatusUpdate, 
    onDeleteCampaign, 
    isLoading 
}) => {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status badge class
    const getStatusClass = (status) => {
        switch (status) {
            case 'active':
                return 'status-active';
            case 'paused':
                return 'status-paused';
            case 'completed':
                return 'status-completed';
            default:
                return 'status-default';
        }
    };

    // Handle status change
    const handleStatusChange = (campaignId, newStatus) => {
        onStatusUpdate(campaignId, newStatus);
    };

    // Handle delete with confirmation
    const handleDelete = (campaignId, campaignName) => {
        if (window.confirm(`Are you sure you want to delete "${campaignName}"?`)) {
            onDeleteCampaign(campaignId);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading campaigns...</div>;
    }

    if (campaigns.length === 0) {
        return (
            <div className="empty-state">
                <p>No campaigns found. Create your first campaign!</p>
            </div>
        );
    }

    return (
        <div className="campaign-list">
            <h2>Campaigns ({campaigns.length})</h2>
            <div className="table-container">
                <table className="campaigns-table">
                    <thead>
                        <tr>
                            <th>Campaign Name</th>
                            <th>Client Name</th>
                            <th>Start Date</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign) => (
                            <tr key={campaign.id}>
                                <td className="campaign-name">
                                    {campaign.campaign_name}
                                </td>
                                <td>{campaign.client_name}</td>
                                <td>{formatDate(campaign.start_date)}</td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(campaign.status)}`}>
                                        {campaign.status}
                                    </span>
                                </td>
                                <td>{formatDate(campaign.created_at)}</td>
                                <td className="actions">
                                    <select
                                        value={campaign.status}
                                        onChange={(e) => handleStatusChange(campaign.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(campaign.id, campaign.campaign_name)}
                                        className="btn btn-delete"
                                        title="Delete campaign"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CampaignList;
