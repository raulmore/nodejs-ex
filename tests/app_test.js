/*var server   = require('./aux'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {

    it('GET to / should return 200', function(done){
        chai.request(reqServer)
        .get('/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })

    })

    it('GET to /pagecount should return 200', function(done){
        chai.request(reqServer)
        .get('/pagecount')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })

    })
})*/


const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080, 
		ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

require('http').createServer((req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
}).listen(port, ip, () => {
	console.log(`Server running at http://${ip}:${port}/`);
});


