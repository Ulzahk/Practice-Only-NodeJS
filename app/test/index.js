// Test runner

// Dependencies
const helpers = require('../lib/helpers');
const assert = require('assert');

// Application logic for the test runner
_app = {};

// Container for the test
_app.tests = {
  'unit': {}
};

// Assert that the getANumber function is returning a number
_app.tests.unit['helpers.getANumber should return a number'] = function (done) {
  const value = helpers.getANumber();
  assert.equal(typeof (value), 'number');
  done();
};

// Assert that the getANumber function is returning a 1
_app.tests.unit['helpers.getANumber should return 1'] = function (done) {
  const value = helpers.getANumber();
  assert.equal(value, 1);
  done();
};

// Assert that the getANumber function is returning a 2
_app.tests.unit['helpers.getANumber should return 2'] = function (done) {
  const value = helpers.getANumber();
  assert.equal(value, 2);
  done();
};

// Count all the tests
_app.countTests = function () {
  let counter = 0;
  for (key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (const testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          counter++;
        }
      }
    }
  }

  return counter;
};

// Run all the tests, collecting the errors and successes
_app.runTests = function () {
  const errors = [];
  let successes = 0;
  const limit = _app.countTests();
  let counter = 0;

  for (const key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (const testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          (function () {
            const tmpTestName = testName;
            const testValue = subTests[testName];

            // Call the tests
            try {
              testValue(function () {
                // If it calls back without throwing, then it succeded  so log it in green
                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                counter++;
                successes++;
                if (counter == limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch (error) {
              // If it throws, then it failed, so capture the error thrown and log it in red
              errors.push({
                'name': testName,
                'error': error
              });

              console.log('\x1b[31m%s\x1b[0m', tmpTestName);
              counter++;
              if (counter == limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }
};

// Produce a test outcome report
_app.produceTestReport = function (limit, successes, errors) {
  console.log('');
  console.log('------------------BEGIN TEST REPORT------------------');
  console.log('');
  console.log('Total Tests: ', limit);
  console.log('Pass: ', successes);
  console.log('Fail: ', errors.length);
  console.log('');

  // If there are errors, print them in details
  if (errors.length > 0) {
    console.log('------------------BEGIN ERROR DETAILS------------------');
    console.log('');

    errors.forEach(function (testError) {
      console.log('\x1b[31m%s\x1b[0m', testError.name);
      console.log(testError.error);
    });
    console.log('');
    console.log('------------------END ERROR DETAILS------------------');
  }

  console.log('');
  console.log('------------------END TEST REPORT------------------');
};


// Run the test
_app.runTests();