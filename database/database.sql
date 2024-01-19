CREATE DATABASE orderweasel_db

/* Draft of Production Merchant Table */
CREATE TABLE merchants (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  email VARCHAR(225) UNIQUE NOT NULL,
  password VARCHAR(225) NOT NULL,
  restaurant_name VARCHAR(255) NOT NULL,
  street VARCHAR(225) NOT NULL,
  city VARCHAR(225) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip VARCHAR(5) NOT NULL,
  phone VARCHAR(10) NOT NULL,
  sq_access_token VARCHAR(225),
  sq_refresh_token VARCHAR(225)
);

CREATE TABLE users (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  email VARCHAR(225) UNIQUE NOT NULL,
  password VARCHAR(225) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  street VARCHAR(225) NOT NULL,
  city VARCHAR(225) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip VARCHAR(5) NOT NULL,
  phone VARCHAR(10) NOT NULL
);
