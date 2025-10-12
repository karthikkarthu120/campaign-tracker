import React, { useState } from 'react';
import './CampaignForm.css';

const CampaignForm = ({ onCampaignCreated, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        campaign_name: '',
        client_name: '',
        start_date: '',
        status: 'active'
    });
    
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.campaign_name.trim()) {
            newErrors.campaign_name = 'Campaign name is required';
        }
        
        if (!formData.client_name.trim()) {
            newErrors.client_name = 'Client name is required';
        }
        
        if (!formData.start_date) {
            newErrors.start_date = 'Start date is required';
        }
        
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        onCampaignCreated(formData);
    };

    return (
        <div className="campaign-form-container">
            <div className="campaign-form">
                <h2>Add New Campaign</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="campaign_name">Campaign Name *</label>
                        <input
                            type="text"
                            id="campaign_name"
                            name="campaign_name"
                            value={formData.campaign_name}
                            onChange={handleChange}
                            className={errors.campaign_name ? 'error' : ''}
                            placeholder="Enter campaign name"
                        />
                        {errors.campaign_name && (
                            <span className="error-message">{errors.campaign_name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="client_name">Client Name *</label>
                        <input
                            type="text"
                            id="client_name"
                            name="client_name"
                            value={formData.client_name}
                            onChange={handleChange}
                            className={errors.client_name ? 'error' : ''}
                            placeholder="Enter client name"
                        />
                        {errors.client_name && (
                            <span className="error-message">{errors.client_name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="start_date">Start Date *</label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className={errors.start_date ? 'error' : ''}
                        />
                        {errors.start_date && (
                            <span className="error-message">{errors.start_date}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="btn btn-cancel"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignForm;
