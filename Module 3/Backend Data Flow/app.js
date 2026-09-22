const express = require('express');
const auth = require('./middleware/auth');
const postsRouter = require('./routes/posts');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

app.use(express.json());
app.use(auth);

// Public API
app.use('/posts', postsRouter);

// Safe internal-failure route for testing the error pipeline.
// It deliberately throws a generic internal error without exposing
// implementation details to the client.
app.get('/internal-error', (req, res, next) => {
  next(
    new AppError(
      'Database connection failed: postgres://admin:password@localhost',
      500,
      'INTERNAL_SERVER_ERROR'
    )
  );
});

// Unmatched route -> 404 through the error pipeline
app.use((req, res, next) => {
  next(new AppError('Route not found', 404, 'ROUTE_NOT_FOUND'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`posts-api listening on http://localhost:${PORT}`);
});

module.exports = app;