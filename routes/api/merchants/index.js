const express = require("express");

const router = express.Router();
const {
  createMerchant,
  getMerchant,
  getAllMerchants,
  updateMerchant,
  deleteMerchant,
  signIn,
  reset,
} = require("./handlers");

// Create a new merchant
router.post("/", createMerchant);

// POST sign in credentials
router.post("/sign-in", signIn);

// GET a merchant by id
router.get("/:id", getMerchant);

// GET all merchants
router.get("/", getAllMerchants);

// PATCH data on a merchant
router.patch("/:id", updateMerchant);

// Delete a merchant
router.delete("/:id", deleteMerchant);

// Reset database
router.post("/reset", reset);

module.exports = router;
