'use strict';
const Static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
let file = new Static.Server('./public');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response, function (err, result) {
            if (err && (err.status === 404)) { // If the file wasn't found
                file.serveFile('/index.html', 200, {}, request, response);
            }
        });
    }).resume();
}).listen(process.env.PORT || 8080);
