const postsService = require('../services/postsService');

exports.list = async (req, res) => {
  const page =
    req.query.page === undefined
      ? 1
      : Number(req.query.page);

  const limit =
    req.query.limit === undefined
      ? 10
      : Number(req.query.limit);

  const result = await postsService.getAll({ page, limit });

  res.json({
    data: result.data,
    meta: result.meta
  });
};

exports.getOne = async (req, res) => {
  const post = await postsService.getById(Number(req.params.id));

  res.json({
    data: post
  });
};

exports.create = async (req, res) => {
  const post = await postsService.create({
    authorId: req.userId,
    title: req.body.title,
    body: req.body.body
  });

  res.status(201).json({
    data: post
  });
};

exports.like = async (req, res) => {
  const vote = await postsService.like(
    Number(req.params.id),
    req.userId
  );

  res.status(201).json({
    data: vote
  });
};