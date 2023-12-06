CREATE DATABASE orderweasel_db

/* Current Table */
CREATE TABLE merchant (
  merchant_id SERIAL PRIMARY KEY,
  merchant_email VARCHAR(225) UNIQUE,
  merchant_restaurant_name VARCHAR(255),
)

/* Draft of Production Merchant Table */
CREATE TABLE merchant (
  merchant_id SERIAL PRIMARY KEY,
  merchant_email VARCHAR(225) UNIQUE,
  merchant_password VARCHAR(225),
  merchant_restaurant_name VARCHAR(255),
  merchant_street VARCHAR(225),
  merchant_city VARCHAR(225),
  merchant_zip VARCHAR(5),
  merchant_phone VARCHAR(10),
  sq_access_token VARCHAR(225),
  sq_refresh_token VARCHAR(225),
)
