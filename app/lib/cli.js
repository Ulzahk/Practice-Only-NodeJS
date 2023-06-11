// This are CLI related tasks

// Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');

class _events extends events { };
const e = new _events;

const cli = {};

// Input handlers
e.on('man', function (string) {
  cli.responders.help();
});

e.on('help', function (string) {
  cli.responders.help();
});

e.on('exit', function (string) {
  cli.responders.exit();
});

e.on('stats', function (string) {
  cli.responders.stats();
});

e.on('list users', function (string) {
  cli.responders.listUsers();
});

e.on('more user info', function (string) {
  cli.responders.moreUserInfo(string);
});

e.on('list checks', function (string) {
  cli.responders.listChecks(string);
});

e.on('more check info', function (string) {
  cli.responders.moreCheckInfo(string);
});

e.on('list logs', function (string) {
  cli.responders.listLogs();
});

e.on('more log info', function (string) {
  cli.responders.moreLogInfo(string);
});


// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function () {
  const commands = {
    'exit': 'Kill the CLI (and the rest of the application)',
    'man': 'Show this help page',
    'help': 'Alias of the "man" command',
    'stats': 'Get statistics on the underlying operating system and resource utilization',
    'list users': 'Show a list of all the registered (undeleted) users in the system',
    'more user info --{userId}': 'Show details of a specific user',
    'list checks --up --down': 'Show a list of all the active checks in the system, included their state. The "--up" and "--down" flags are both optional',
    'more check info --{checkId}': 'Show details of a specified check',
    'list logs': 'Show a list of all the logs files available to be read (compress)',
    'more log info --{fileName}': 'Show details of a specified log file',
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, follow by its explanation in white and yellow respectively
  for (const key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace();

  // End with another horizontal line
  cli.horizontalLine();
};

// Create a vertical space
cli.verticalSpace = function (lines) {
  lines = typeof (lines) == 'number' && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log('');
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = function () {
  // Get the available screen size
  const width = process.stdout.columns;

  let line = '';
  for (i = 0; i < width; i++) {
    line += '-';
  }

  console.log(line);
};

// Create centered text in the screen
cli.centered = function (string) {
  string = typeof (string) == 'string' && string.trim().length > 0 ? string.trim() : '';

  // Get the available screen size
  const width = process.stdout.columns;

  // Calculate the left padding there should be
  const leftPadding = Math.floor((width - string.length) / 2);

  // Put in the left padded spaces before the string itself
  let line = '';
  for (i = 0; i < leftPadding; i++) {
    line += ' ';
  }
  line += string;
  console.log(line);
};

// Exit
cli.responders.exit = function () {
  process.exit(0);
};

// Stats
cli.responders.stats = function () {
  // Compile an object of stats
  const stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free Memory': os.freemem(),
    'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime': os.uptime() + ' Seconds'
  };

  // Create a header for the stats
  cli.horizontalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Log out each stat
  for (const key in stats) {
    if (stats.hasOwnProperty(key)) {
      const value = stats[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace();

  // End with another horizontal line
  cli.horizontalLine();
};

// Lists users
cli.responders.listUsers = function () {
  _data.list('users', function (err, userIds) {
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach(function (userId) {
        _data.read('users', userId, function (err, userData) {
          if (!err && userData) {
            let line = `Name: ${userData.firstName} ${userData.lastName} Phone: ${userData.phone} Checks: `;
            const numberOfChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
            line += numberOfChecks;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
};

// More user info
cli.responders.moreUserInfo = function (string) {
  // Get the ID from the string
  const array = string.split('--');
  const userId = typeof (array[1]) == 'string' && array[1].trim().length > 0 ? array[1].trim() : false;
  if (userId) {
    // Lookup the user
    _data.read('users', userId, function (err, userData) {
      if (!err && userData) {
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(userData, { 'colors': true });
        cli.verticalSpace();
      }
    });
  }
};

// List checks
cli.responders.listChecks = function (string) {
  _data.list('checks', function (err, checkIds) {
    if (!err && checkIds && checkIds.length > 0) {
      cli.verticalSpace();
      checkIds.forEach(function (checkId) {
        _data.read('checks', checkId, function (err, checkData) {
          let includeCheck = false;
          const lowerString = string.toLowerCase();

          // Get the state of the check, defaul to down
          const state = typeof (checkData.state) == 'string' ? checkData.state : 'down';
          // Get the state default to unknown
          const stateOrUnknown = typeof (checkData.state) == 'string' ? checkData.state : 'unknown';
          // If the user has specified the state, or hasn't any state include the current check accordingly
          if (lowerString.indexOf('--' + state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)) {
            let line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} State: ${stateOrUnknown}`;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
};

// More check info
cli.responders.moreCheckInfo = function (string) {
  // Get the ID from the string
  const array = string.split('--');
  const checkId = typeof (array[1]) == 'string' && array[1].trim().length > 0 ? array[1].trim() : false;
  if (checkId) {
    // Lookup the user
    _data.read('checks', checkId, function (err, checkData) {
      if (!err && checkData) {
        // Print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(checkData, { 'colors': true });
        cli.verticalSpace();
      }
    });
  }
};

// List logs
cli.responders.listLogs = function () {
  _logs.list(true, function (err, logFileNames) {
    if (!err && logFileNames && logFileNames.length > 0) {
      cli.verticalSpace();
      logFileNames.forEach(function (logFileName) {
        if (logFileName.indexOf('-') > -1) {
          console.log(logFileName);
          cli.verticalSpace();
        }
      });
    }
  });
};

// More logs info
cli.responders.moreLogInfo = function (string) {
  // Get the logFileName from the string
  const array = string.split('--');
  const logFileName = typeof (array[1]) == 'string' && array[1].trim().length > 0 ? array[1].trim() : false;
  if (logFileName) {
    cli.verticalSpace();
    // Decompress the log
    _logs.decompress(logFileName, function (err, stringData) {
      if (!err && stringData) {
        // Split into lines
        const array = stringData.split('\n');
        array.forEach(function (jsonString) {
          const logObject = helpers.parseJsonToObject(jsonString);
          if (logObject && JSON.stringify(logObject) !== '{}') {
            console.dir(logObject, { colors: true });
            cli.verticalSpace();
          }
        });
      }
    });
  }
};

// Input processor
cli.processInput = function (string) {
  string = typeof (string) == 'string' && string.trim().length > 0 ? string.trim() : false;
  // Only process the input if the user actually wrote something. Otherwise ignore it
  if (string) {
    // Codify the unique strings that identify the unique questions allowed to be asked
    const uniqueInputs = [
      'man',
      'help',
      'exit',
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