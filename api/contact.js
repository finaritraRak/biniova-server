// api/contact.js
const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../lib/emailSenders');

router.post('/', async (req, res) => {
  try {
    const payload = req.body;

    // Basic validation
    if (!payload || !payload.name || !payload.email || !payload.message) {
      return res.status(400).json({ error: 'Missing required fields (name, email, message)' });
    }

    // send email and await it (important in serverless)
    await sendContactEmail(payload);

    // optionally: store lead in DB (not implemented here)
    return res.status(200).json({ ok: true, message: 'Message sent' });
  } catch (err) {
    console.error('contact error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
