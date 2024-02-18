// eslint-disable-next-line import/no-extraneous-dependencies
const format = require("pg-format");
const db = require("../../../config/db");
const util = require("util");
const bcrypt = require("bcrypt");
const hashAsync = util.promisify(bcrypt.hash);
const hashCompare = util.promisify(bcrypt.compare);

// for reset route - development only
const fs = require("fs");
const path = require("path");
const sqlFilePath = path.resolve("database/database.sql");

/*
Merchant
CRUD
Create a merchant NOTE: need to encypt password and tokens
Note: need to determine best practice for storing media files (merchant logo)
Get all merchants
Update a specific merchant
Delete a merchant
*/

const emailExists = async (email) => {
  const text = "SELECT * FROM merchants WHERE email = $1";
  const values = [email];
  let merchant;
  try {
    merchant = await db.query(text, values);
    // console.log(merchant);
    if (merchant.rows.length > 0) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const idExists = async (id) => {
  const text = "SELECT * FROM merchants WHERE id = $1";
  const values = [id];
  let merchant;
  try {
    merchant = await db.query(text, values);
  } catch (error) {
    console.log(error);
  }
  if (merchant.rows.length === 1) {
    return true;
  }
  return false;
};

const validPassword = async (hashed, password) => {
  try {
    const isValid = await hashCompare(password, hashed);
    return isValid;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// mutates values array - inserts hashed password
const hashPassword = async (values) => {
  try {
    const hashedPassword = await hashAsync(values[1], 10);
    values[1] = hashedPassword;
    return values;
  } catch (e) {
    console.log("Error hashing password: ", e);
  }
};

const createMerchant = async (req, res) => {
  let values = [
    req.body.email,
    req.body.password,
    req.body.restaurantName,
    req.body.street,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.body.phone,
  ];

  const text =
    "INSERT INTO merchants (email, password, restaurant_name, street, city, state, zip, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, restaurant_name, street, city, state, zip, phone";
  let newMerchant;
  try {
    // Validate that the email is a valid email
    // ## CODE HERE ##

    // Validate that the password is strong enough
    // ## CODE HERE ##

    // Validate that the email does not already exist
    if (await emailExists(req.body.email)) {
      res.status(400).json({ message: "This email is already being used" });
      return;
    }

    // validate that the password is unique?

    // hash password
    values = await hashPassword(values);

    // Add a new row to the merchant table
    newMerchant = await db.query(text, values);
    res
      .status(200)
      .json({ success: "Successfully added merchant to database!" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "There was a problem adding to AWS RDS database." });
  }
};

const getMerchant = async (req, res) => {
  const { id } = req.params;
  const text = "SELECT * FROM merchants WHERE id = $1";
  const values = [id];
  let merchant;
  try {
    merchant = await db.query(text, values);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "There was a problem fetching merchant data." });
  }

  if (merchant.rows.length < 1) {
    res.status(400).json({ error: "There is no merchant with that id." });
  } else {
    res.status(200).json(merchant.rows[0]);
  }
};

const getAllMerchants = async (req, res) => {
  let allMerchants;
  try {
    allMerchants = await db.query("SELECT * FROM merchants");
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "There was a problem fetching all merchants data." });
  }
  res.status(200).json(allMerchants.rows);
};

const updateMerchant = async (req, res) => {
  const { id } = req.params;
  const { columnName, newValue } = req.body;
  const sql = format(
    "UPDATE merchants SET %I = %L WHERE id = %s RETURNING *",
    columnName,
    newValue,
    id
  );
  let updatedMerchant;
  try {
    updatedMerchant = await db.query(sql);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "There was a problem updating merchant on AWS RDS database.",
    });
  }
  res.status(200).json({
    message: "Sucessfully updated merchant.",
    updatedMerchant: updatedMerchant.rows[0],
  });
};

const deleteMerchant = async (req, res) => {
  const { id } = req.params;
  const text = "DELETE FROM merchants WHERE id = $1";
  const values = [id];
  try {
    const validId = await idExists(id);
    if (validId) {
      await db.query(text, values);
    } else {
      throw Error("Merchant does not exist.");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "There was a problem deleting the merchant from AWS RDS database.",
    });
  }
  res.status(200).json({ message: "Successfully deleted merchant." });
};

// signIn route
const signIn = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const text = "SELECT * FROM merchants WHERE email = $1";
  const values = [email];

  try {
    let record = await db.query(text, values);
    if (record.rows.length < 1) {
      throw new Error("Invalid email. Please try again");
    }

    record = record.rows[0];
    let isPasswordValid = await validPassword(record.password, password);
    if (!isPasswordValid) {
      throw new Error("Invalid password. Please try again");
    }

    res.status(200).json({ success: `Welcome back ${email}` });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

const reset = async (req, res) => {
  try {
    let sqlFile = fs.readFileSync(sqlFilePath, "utf8");
    let commands = sqlFile.split(";");

    for (let i = 0; i < commands.length; i++) {
      let command = commands[i];
      await db.query(command);
    }

    res.status(200).json({ success: "Database reset successfully..." });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: "There was a problem restting the test database.",
    });
  }
};

module.exports = {
  createMerchant,
  getMerchant,
  getAllMerchants,
  updateMerchant,
  deleteMerchant,
  signIn,
  reset,
};
