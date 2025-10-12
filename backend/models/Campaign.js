const dbModule = require('../config/database');
// prefer using the default pool instance
const db = dbModule.pool;

// In-memory fallback store used when DB is unreachable (development)
const inMemoryStore = [];
let inMemoryNextId = 1;

function nowISO() {
    return new Date().toISOString();
}

class Campaign {
    // Create a new campaign
    static async create(campaignData) {
        try {
            const { campaign_name, client_name, start_date, status } = campaignData;
            const [result] = await db.execute(
                'INSERT INTO campaigns (campaign_name, client_name, start_date, status) VALUES (?, ?, ?, ?)',
                [campaign_name, client_name, start_date, status || 'active']
            );
            return result.insertId;
        } catch (error) {
            console.error('DB Create error:', error && error.code);
            // Only fallback to in-memory if explicitly enabled via env var
            if (error && error.code === 'ECONNREFUSED' && (process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV !== 'production')) {
                const id = inMemoryNextId++;
                const record = {
                    id,
                    campaign_name: campaignData.campaign_name,
                    client_name: campaignData.client_name,
                    start_date: campaignData.start_date,
                    status: campaignData.status || 'active',
                    created_at: nowISO(),
                    updated_at: nowISO()
                };
                inMemoryStore.unshift(record);
                return id;
            }
            throw error;
        }
    }

    // Get all campaigns
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM campaigns ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            console.error('DB Error in Campaign.findAll:', error && error.code);
            if (error && error.code === 'ECONNREFUSED' && (process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV !== 'production')) {
                return [...inMemoryStore];
            }
            throw error;
        }
    }

    // Update campaign status
    static async updateStatus(id, status) {
        try {
            const [result] = await db.execute(
                'UPDATE campaigns SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [status, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('DB Update error:', error && error.code);
            if (error && error.code === 'ECONNREFUSED' && (process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV !== 'production')) {
                const idx = inMemoryStore.findIndex(item => String(item.id) === String(id));
                if (idx === -1) return false;
                inMemoryStore[idx].status = status;
                inMemoryStore[idx].updated_at = nowISO();
                return true;
            }
            throw error;
        }
    }

    // Delete campaign
    static async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM campaigns WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('DB Delete error:', error && error.code);
            if (error && error.code === 'ECONNREFUSED' && (process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV !== 'production')) {
                const idx = inMemoryStore.findIndex(item => String(item.id) === String(id));
                if (idx === -1) return false;
                inMemoryStore.splice(idx, 1);
                return true;
            }
            throw error;
        }
    }

    // Find campaign by ID
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM campaigns WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('DB findById error:', error && error.code);
            if (error && error.code === 'ECONNREFUSED' && (process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV !== 'production')) {
                return inMemoryStore.find(item => String(item.id) === String(id));
            }
            throw error;
        }
    }
}

module.exports = Campaign;
