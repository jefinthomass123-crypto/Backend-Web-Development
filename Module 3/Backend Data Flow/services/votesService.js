const postsRepo = require('../repository/postsRepo');
const votesRepo = require('../repository/votesRepo');
const AppError = require('../utils/AppError');

exports.castVote = async (postId, userId) => {
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError(
      'Post not found',
      404,
      'POST_NOT_FOUND'
    );
  }

  const existingVote = await votesRepo.find(postId, userId);

  if (existingVote) {
    throw new AppError(
      'You have already liked this post',
      409,
      'ALREADY_LIKED'
    );
  }

  return votesRepo.insert(postId, userId);
};

exports.countFor = async (postId) => {
  return votesRepo.countByPost(postId);
};