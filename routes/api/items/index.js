/* eslint-disable dot-notation */
/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const { decryptToken } = require('../oauthRedirect/helpers');
const db = require('../../../config/db');
const { idExists } = require('../merchants/handlers');

const authorizationCompleted = async (id) => {
  const text = 'SELECT sq_access_token FROM merchants WHERE id = $1';
  const values = [id];

  try {
    const result = await db.query(text, values);
    const { sq_access_token } = result.rows[0];
    console.log(result.rows[0].sq_access_token);
    if (sq_access_token && sq_access_token.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Initialize session if not yet initialized
const initializeSession = (req, res, next) => {
  if (req.session.init !== true) {
    req.session.init = true;
  }
  return next();
};

// GET all mneu items given a merchant id
router.get('/:merchantId/items', initializeSession, async (req, res) => {
  const { merchantId } = req.params;

  // Validate that the merchant id exists:
  const validId = await idExists(merchantId);
  if (!validId) {
    res.status(400).json({ error: 'Merchant does not exist.' });
    return;
  }

  // Validate that merchant has completed integration
  const oauthCompleted = await authorizationCompleted(merchantId);
  if (!oauthCompleted) {
    res.status(400).json({ error: 'Merchant has not completed the authorization process' });
    return;
  }

  // Get sq_access_token from db and decrypt it
  const text = 'SELECT sq_access_token FROM merchants WHERE id = $1';
  const values = [merchantId];
  let access_token;
  try {
    const result = await db.query(text, values);
    const string = result.rows[0].sq_access_token;
    const iv = string.slice(0, 16);
    const token = string.slice(16);
    access_token = decryptToken(token, iv);
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  // Call square api to get items using access_token
  let catalog;
  try {
    const data = await fetch('https://connect.squareupsandbox.com/v2/catalog/list', {
      method: 'GET',
      headers: {
        'Square-Version': '2024-02-22',
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    catalog = await data.json();

    // Get only CATEGORIES
    const onlyCategories = catalog.objects.filter((obj) => obj.type === 'CATEGORY');

    // Get only ITEMS
    let onlyItems = catalog.objects.filter((obj) => obj.type === 'ITEM');

    // Create a simplified version of the catalog
    onlyItems = onlyItems.map((item) => {
      const simpleList = {};
      // simpleList.id = item.id;
      simpleList.name = item.item_data.name;

      // Find the category name
      const categoryId = item.item_data.categories[0].id;
      const targetCategory = onlyCategories.filter((cat) => cat.id === categoryId)[0];
      const categoryName = targetCategory.category_data.name;
      simpleList.category = categoryName;

      simpleList.description = item.item_data.description;
      simpleList.variations = item.item_data.variations.map((variation) => {
        const newVariationObj = {};
        newVariationObj.id = variation.id;
        newVariationObj.name = variation.item_variation_data.name;
        newVariationObj.price = variation.item_variation_data.price_money;
        return newVariationObj;
      });
      [simpleList.image_id] = item.item_data.image_ids;
      return simpleList;
    });

    res.status(200).json(onlyItems);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
