-- =============================================
-- V2: Seed Data for Frontend Integration Test
-- =============================================

-- ===================
-- 1. Store
-- ===================
INSERT INTO stores (id, store_identifier, name) VALUES
(1, 'STORE001', 'Sample Restaurant');

-- ===================
-- 2. Admin (password: admin123)
-- BCrypt hash generated with $2a$ prefix
-- ===================
INSERT INTO admins (id, store_id, username, password_hash) VALUES
(1, 1, 'admin', '$2a$12$8DGOo0hTfDUGRwmnZfhkaensc5bdkkJm8zyNMEoCTGcSYixI99C3i');

-- ===================
-- 3. Tables (password: 1234 for all)
-- ===================
INSERT INTO tables (id, store_id, table_number, password_hash) VALUES
(1, 1, 1, '$2a$12$LJ3m4ys3LzQqXvFBMUfBGuYb0GBczXSMKlMFe7UOqKFlVMwKLSCWe'),
(2, 1, 2, '$2a$12$LJ3m4ys3LzQqXvFBMUfBGuYb0GBczXSMKlMFe7UOqKFlVMwKLSCWe'),
(3, 1, 3, '$2a$12$LJ3m4ys3LzQqXvFBMUfBGuYb0GBczXSMKlMFe7UOqKFlVMwKLSCWe'),
(4, 1, 4, '$2a$12$LJ3m4ys3LzQqXvFBMUfBGuYb0GBczXSMKlMFe7UOqKFlVMwKLSCWe'),
(5, 1, 5, '$2a$12$LJ3m4ys3LzQqXvFBMUfBGuYb0GBczXSMKlMFe7UOqKFlVMwKLSCWe');

-- ===================
-- 4. Categories
-- ===================
INSERT INTO categories (id, store_id, name, display_order) VALUES
(1, 1, 'Signature',    1),
(2, 1, 'Main',         2),
(3, 1, 'Side',         3),
(4, 1, 'Drink',        4),
(5, 1, 'Dessert',      5);

-- ===================
-- 5. Menus
-- ===================
-- Signature
INSERT INTO menus (id, store_id, category_id, name, price, description, display_order) VALUES
(1,  1, 1, 'Kimchi Jjigae',        9000,  'Spicy kimchi stew with pork belly',           1),
(2,  1, 1, 'Doenjang Jjigae',      8000,  'Traditional soybean paste stew',              2),
(3,  1, 1, 'Budae Jjigae',         12000, 'Army base stew with ham and sausage',         3);

-- Main
INSERT INTO menus (id, store_id, category_id, name, price, description, display_order) VALUES
(4,  1, 2, 'Bulgogi',              15000, 'Marinated beef BBQ',                           1),
(5,  1, 2, 'Japchae',              11000, 'Stir-fried glass noodles with vegetables',     2),
(6,  1, 2, 'Bibimbap',             10000, 'Mixed rice with vegetables and gochujang',     3),
(7,  1, 2, 'Samgyeopsal Set',      18000, 'Grilled pork belly set for 1 person',          4),
(8,  1, 2, 'Dakgalbi',             13000, 'Spicy stir-fried chicken',                     5);

-- Side
INSERT INTO menus (id, store_id, category_id, name, price, description, display_order) VALUES
(9,  1, 3, 'Gyeran-jjim',         5000,  'Steamed egg casserole',                        1),
(10, 1, 3, 'Pajeon',               8000,  'Green onion pancake',                           2),
(11, 1, 3, 'Tteokbokki',          6000,  'Spicy rice cakes',                              3),
(12, 1, 3, 'Mandu',               7000,  'Korean dumplings (6 pcs)',                       4);

-- Drink
INSERT INTO menus (id, store_id, category_id, name, price, description, display_order) VALUES
(13, 1, 4, 'Cola',                 2000,  'Coca-Cola 350ml',                               1),
(14, 1, 4, 'Cider',               2000,  'Sprite 350ml',                                   2),
(15, 1, 4, 'Beer',                 5000,  'Draft beer 500ml',                               3),
(16, 1, 4, 'Soju',                 5000,  'Korean soju 360ml',                              4),
(17, 1, 4, 'Iced Americano',      3000,  'Iced americano coffee',                           5);

