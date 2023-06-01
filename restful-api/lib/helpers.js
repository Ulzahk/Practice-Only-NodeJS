// Helpers for various tasks

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

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

// Send an SMS message via Twilio
helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate parameters
  phone = typeof (phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof (msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

  if (phone && msg) {
    // Configure the request payload 
    const payload = {
      'From': config.twilio.fromPhone,
      'To': '+1' + phone,
      'Body': msg
    };

    // Stringify payload
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    const requestDetails = {
      'protocol': 'https:',
      'hostname': 'api.twilio.com',
      'method': 'POST',
      'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
      'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload),
      }
    };

    // Instantiate the request object
    const req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      const status = res.statusCode;

      // Callback succesfully if the request went through
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', function (err) {
      callback(err);
    });

    // Add payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback('Given parameters were missing or invalid');
  }
};

module.exports = helpers;