const test = require('ava');
const sut = require('../src');

test('waiting for real tests', t => {
  t.assert(sut, 'sut is not falsy');
});
