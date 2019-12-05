# Async Express Helpers

> Helpers to build async handlers/middleware for express

[![npm](https://img.shields.io/npm/v/@omni-tools/async-express-helpers.svg)](https://www.npmjs.com/package/@omni-tools/async-express-helpers)
[![Build Status](https://travis-ci.com/omni-tools/async-express-helpers.svg?branch=master)](https://travis-ci.com/omni-tools/async-express-helpers)
[![codecov](https://codecov.io/gh/omni-tools/async-express-helpers/branch/master/graph/badge.svg)](https://codecov.io/gh/omni-tools/async-express-helpers)

This plugins offer two helpers to assist you in building expressjs@4 applications with new async features of javascript.

It does so by providing an [`asyncHandler`](#asyncHandler) and a [`asyncMiddleware`](#asyncMiddleware) helper.

Both helpers will handle promise exceptions and automaticaly call the next callback.

## API

Retrieve both helpers from the module:
```js
  const {asyncHandler, asyncMiddleware} = require('async-express-helpers');
```

and there you go.

### asyncHandler

```js
  app.get('/some-path', asyncHandler(async (req, res) => {
      // do something async and then
      res.send('Hello 👋');
    })
  );
```

### asyncMiddleware
If ever exception occured in the handler (ejected promise), `next` is called with the exception.
Otherwise in the _"happy path"_, you have the possibility to activate an _implicit next mode_ which tell wrapper to take care to call `next`.

Here are the two modes:
- **explicit next** mode *(default)*: in this (default) mode, you either need to call `next` yourself (as you would normaly do). You can also return `true` (or any truthy value) from the middleware and the wrapper will `next()` for you.
  ```js
    app.use(
      asyncMiddleware(async (req, res, next) => {
        // do something with the req, res...
        next(); // or "return true;" instead
      })
    );
  ```

- **implicit next** mode: in this mode, the wrapper will automatically call `next` when the wrapped handler will return or resolve. If needed you can cancel this by returning `false` from wrapped middleware.

  ```js
  app.use(
    asyncMiddleware(async req => {
      // do something there, adding something for req for example
      // return false if you want to cancel implicit next
    }, true)
  );
  ```

## Example

A comprehensive example can be found in the [repository there](./example/index.js)

You can launch the server from the folder with `npm start`,
and try it with:

```bash
curl localhost:3223
curl localhost:3223\?error=handler
curl localhost:3223\?error=implicit
curl localhost:3223\?error=explicit
```
