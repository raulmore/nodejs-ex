
const KEY = '314159265';
const fs = require('fs');
const api = require('./api');
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080, ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

require('http').createServer((req, res) => {
	var url = req.url.split('?'), i, tree = false, skip4docs = 0, skip4tags = 0, limit = 1000;
	if (url[0] == '/') {
		url[0] = '/app.html';
	}
	if (url.length > 1) {
		url[1] = url[1].split('&');
		for (i = 0; i < url[1].length; i++) {
			url[1][i] = url[1][i].split('=');
			switch (url[1][i][0]) {
				case 'key':
					url[1][i][1] == KEY && url[0] == '/app.html' &&
						(url[0] = '/3d1t0r.html');
					break;
				case 'tree':
					tree = true;
					break;
				case 'skip4tags':
					skip4tags = parseInt(url[1][i][1]);
					skip4tags || (skip4tags = 0);
					break;
				case 'skip4docs':
					skip4docs = parseInt(url[1][i][1]);
					skip4docs || (skip4docs = 0);
					break;
				case 'limit':
					limit = parseInt(url[1][i][1]);
					limit || (limit = 1000);
					break;
				default:
					break;
			}
		}
	}
	folders = url[0].split('/');
	if (folders.length > 2 && folders[1].toLowerCase() == 'api') {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		switch (req.method) {
			case 'POST':
				api.create(req, res, folders[2]);
				break;
			case 'GET':
				api.read(req, res, folders[2], folders.length > 3 ? folders[3] : null, tree, folders.length > 4 ? decodeURIComponent(folders[4]) : '', limit, skip4docs, skip4tags);
				break;
			case 'PUT':
				api.update(req, res, folders[2], folders.length > 3 ? folders[3] : null);
				break;
			case 'DELETE':
				api.delete(req, res, folders[2], folders.length > 3 ? folders[3] : null);
				break;
			default:
				break;
		}
	}
	else {
		if (url[0].toLowerCase() == 'pagecount') {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end();
		}
		else {
			fs.readFile(__dirname+'/public'+url[0], (err, data) => {
				if (err) {
					console.log(err);
					res.writeHead(404);
				}
				else {
					if (req.url.indexOf('.svg') != -1) {
						res.writeHead(200, {'Content-Type': 'image/svg+xml'});
					}
					if (req.url.indexOf('.html') != -1) {
						res.writeHead(200, {'Content-Type': 'text/html'});
					}
					if (req.url.indexOf('.js') != -1) { 
						res.writeHead(200, {'Content-Type': 'text/javascript'});
					}
					if (req.url.indexOf('.css') != -1) {
						res.writeHead(200, {'Content-Type': 'text/css'});
					}
					res.write(data);
				}
				res.end();
			});
		}
	}
}).listen(port, ip, () => {
	console.log(`Server running at http://${ip}:${port}/`);
});


