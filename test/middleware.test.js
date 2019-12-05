const test = require('ava');
const delay = require('delay');
const {asyncMiddleware} = require('../src');

const notToBeCalled = () => {
  throw new Error('not to be called');
};

test.cb('asyncMiddleware explicit next [not invoked]', t => {
  t.plan(1);
  const middleware = asyncMiddleware(async req => {
    await delay(12);
    req.do = 'something';
    t.is(req.value, 12);
    t.end();
  });
  middleware({value: 12}, {}, notToBeCalled);
});

test.cb('asyncMiddleware explicit next [exception occured]', t => {
  t.plan(1);
  const middleware = asyncMiddleware(async () => {
    throw new Error('oh noo');
  });
  middleware({value: 12}, {}, err => {
    t.is(err.message, 'oh noo');
    t.end();
  });
});

test.cb('asyncMiddleware explicit next [invoked]', t => {
  t.plan(2);
  const middleware = asyncMiddleware(async req => {
    await delay(12);
    req.do = 'something';
    t.is(req.value, 12);
    return true;
  });
  middleware({value: 12}, {}, err => {
    t.assert(!err);
    t.end();
  });
});

test.cb('asyncMiddleware implicit next [not canceled]', t => {
  t.plan(2);
  const middleware = asyncMiddleware(async req => {
    await delay(12);
    req.do = 'something';
    t.is(req.value, 12);
  }, true);
  middleware({value: 12}, {}, err => {
    t.assert(!err);
    t.end();
  });
});

test.cb('asyncMiddleware implicit next [exception occured]', t => {
  t.plan(1);
  const middleware = asyncMiddleware(async () => {
    throw new Error('oh noo');
  }, true);
  middleware({value: 12}, {}, err => {
    t.is(err.message, 'oh noo');
    t.end();
  });
});

test.cb('asyncMiddleware implicit next [canceled]', t => {
  t.plan(1);
  const middleware = asyncMiddleware(async req => {
    await delay(12);
    req.do = 'something';
    t.is(req.value, 12);
    return false;
  }, true);
  middleware({value: 12}, {}, notToBeCalled).then(() => t.end());
});
