'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // Read the Idempotency-Key header
  const key = req.headers['idempotency-key'];

  // Rule 1: Reject requests without a key
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'An Idempotency-Key header is required.'
      }
    });
  }

  // Rule 2: If this key was already processed, return the stored response
  if (idempotency.has(key)) {
    const cached = idempotency.get(key);
    return res.status(cached.status).json(cached.body);
  }

  // Rule 3: This is a new key, so create one real charge
  const amount = req.body && req.body.amount;
  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  charges.push(charge);

  // Store the complete response for retries
  const status = 201;
  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  idempotency.set(key, { status, body });

  return res.status(status).json(body);
});

module.exports = router;