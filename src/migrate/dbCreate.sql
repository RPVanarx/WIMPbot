CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    platform_id VARCHAR(50) NOT NULL,
    platform_type VARCHAR(10) NOT NULL,
    user_name VARCHAR(30) NOT NULL,
    location POINT NOT NULL,
    bad_request_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    UNIQUE (platform_id, platform_type)
);

CREATE TABLE requests(
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    request_type VARCHAR(10) NOT NULL, 
    location POINT NOT NULL,
    photo VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    creation_date TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'),
    is_approved BOOLEAN DEFAULT false,
    status_changed_by BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id)
);