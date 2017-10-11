const fs = require('fs');
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

require('http').createServer((req, res) => {
	fs.readFile(__dirname+'/public'+req.url, function (err, data) {
		if (err) {
			console.log(err);
		}
		else {
			if (req.url.indexOf('.html') != -1) 
				res.writeHead(200, {'Content-Type': 'text/html'});
			if (req.url.indexOf('.js') != -1) 
				res.writeHead(200, {'Content-Type': 'text/javascript'});
			if (req.url.indexOf('.css') != -1) 
				res.writeHead(200, {'Content-Type': 'text/css'});
			res.write(data);
			res.end();
		}
	});
}).listen(port, ip, () => {
	console.log(`Server running at http://${ip}:${port}/`);
});
