require('dotenv').config();
const express = require('express');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
// const favicon = require('serve-favicon');

require('./src/config/database');

const app = express();

if (process.env.SENTRY_URL) {
  Sentry.init({
    environment: process.env.ENVIRONMENT_NAME,
    dsn: process.env.SENTRY_URL,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app })
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());
}
app.use(cors());

// TODO: uncomment on deploy
// app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());

app.use(require('./src/config/auth'));
app.use('/api/users', require('./src/routes/api/users'));
app.use('/api/recipes/categories', require('./src/routes/api/dishTypes'));
app.use('/api/recipes', require('./src/routes/api/recipes'));
app.use('/api/books', require('./src/routes/api/recipeBooks'));
app.use('/api/planner', require('./src/routes/api/planner'));

if (process.env.SENTRY_URL) {
  app.use(Sentry.Handlers.errorHandler());

  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  });
}

console.log(`Express app listening on port ${process.env.PORT}`);

module.exports = app;
