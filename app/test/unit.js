// Unit tests

// Dependencies
const assert = require('assert');
const helpers = require('../lib/helpers');
const logs = require('../lib/logs');
const exampleDebuggingProblem = require('../lib/exampleDebuggingProblem');
const { log } = require('console');

// Holder for the tests
const unit = {};

// Assert that the getANumber function is returning a number
unit['helpers.getANumber should return a number'] = function (done) {
  const value = helpers.getANumber();
  assert.equal(typeof (value), 'number');
  done();
};

// Assert that the getANumber function is returning a 1
unit['helpers.getANumber should return 1'] = function (done) {
  const value = helpers.getANumber();
  assert.equal(value, 1);
  done();
};

// Assert that the getANumber function is returning a 2
unit['helpers.getANumber should return 2'] = function (done) {
  const value = helpers.getANumber();
  assert.equal(value, 2);
  done();
};

// Log.list should callback an array and a false error
unit['logs.list should callback a false error and an array of log names'] = function (done) {
  logs.list(true, function (err, logFileNames) {
    assert.equal(err, false);
    assert.ok(logFileNames instanceof Array);
    assert.ok(logFileNames.length > 0);
    done();
  });
};

// Logs.truncate should not throw if the logId doesn't exist
unit['logs.truncate should not throw if the log id does not exist. It should callback an error instead'] = function (done) {
  assert.doesNotThrow(function () {
    logs.truncate('I do not exist', function (err) {
      assert.ok(err);
      done();
    });
  }, TypeError);
};

// exampleDebuggingProblem should not throw (but it does)
unit['exampleDebuggingProblem.init should not throw when called'] = function (done) {
  assert.doesNotThrow(function () {
    exampleDebuggingProblem.init();
    done();
  }, TypeError);
};


module.exports = unit;