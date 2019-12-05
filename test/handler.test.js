const test = require('ava');
const delay = require('delay');
const sut = require('../src');

const noop = () => {};
const notToBeCalled = () => {
  throw new Error('not to be called');
};

const fakeAsyncHandler = async (req, res) => {
  if (req.fail) throw new Error('Boom boom');
  await delay(12);

  res.send({ok: true, res: req.value});
};
const fakePromiseHandler = (req, res) => {
  if (req.fail) return Promise.reject(new Error('Boom boom'));
  return delay(12).then(() => {
    res.send({ok: true, res: req.value});
  });
};

const handlerAsync = sut.asyncHandler(fakeAsyncHandler);
const handlerPromise = sut.asyncHandler(fakePromiseHandler);

test.cb('asyncHandler success [async]', t => {
  t.plan(1);
  handlerAsync(
    {value: 12},
    {
      send: res => {
        t.deepEqual(res, {ok: true, res: 12});
        t.end();
      }
    },
    notToBeCalled
  );
});

test.cb('asyncHandler fail [async]', t => {
  handlerAsync({fail: true, value: 'whatever'}, noop, err => {
    t.is(err.message, 'Boom boom');
    t.end();
  });
});

test.cb('asyncHandler success [promise]', t => {
  t.plan(1);
  handlerPromise(
    {value: 12},
    {
      send: res => {
        t.deepEqual(res, {ok: true, res: 12});
        t.end();
      }
    },
    notToBeCalled
  );
});

test.cb('asyncHandler fail [promise]', t => {
  handlerPromise({fail: true, value: 'whatever'}, noop, err => {
    t.is(err.message, 'Boom boom');
    t.end();
  });
});
