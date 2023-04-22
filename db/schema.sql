DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;
USE tracker_db;
SELECT DATABASE();

CREATE TABLE department (
  id INT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT
);

CREATE TABLE role (
  id INT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary VARCHAR(30) NOT NULL,
  department_id INT,
  manager_id INT
);
