CREATE USER 'user'@'%' IDENTIFIED BY 'password';
CREATE DATABASE eth;
GRANT ALL PRIVILEGES ON eth.* TO 'user'@'%';