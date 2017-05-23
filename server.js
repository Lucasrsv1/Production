/**
 * Created by tcs on 19/05/17.
 * Learn: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WSMctnXyvCI
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const pg = require('pg');
const Sequelize = require('sequelize');

var sequelize; // Instance
var maquina; // Table maquina

var dbSetup = new pg.Client({
	user: "postgres",
	password: "",
	host: "db",
	port: 5432
});

dbSetup.connect(function (error) {
	if (error) {
		console.log("Couldn't connect to postgres [X]");
		return;
	}

	console.log("Connected to postgres [OK]");

	var query = dbSetup.query("SELECT COUNT(*) FROM pg_database WHERE datname = 'production'");
	query.on('row', function (row) {
		if (row.count == 0) {
			console.log("Database production doesn't exist [!]");

			var creationQuery = dbSetup.query("CREATE DATABASE production");
			creationQuery.on('end', function () {
				console.log("Database production created [OK]");
				dbSetup.end();
				console.log("Connection closed [OK]");
				ConnectToProduction();
			});
		} else {
			console.log("Setup for database production completed [OK]");
			query.on('end', function () {
				dbSetup.end();
				console.log("Connection closed [OK]");
			});
			ConnectToProduction();
		}
	});
});

function ConnectToProduction () {
	sequelize = new Sequelize("production", "postgres", "", {
		host: process.env.POSTGRES_HOST,
		dialect: 'postgres',
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		}
	});

	sequelize.authenticate().then(function () {
		console.log("Connected to postgres [OK]");

		// Define o escopo da tabela maquina
		maquina = sequelize.define("maquina", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			nome: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: ""
			},
			pecas_produzidas: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			refugo: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			tempo_produzindo: {
				type: Sequelize.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			tempo_parado: {
				type: Sequelize.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			velocidade_producao: {
				type: Sequelize.DECIMAL(10, 4),
				allowNull: false,
				defaultValue: 0
			}
		});

		// CREATE TABLE IF NOT EXISTS maquinas
		maquina.sync({ force: false }).then(function () {
			console.log("Table maquinas exists [OK]");
		});
	}).catch(function (error) {
		console.log("Couldn't connect to postgres [X]");
		console.log(error);
	});
}

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
