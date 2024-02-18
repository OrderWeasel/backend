/*this creates the database, but the following tables are not created in it*/
-- CREATE DATABASE orderweasel_db;

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS merchants;

/* Draft of Production Merchant Table */
CREATE TABLE merchants (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  email VARCHAR(225) UNIQUE NOT NULL CHECK(length(email) >= 4),
  password VARCHAR(225) NOT NULL CHECK(length(password) >= 8),
  restaurant_name VARCHAR(255) NOT NULL,
  street VARCHAR(225) NOT NULL,
  city VARCHAR(225) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip VARCHAR(5) NOT NULL,
  phone VARCHAR(10) NOT NULL,
  sq_access_token VARCHAR(225),
  sq_refresh_token VARCHAR(225),
  CHECK(email <> password)
);

CREATE TABLE users (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  email VARCHAR(225) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(10) NOT NULL
);

CREATE TABLE orders (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id INT,
  CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id),
  items text[]
);
