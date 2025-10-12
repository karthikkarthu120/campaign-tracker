CREATE DATABASE campaign_tracker;
USE campaign_tracker;

CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    status ENUM('active', 'paused', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE campaign_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    budget DECIMAL(10, 2) DEFAULT 0.00,
    spend DECIMAL(10, 2) DEFAULT 0.00,
    click_through_rate DECIMAL(5, 2) DEFAULT 0.00,
    conversion_rate DECIMAL(5, 2) DEFAULT 0.00,
    cost_per_click DECIMAL(8, 2) DEFAULT 0.00,
    return_on_investment DECIMAL(8, 2) DEFAULT 0.00,
    date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    UNIQUE KEY unique_campaign_tracking (campaign_id)
);

-- Insert sample campaigns
INSERT INTO campaigns (campaign_name, client_name, start_date, status) VALUES
('Summer Sale 2024', 'Fashion Plus', '2024-07-01', 'completed'),
('Holiday Promotion', 'TechCorp', '2024-10-01', 'active'),
('Back to School', 'BookStore Inc', '2024-08-15', 'active'),
('Flash Weekend Sale', 'Electronics Hub', '2024-10-05', 'paused');

-- Insert sample tracking data
INSERT INTO campaign_tracking (campaign_id, impressions, clicks, conversions, budget, spend, click_through_rate, conversion_rate, cost_per_click, return_on_investment) VALUES
(1, 15000, 750, 65, 3500.00, 2100.00, 5.00, 8.67, 2.80, 54.76),
(2, 8500, 420, 32, 2500.00, 1200.00, 4.94, 7.62, 2.86, 33.33),
(3, 12000, 600, 48, 3000.00, 1800.00, 5.00, 8.00, 3.00, 33.33),
(4, 6000, 180, 15, 1500.00, 720.00, 3.00, 8.33, 4.00, 4.17);
