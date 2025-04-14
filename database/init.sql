-- Active: 1744253604875@@127.0.0.1@3306@mywebsite
-- User
CREATE TABLE users(
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    username           VARCHAR(50) NOT NULL UNIQUE,
    password           VARCHAR(255) NOT NULL,
    role               ENUM('admin','user') NOT NULL DEFAULT 'user'  
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


--tools
CREATE TABLE tools(
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    name                 VARCHAR(50) NOT NULL ,
    model                VARCHAR(255) NOT NULL,
    total_quantity       INT NOT NULL, 
    available_quantity   INT NOT NULL        
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


--projects
 CREATE TABLE projects (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--borrowed records
CREATE TABLE borrowed_records(
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    user_id              INT NOT NULL,
    tool_id              INT NOT NULL,
    project_id           INT NOT NULL, 
    borrow_date          DATETIME,
    return_date          DATETIME,
    Foreign Key (user_id) REFERENCES users(id),
    Foreign Key (tool_id) REFERENCES tools(id),
    Foreign Key (project_id) REFERENCES projects(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


--create the initial user and admin
INSERT INTO users(username,password,role)VALUES

('admin','$2b$10$YourNewHashedPasswordHere','admin');
INSERT INTO users (username, password, role)
VALUES ('admin3', '$2b$10$9X1mH4w3eDy9HJrMZyxZfeCz5j5e9IiHsZ8rq3ZCkAZgM9LWIjT5K', 'admin');

INSERT INTO users (username, password, role)
VALUES ('admin10', '$2a$10$F.dDT3EZ3SVjpbxZAIsbWOxAXlzvhISEuE6Gmx17VdwxQqWAU8REa', 'admin');


--initialise the project
INSERT INTO projects(name)VALUES
('PROJECT1'),
('PROJECT2');


--initialise the tools
INSERT INTO tools(name,model,total_quantity,available_quantity)VALUES
('Electric drill','x','5','5'),
('Electric saws','y','10','10');

ALTER TABLE borrowed_records ADD COLUMN status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending';
