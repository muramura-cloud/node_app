const http = require('http');

var server = http.createServer(
    (request, response) => {
        response.end('hello world.');
    }
);

server.listen(3000);


