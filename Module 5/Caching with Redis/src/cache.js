'use strict';

// ─── YOUR FILE — implement this ───────────────────────────────────────────────
// Implement three Redis helper functions using ioredis.

const Redis = require('ioredis');

// Create Redis instance
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  lazyConnect: true
});

// Get data from Redis cache
async function cacheGet(key) {
  try {
    const data = await redis.get(key);

    if (data === null) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Redis cacheGet error:', error.message);
    return null;
  }
}

// Store data in Redis cache with TTL
async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (error) {
    console.error('Redis cacheSet error:', error.message);
  }
}

// Delete data from Redis cache
async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis cacheDel error:', error.message);
  }
}

module.exports = { cacheGet, cacheSet, cacheDel };