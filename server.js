// Require modules
let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let UAParser = require('ua-parser-js');
let parser = new UAParser();

// Array of mime types
let mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

// Create server
http.createServer(function (req, res) {

    let uri = url.parse(req.url).pathname;
    let fileName = path.join(process.cwd(), unescape(uri));
    console.log('Loading ' + uri);
    let stats;

    try {
        stats = fs.lstatSync(fileName);
    } catch (e) {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.write('404 Not found');
        res.end();
        return;
    }

    console.log('----------- Request Info -----------');
    console.log('http ', req.httpVersion);
    console.log('method', req.method);
    console.log(parser.setUA(req.headers['user-agent']).getResult());
    console.log('----------- ------------ -----------');

    // Check if file/directory
    if (stats.isFile()) {
        let mimeType = mimeTypes[path.extname(fileName).split('.')
            .reverse()[0]];
        res.writeHead(200, {
            'Content-Type': mimeType
        });
        let fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write('500 Internal error');
        res.end();
    }

}).listen(1337, '0.0.0.0');

/*
 * http.createServer(function (req, res){ res.writeHead(200, {'Content-type':
 * 'text/plain'}); res.end('Hello world!'); }).listen(1337, '127.0.0.1');
 */

console.info('Server runing at http://localhost:1337');
