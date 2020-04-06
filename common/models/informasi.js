var multer = require('multer');
var fs = require('fs');

module.exports = function (Informasi) {
    var uploadedFileName = '';
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var dirPath = 'client/uploads/'
            if (!fs.existsSync(dirPath)) {
                var dir = fs.mkdirSync(dirPath);
            }
            cb(null, dirPath + '/');
        },
        filename: function (req, file, cb) {
            var ext = file.originalname.substring(file.originalname.lastIndexOf("."));
            var fileName = Date.now() + ext;
            uploadedFileName = fileName;
            cb(null, fileName);
        }
    });


    Informasi.upload = function (req, res, cb) {
        var upload = multer({
            storage: storage
        }).array('file', 12);
        upload(req, res, function (err) {
            if (err) {
                res.json(err);
            } else {
                res.json(uploadedFileName);
            }
        });        
    };

    Informasi.remoteMethod('upload',   {
        accepts: [{
            arg: 'req',
            type: 'object',
            http: {
                source: 'req'
            }
        }, {
            arg: 'res',
            type: 'object',
            http: {
                source: 'res'
            }
        }],
        returns: {
             arg: 'result',
             type: 'string'
        },
        http: {
            verb: 'post',
        }
    });
};