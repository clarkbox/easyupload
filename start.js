var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var args = require('minimist')(process.argv.slice(2));

if(args.help){
    console.log('easyupload --port 8080 --savepath /var/www/repo/ --formfileinputname finput');
    return
}

var port = args.port || 8080;
var savePath = args.savepath || '/var/www/repo/';
var tempPath = path.join(savePath, '.tmp');
var formFileInputName = args.formfileinputname || 'finput';

// Ensure temp directory exists
if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
}

http.createServer(function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = tempPath; // Set formidable to use our temp directory
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.error('Error parsing form:', err);
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Bad Request');
            return;
        }
        if(typeof files[formFileInputName] !== 'undefined' ){
            var newpath = path.join(savePath, files[formFileInputName].name);
            var oldpath = files[formFileInputName].path;
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    console.log('there was an error renaming the file', err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                    return;
                }
                res.write('File uploaded');
                res.end();
            });
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<form action="upload" method="post" enctype="multipart/form-data">');
            res.write('<input type="file" name="'+formFileInputName+'"><br>');
            res.write('<input type="submit">');
            res.write('</form>');
            res.end();
        }
    });
}).listen( port );