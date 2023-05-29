// Helpers for various tasks

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = function (string) {
  if (typeof (string) == 'string' && string.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(string).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (string) {
  try {
    const object = JSON.parse(string);
    return object;
  } catch (error) {
    return {};
  }
};

module.exports = helpers;