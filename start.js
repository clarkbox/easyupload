var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));

if(args.help){
    console.log('easyupload --port 8080 --savepath /var/www/repo/ --formfileinputname finput');
    return
}

var port = args.port || 8080;
var savePath = args.savepath || '/var/www/repo/';
var formFileInputName = args.formfileinputname || 'finput';

http.createServer(function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if(typeof files[formFileInputName] !== 'undefined' ){
            var newpath = savePath + files[formFileInputName].name;
            var oldpath = files[formFileInputName].path;
            fs.rename(oldpath, newpath, function (err) {
                if (err) console.log('there was an error');
                res.write('File uploaded');
                res.end();
            });
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(req.url)
            res.write('<form action="upload" method="post" enctype="multipart/form-data">');
            res.write('<input type="file" name="'+formFileInputName+'"><br>');
            res.write('<input type="submit">');
            res.write('</form>');
            return res.end();
        }
    });
}).listen( port );