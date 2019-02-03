CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    platformId VARCHAR(50) NOT NULL,
    platformType VARCHAR(10) NOT NULL,
    userName VARCHAR(30) NOT NULL,
    location POINT NOT NULL,
    badRequestCount INT DEFAULT 0,
    isActive BOOLEAN DEFAULT true,
    UNIQUE (platformId, platformType)
);

CREATE TABLE requests(
    id SERIAL PRIMARY KEY,
    userId BIGINT,
    requestType VARCHAR(10) NOT NULL, 
    location POINT NOT NULL,
    photo VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    creationDate DATE NOT NULL,
    isApproved BOOLEAN,
    statusChangedBy BIGINT NOT NULL,
    isActive BOOLEAN,
    FOREIGN KEY (userId) REFERENCES users(id),
);