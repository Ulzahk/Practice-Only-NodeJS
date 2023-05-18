//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Define the handlers
const handlers = {};
handlers.sample = function (data, callback) {
  // Callback a http status code and a payload 
  callback(406, { name: 'My name is sample handler' });
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};


// Define a request router
const router = {
  'sample': handlers.sample
};

// The server should respond to all request with a string
const server = http.createServer(function (req, res) {
  // Get the url and parse it
  const parseUrl = url.parse(req.url, true);

  // Get path from the url
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parseUrl.query;

  // Get HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function (data) {
    buffer += decoder.write(data);
  });

  req.on('end', function () {
    buffer += decoder.end();

    // Choose the handler this request should go to. If not was is found  use the notFound handler

    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined'
      ? router[trimmedPath]
      : handlers.notFound;

    // Construct data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // Use status code called by the handler, or default to 200
      statusCode = typeof (statusCode) == 'number'
        ? statusCode
        : 200;

      // Use the payload called by the handler, or default to empty object
      payload = typeof (payload) == 'object'
        ? payload
        : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request
      console.log({
        statusCode,
        payload,
      });
    });
  });
});

// Start the server
server.listen(config.port, function () {
  console.log(`The server is listening in port ${config.port} in ${config.envName} mode`);
});

// NODE_ENV=stagging node index.js