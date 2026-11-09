'use strict';

const store = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  store.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
}

function verifyOTP(email, code) {
  const record = store.get(email);

  if (!record) {
    return { ok: false, reason: 'not_found' };
  }

  if (Date.now() > record.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }

  if (record.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  if (record.otp !== code) {
    record.attempts += 1;
    return { ok: false, reason: 'wrong_code' };
  }

  store.delete(email);
  return { ok: true };
}

function markVerified(email) {
  console.log(`${email} is verified`);
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store: store,
};