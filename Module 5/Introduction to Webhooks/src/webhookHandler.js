const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

function handleWebhook(req, res) {
  const signatureHeader = req.headers['x-webhook-signature'];

  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return res.status(401).json({ status: 'invalid_signature' });
  }

  const receivedSignature = signatureHeader.slice('sha256='.length);

  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  const receivedBuffer = Buffer.from(receivedSignature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return res.status(401).json({ status: 'invalid_signature' });
  }

  const event = JSON.parse(req.body);

  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  _processedIds.add(event.id);

  res.status(200).json({ status: 'received' });

  setImmediate(() => {
    handleEvent(event);
  });
}

module.exports = {
  handleWebhook,
  _processedIds,
};