const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  handler: (req, res) => {
    const retryAfter = Math.ceil(
      (req.rateLimit.resetTime - Date.now()) / 1000
    );

    res.set("Retry-After", String(Math.max(1, retryAfter)));

    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },

  // In a multi-instance deployment, rate-limit-redis can use Redis as a
  // shared store. The default in-memory store keeps separate counters on
  // each server instance, so requests distributed by a load balancer could
  // bypass the intended global rate limit.
});

module.exports = authLimiter;