// This are CLI related tasks

// Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('clie');
const events = require('events');

class _events extends events { };
const e = new _events;

const cli = {};

// Input processor
cli.processInput = function (string) {
  string = typeof (string) == 'string' && string.trim().length > 0 ? string.trim() : false;
  // Only process the input if the user actually wrote something. Otherwise ignore it
  if (string) {
    // Codify the unique strings that identify the unique questions allowed to be asked
    const uniqueInputs = [
      'man',
      'help',
      'exits',
      'stats',
      'list users',
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info'
    ];

    // Go through possible inputs and emit an event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some(function (input) {
      if (string.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // Emit an event matching the unique input and include the full string given by the user
        e.emit(input, string);
        return true;
      }
    });

    // If not match is found, tell the user to try again
    if (!matchFound) {
      console.log("Sorry, try again");
    }
  }
};

// Init script
cli.init = function () {
  // Send the start message to the console in dark blue
  console.log('\x1b[34m%s\x1b[0m', `The CLI is running`);

  // Start the interface
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of the input separately
  _interface.on('line', function (string) {
    // Send to the input processor
    cli.processInput(string);

    // Re- initialize the prompt afterwards
    _interface.prompt();
  });

  // If the user stops the CLI kill the associate process
  _interface.on('close', function () {
    process.exit(0);
  });
};

module.exports = cli;