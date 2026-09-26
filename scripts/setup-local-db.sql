-- Local development database for SKY Tech Dynamic.
--
-- Before running, replace CHANGE_ME_LOCAL below with a password of your own
-- choosing (both places). Use the same value in .env.local. This password is
-- yours — it is never committed, and never needs to be shared with anyone.
--
-- Run from the sky-tech folder:
--   "C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -u root -p < scripts/setup-local-db.sql
--
-- It will ask for the MySQL root password you set during installation.

CREATE DATABASE IF NOT EXISTS skytech
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- The application account. Deliberately not root, and deliberately limited to
-- reading and writing rows: it cannot create, alter or drop a table. Schema
-- changes are applied separately and on purpose, which means a flaw in the
-- site can never reshape or destroy the database behind it.
CREATE USER IF NOT EXISTS 'skytech_app'@'localhost'
  IDENTIFIED BY 'Skytech.1234';

ALTER USER 'skytech_app'@'localhost'
  IDENTIFIED BY 'Skytech.1234';

GRANT SELECT, INSERT, UPDATE, DELETE ON skytech.* TO 'skytech_app'@'localhost';

FLUSH PRIVILEGES;

SELECT 'Database and app user ready.' AS status;
