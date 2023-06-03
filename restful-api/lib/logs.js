// Library for storing and rotating logs

// Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Container for the module
const lib = {};

// Base directory of the logs  folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// Append a string to a file. Create the file if it does not exists.
lib.append = function (file, string, callback) {
  // Open the file for appending
  fs.open(lib.baseDir + file + '.log', 'a', function (err, fileDescriptor) {
    if (!err && fileDescriptor) {
      fs.appendFile(fileDescriptor, string + '\n', function (err) {
        if (!err) {
          fs.close(fileDescriptor, function (err) {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing file that was being appended');
            }
          });
        } else {
          callback('Error appending to file');
        }
      });
    } else {
      callback('Could not open file for appending');
    }
  });
};

// List all the logs and optionally include all the compressed logs
lib.list = function (includeCompressedLogs, callback) {
  fs.readdir(lib.baseDir, function (err, data) {
    if (!err && data && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach(function (fileName) {
        // Add the .log files
        if (fileName.indexOf('.log') > -1) {
          trimmedFileNames.push(fileName.replace('.log', ''));
        }

        // Add on the .gz files to this array
        if (fileName.includes('.gz.b64') > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace('.gz.b64', ''));
        }
      });

      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

// Compress the contents of one .log file into .gz.b64  file within the same directory
lib.compress = function (logId, newFileId, callback) {
  const sourceFile = logId + '.log';
  const destinationFile = newFileId + '.gz.b64';

  fs.readFile(lib.baseDir + sourceFile, 'utf-8', function (err, inputString) {
    if (!err && inputString) {
      // Compress the data using gzip
      zlib.gzip(inputString, function (err, buffer) {
        if (!err && buffer) {
          // Send the data to the destination file
          fs.open(lib.baseDir + destinationFile, 'wx', function (err, fileDescriptor) {
            if (!err && fileDescriptor) {
              // Write to the destination file
              fs.writeFile(fileDescriptor, buffer.toString('base64'), function (err) {
                if (!err) {
                  // Close the destination file
                  fs.close(fileDescriptor, function (err) {
                    if (!err) {
                      callback(false);
                    } else {
                      callback(err);
                    }
                  });
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = function (fileId, callback) {
  const fileName = fileId + '.gz.b64';
  fs.readFile(lib.baseDir + fileName, 'utf-8', function (err, string) {
    if (!err && string) {
      // Decompress data
      const inputBuffer = Buffer.from(string, 'base64');
      zlib.unzip(inputBuffer, function (err, outputBuffer) {
        if (!err && inputBuffer) {
          // Callback
          const string = outputBuffer.toString();
          callback(false, string);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

// Truncate a log file
lib.truncate = function (logId, callback) {
  fs.truncate(lib.baseDir + logId + '.log', 0, function (err) {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};

module.exports = lib;