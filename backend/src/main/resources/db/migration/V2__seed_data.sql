-- Seed: Default store and admin
-- Password: admin123 (bcrypt hash)
INSERT INTO stores (store_identifier, name) VALUES ('STORE001', 'Sample Restaurant');

INSERT INTO admins (store_id, username, password_hash)
VALUES (1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
