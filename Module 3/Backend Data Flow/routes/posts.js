const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/postsController');
const asyncHandler = require('../utils/asyncHandler');
const validateRequest = require('../utils/validateRequest');
const v = require('../validators/post.validator');

router.get('/', asyncHandler(ctrl.list));

router.get('/:id', asyncHandler(ctrl.getOne));

router.post(
  '/',
  v.createPost,
  validateRequest,
  asyncHandler(ctrl.create)
);

router.post('/:id/likes', asyncHandler(ctrl.like));

module.exports = router;