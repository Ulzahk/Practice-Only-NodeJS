#  Starting Commands
1. `node index.js`
2. `NODE_ENV=staging node index.js`
3. `NODE_ENV=production node index.js`
4. `NODE_DEBUG=http node index.js`
5. `NODE_DEBUG=workers node index.js`
6. `node inspect index-debug.js`
7. `node index-strict.js`

## Generate HTTPS
1. `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`