-- Active: 1744074306869@@127.0.0.1@3306@mywebsite
-- User
CREATE TABLE users(
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    username           VARCHAR(50) NOT NULL UNIQUE,
    password           VARCHAR(255) NOT NULL,
    role               NUM('admin','user') NOT NULL DEFAULT 'user'  
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
    borrow_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    return_date          DATETIME NOT NULL,
    Foreign Key (user_id) REFERENCES users(id),
    Foreign Key (tool_id) REFERENCES tools(id),
    Foreign Key (project_id) REFERENCES projects(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


--create the initial user and admin
INSERT INTO users(username,password,role)VALUES
('admin','admin123','admin'),
('user1','123','user');


--initialise the project
INSERT INTO projects(name)VALUES
('PROJECT1'),
('PROJECT2');


--initialise the tools
INSERT INTO tools(name,model,total_quantity,available_quantity)VALUES
('Electric drill','x','5','5'),
('Electric saws','y','10','10');


