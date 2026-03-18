-- Stores
CREATE TABLE stores (
    id BIGSERIAL PRIMARY KEY,
    store_identifier VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Admins
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES stores(id),
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(store_id, username)
);

-- Tables
CREATE TABLE tables (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES stores(id),
    table_number INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(store_id, table_number)
);

-- Table Sessions
CREATE TABLE table_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_uuid VARCHAR(36) NOT NULL UNIQUE,
    table_id BIGINT NOT NULL REFERENCES tables(id),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES stores(id),
    name VARCHAR(100) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Menus
CREATE TABLE menus (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES stores(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL CHECK (price >= 100 AND price <= 1000000),
    description VARCHAR(500),
    image_url VARCHAR(500),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    store_id BIGINT NOT NULL REFERENCES stores(id),
    table_id BIGINT NOT NULL REFERENCES tables(id),
    session_id BIGINT NOT NULL REFERENCES table_sessions(id),
    total_amount INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_id BIGINT NOT NULL,
    menu_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 1),
    unit_price INT NOT NULL
);

-- Order History
CREATE TABLE order_history (
    id BIGSERIAL PRIMARY KEY,
    original_order_id BIGINT NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    store_id BIGINT NOT NULL,
    table_id BIGINT NOT NULL,
    session_uuid VARCHAR(36) NOT NULL,
    total_amount INT NOT NULL,
    ordered_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NOT NULL
);

-- Order History Items
CREATE TABLE order_history_items (
    id BIGSERIAL PRIMARY KEY,
    order_history_id BIGINT NOT NULL REFERENCES order_history(id) ON DELETE CASCADE,
    menu_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price INT NOT NULL
);

-- Indexes
CREATE INDEX idx_orders_session_id ON orders(session_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_menus_store_category ON menus(store_id, category_id);
CREATE INDEX idx_table_sessions_table_active ON table_sessions(table_id, active);
CREATE INDEX idx_order_history_table_id ON order_history(table_id);
CREATE INDEX idx_order_history_completed_at ON order_history(completed_at);
