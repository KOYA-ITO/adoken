-- Database initialization script

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sample data
INSERT INTO users (username, email, password) VALUES 
    --('admin', 'admin@example.com', '$2a$10$DowJonesHash'),
    --('user1', 'user1@example.com', '$2a$10$SampleHash'),
    --('user2', 'user2@example.com', '$2a$10$AnotherHash')

    ('admin', 'admin@example.com', 'a'),
    ('user1', 'user1@example.com', 'a'),
    ('user2', 'user2@example.com', 'a')
ON CONFLICT DO NOTHING;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);