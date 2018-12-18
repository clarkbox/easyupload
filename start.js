var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        var havefile = false;
        if(typeof files.finput !== 'undefined' ){
            havefile = true;
        }else{
            havefile = false;
        }

        if (havefile) {
            var oldpath = files.finput.path;
            var newpath = '/var/www/repo/' + files.finput.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded');
                res.end();
            });
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(req.url)
            res.write('<form action="./incoming" method="post" enctype="multipart/form-data">');
            res.write('<input type="file" name="finput"><br>');
            res.write('<input type="submit">');
            res.write('</form>');
            return res.end();
        }

    });
}).listen(8080);
