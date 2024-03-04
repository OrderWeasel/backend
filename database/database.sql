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
  estimated_minutes_for_pickup INTEGER NOT NULL,
  code_verifier VARCHAR(225),
  sq_access_token VARCHAR(225),
  sq_refresh_token VARCHAR(225),
  CHECK(email <> password),
  CHECK(estimated_minutes_for_pickup > 0),
  CHECK(estimated_minutes_for_pickup < 61)
);

CREATE TABLE orders (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  customer_name VARCHAR(225) NOT NULL,
  customer_phone VARCHAR(225) NOT NULL,
  time_placed TIMESTAMPTZ NOT NULL,
  status VARCHAR(225),
);

CREATE TABLE orderitems (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  CONSTRAINT (fk_order_id) FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT (fk_item_id) FOREIGN KEY (item_id) REFERENCES item(id),
)

CREATE TABLE items (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  sq_variation_id VARCHAR(225) UNIQUE,
  name VARCHAR(225) NOT NULL,
  variation_name VARCHAR(225) NOT NULL,
  category VARCHAR(225) NOT NULL,
  description VARCHAR(225),
  merchant_id INT,
  price INTEGER NOT NULL,
  CONSTRAINT (fk_merchant_id) FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  CHECK(price > 0)
);
