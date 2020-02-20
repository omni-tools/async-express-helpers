/**
 * Generate an express "handler" out of provided async middleware-like function
 *
 * @param {*} handler - async function to be wrapped (and injected req(uest) and res(ponse) objects)
 */
const asyncHandler = handler => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (err) {
    next(err);
  }
};

/**
 * Generate an express middleware out of provided async middleware-like function
 *
 * @param {*} middleware - async function to be wrapped
 * @param {Boolean} implicitNext - tells whether next middleware should be implicitely called [default false]
 */
const asyncMiddleware = (middleware, implicitNext = false) => async (req, res, next) => {
  try {
    const shouldCallNext = await middleware(req, res, next);
    if ((implicitNext && shouldCallNext !== false) || shouldCallNext) next();
  } catch (err) {
    next(err);
  }
};

module.exports = {asyncHandler, asyncMiddleware};
