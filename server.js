/**
 * Created by tcs on 19/05/17.
 * Learn: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WSMctnXyvCI
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var pg = require('pg');

var client = new pg.Client({
	user: "postgres",
	password: "",
	//1database: "production",
	host: "db",
	port: 5432
});
client.connect();

var query = client.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
query.on('end', function () {
	console.log("Query end [OK]");
	client.end();
});

/*var query = client.query("CREATE TABLE IF NOT EXISTS maquinas (id int PRIMARY_KEY, nome VARCHAR(100) NOT NULL, pecas_produzidas int NOT NULL DEFAULT 0, refugo int NOT NULL DEFAULT 0, tempo_produzindo bigint NOT NULL DEFAULT 0, tempo_parado bigint NOT NULL DEFAULT 0, velocidade_producao DECIMAL(10,2) NOT NULL DEFAULT 10)");
query.on('end', function () {
	console.log("Query end [OK]");
	client.end();
});*/

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
