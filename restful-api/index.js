//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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

    // Send the response
    res.end('Hello World\n');

    // Log the request path
    console.log({
      path: trimmedPath,
      method,
      queryStringParameters: queryStringObject,
      headers,
      payload: buffer,
    });
  });
});

// Start the server, and have it listen on port 3000
server.listen(3000, function () {
  console.log('The server is listening in port 3000 now');
});