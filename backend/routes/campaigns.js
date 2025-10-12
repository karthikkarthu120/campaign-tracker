const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// GET /api/campaigns - Get all campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.findAll();
        res.json({
            success: true,
            data: campaigns,
            message: 'Campaigns retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        // Also log stack and full object for deeper inspection
        console.error('Full error object:', {
            message: error && error.message,
            stack: error && error.stack,
            code: error && error.code,
            errno: error && error.errno,
            sqlMessage: error && error.sqlMessage,
            sqlState: error && error.sqlState,
            sql: error && error.sql
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching campaigns',
            error: error.message || JSON.stringify(error)
        });
    }
});

// POST /api/campaigns - Create new campaign
router.post('/', async (req, res) => {
    try {
        const { campaign_name, client_name, start_date, status } = req.body;

        // Input validation
        if (!campaign_name || !client_name || !start_date) {
            return res.status(400).json({
                success: false,
                message: 'Campaign name, client name, and start date are required'
            });
        }

        // Validate status if provided
        const validStatuses = ['active', 'paused', 'completed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be active, paused, or completed'
            });
        }

        const campaignId = await Campaign.create(req.body);
        const newCampaign = await Campaign.findById(campaignId);

        res.status(201).json({
            success: true,
            data: newCampaign,
            message: 'Campaign created successfully'
        });
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating campaign',
            error: error.message
        });
    }
});

// PUT /api/campaigns/:id/status - Update campaign status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['active', 'paused', 'completed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required (active, paused, or completed)'
            });
        }

        const updated = await Campaign.updateStatus(id, status);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        const updatedCampaign = await Campaign.findById(id);
        res.json({
            success: true,
            data: updatedCampaign,
            message: 'Campaign status updated successfully'
        });
    } catch (error) {
        console.error('Error updating campaign status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating campaign status',
            error: error.message
        });
    }
});

// DELETE /api/campaigns/:id - Delete campaign
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Campaign.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        res.json({
            success: true,
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting campaign:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting campaign',
            error: error.message
        });
    }
});

module.exports = router;
