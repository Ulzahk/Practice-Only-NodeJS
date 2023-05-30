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

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function (stringLength) {
  stringLength = typeof (stringLength) === 'number' && stringLength > 0 ? stringLength : false;
  if (stringLength) {
    // Defined all the possible characters that could go into a string
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    let string = '';
    for (i = 1; i <= stringLength; i++) {
      // Get a random character from the possibleCharacters string
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append this character to the final string
      string += randomCharacter;
    }
    return string;
  } else {
    return false;
  }
};

module.exports = helpers;