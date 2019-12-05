const asyncHandler = handler => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (err) {
    next(err);
  }
};

const asyncMiddleware = (middleware, implicitNext = false) => async (req, res, next) => {
  try {
    const shouldCallNext = await middleware(req, res, next);
    if ((implicitNext && shouldCallNext !== false) || shouldCallNext) next();
  } catch (err) {
    next(err);
  }
};

module.exports = {asyncHandler, asyncMiddleware};
