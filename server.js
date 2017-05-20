/**
 * Created by tcs on 19/05/17.
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var contentTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'ico': 'image/x-icon',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'js': 'application/javascript',
    'otf': 'application/x-font-otf',
    'ttf': 'application/x-font-ttf',
    'eot': 'application/vnd.ms-fontobject',
    'woff': 'application/x-font-woff',
    'woff2': 'application/font-woff2',
    'zip': 'application/zip'
}

http.createServer(function (req, res) {
    var page = url.parse(req.url).pathname;
    var file;
    if (page.length <= 1)
        file = path.join(__dirname, 'public', page, 'index.html');
    else
        file = path.join(__dirname, 'public', page);

    //console.log("File: " + file);
    fs.readFile(file, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.end();
        } else {
            var ext = path.extname(file).slice(1);
            res.setHeader('Content-Type', contentTypes[ext]);
            res.end(data);
        }
    });
}).listen(3000, function () {
    console.log("Server listening port 3000 [OK]");
});
