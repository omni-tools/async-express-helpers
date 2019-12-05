const delay = require('delay');
const express = require('express');
const {asyncHandler, asyncMiddleware} = require('../src'); // use 'async-express-helpers' in practice

const app = express();

app.use(
  asyncMiddleware(async (req, res, next) => {
    if (req.query.error === 'explicit') throw new Error('issue in explicit next async middleware');
    req.explicit = true;
    await delay(22);
    return next();
  })
);

app.use(
  asyncMiddleware(async req => {
    if (req.query.error === 'implicit') throw new Error('issue in implicit next async middleware');
    req.implicit = true;
    await delay(12);
  }, true)
);

app.get(
  '/',
  asyncHandler(async (req, res) => {
    if (req.query.error === 'handler') throw new Error('issue in async handler');
    await delay(22);
    res.send(`Hello I'm async`);
  })
);

app.use((err, req, res, next) => {
  res.status(500).send(`ERROR OCCURED: ${err.message}`);
});

app.listen(3223, () => console.log('hit me on localhost:3223'));
