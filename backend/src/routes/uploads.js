// backend/src/routes/uploads.js
const express = require('express');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn('Cloudinary env vars missing: set CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET');
}

router.get('/signature', (req, res) => {
  // Optionally sign extra params, like folder or public_id
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(toSign + API_SECRET).digest('hex');

  res.json({
    signature,
    timestamp,
    cloudName: CLOUD_NAME,
    apiKey: API_KEY
  });
});

module.exports = router;
