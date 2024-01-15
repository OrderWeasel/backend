CREATE DATABASE orderweasel_db

/* Draft of Production Merchant Table */
CREATE TABLE merchant (
  merchant_id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  merchant_email VARCHAR(225) UNIQUE NOT NULL,
  merchant_password VARCHAR(225) NOT NULL,
  merchant_restaurant_name VARCHAR(255) NOT NULL,
  merchant_street VARCHAR(225) NOT NULL,
  merchant_city VARCHAR(225) NOT NULL,
  merchant_state VARCHAR(2) NOT NULL,
  merchant_zip VARCHAR(5) NOT NULL,
  merchant_phone VARCHAR(10) NOT NULL,
  sq_access_token VARCHAR(225),
  sq_refresh_token VARCHAR(225),
)
