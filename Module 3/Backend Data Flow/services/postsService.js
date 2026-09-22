const repo = require('../repository/postsRepo');
const votesService = require('./votesService');
const AppError = require('../utils/AppError');

const MAX_LIMIT = 50;

exports.getAll = async ({ page = 1, limit = 10 }) => {
  if (!Number.isInteger(page) || page < 1) {
    throw new AppError(
      'Page must be a positive integer',
      400,
      'INVALID_PAGINATION'
    );
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new AppError(
      'Limit must be a positive integer',
      400,
      'INVALID_PAGINATION'
    );
  }

  const safeLimit = Math.min(limit, MAX_LIMIT);

  const posts = await repo.findAll();

  const total = posts.length;
  const totalPages = Math.ceil(total / safeLimit);

  const start = (page - 1) * safeLimit;
  const data = posts.slice(start, start + safeLimit);

  return {
    data,
    meta: {
      page,
      limit: safeLimit,
      total,
      totalPages
    }
  };
};

exports.getById = async (postId) => {
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError(
      'Post not found',
      404,
      'POST_NOT_FOUND'
    );
  }

  return post;
};

exports.create = async ({ authorId, title, body }) => {
  return repo.insert({ authorId, title, body });
};

exports.like = async (postId, userId) => {
  return votesService.castVote(postId, userId);
};