-- Dessert
INSERT INTO menus (id, store_id, category_id, name, price, description, display_order) VALUES
(18, 1, 5, 'Hotteok',             3000,  'Sweet Korean pancake',                            1),
(19, 1, 5, 'Bingsu',              8000,  'Shaved ice with red bean',                        2),
(20, 1, 5, 'Sikhye',              2000,  'Sweet rice punch',                                3);

-- ===================
-- 6. Active Sessions (Table 1, 2 are occupied)
-- ===================
INSERT INTO table_sessions (id, session_uuid, table_id, started_at, active) VALUES
(1, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, NOW(), TRUE),
(2, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 2, NOW(), TRUE);

-- ===================
-- 7. Orders (various statuses for testing)
-- ===================
-- Table 1: 2 orders
INSERT INTO orders (id, order_number, store_id, table_id, session_id, total_amount, status, created_at) VALUES
(1, 'ORD-20260318-0001', 1, 1, 1, 27000, 'PREPARING', NOW() - INTERVAL '15 minutes'),
(2, 'ORD-20260318-0002', 1, 1, 1, 15000, 'PENDING',   NOW() - INTERVAL '5 minutes');

-- Table 2: 1 order
INSERT INTO orders (id, order_number, store_id, table_id, session_id, total_amount, status, created_at) VALUES
(3, 'ORD-20260318-0003', 1, 2, 2, 23000, 'PENDING', NOW() - INTERVAL '2 minutes');

-- ===================
-- 8. Order Items
-- ===================
-- Order 1: Kimchi Jjigae x2 + Doenjang Jjigae x1 = 26000 (+ rounding)
INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price) VALUES
(1, 1, 'Kimchi Jjigae',    2, 9000),
(1, 2, 'Doenjang Jjigae',  1, 8000),
(1, 13, 'Cola',            1, 2000);

-- Order 2: Bulgogi x1 = 15000
INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price) VALUES
(2, 4, 'Bulgogi', 1, 15000);

-- Order 3: Samgyeopsal Set x1 + Beer x1 = 23000
INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price) VALUES
(3, 7, 'Samgyeopsal Set', 1, 18000),
(3, 15, 'Beer',           1, 5000);

-- ===================
-- 9. Order History (past completed orders for history view)
-- ===================
INSERT INTO order_history (id, original_order_id, order_number, store_id, table_id, session_uuid, total_amount, ordered_at, completed_at) VALUES
(1, 100, 'ORD-20260317-0001', 1, 1, 'old-session-uuid-001', 35000, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours'),
(2, 101, 'ORD-20260317-0002', 1, 3, 'old-session-uuid-002', 22000, NOW() - INTERVAL '1 day', NOW() - INTERVAL '22 hours');

INSERT INTO order_history_items (order_history_id, menu_name, quantity, unit_price) VALUES
(1, 'Bulgogi',          1, 15000),
(1, 'Bibimbap',         1, 10000),
(1, 'Beer',             2, 5000),
(2, 'Dakgalbi',         1, 13000),
(2, 'Doenjang Jjigae',  1, 8000),
(2, 'Cola',             1, 2000);

-- ===================
-- Reset sequences
-- ===================
SELECT setval('stores_id_seq',          (SELECT MAX(id) FROM stores));
SELECT setval('admins_id_seq',          (SELECT MAX(id) FROM admins));
SELECT setval('tables_id_seq',          (SELECT MAX(id) FROM tables));
SELECT setval('table_sessions_id_seq',  (SELECT MAX(id) FROM table_sessions));
SELECT setval('categories_id_seq',      (SELECT MAX(id) FROM categories));
SELECT setval('menus_id_seq',           (SELECT MAX(id) FROM menus));
SELECT setval('orders_id_seq',          (SELECT MAX(id) FROM orders));
SELECT setval('order_items_id_seq',     (SELECT MAX(id) FROM order_items));
SELECT setval('order_history_id_seq',   (SELECT MAX(id) FROM order_history));
SELECT setval('order_history_items_id_seq', (SELECT MAX(id) FROM order_history_items));
