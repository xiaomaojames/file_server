var express = require('express');
var router = express.Router();
var filemodel = require('../modles/file');
var multiparty = require('multiparty');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('index');
});

router.get('/test', function (req, res, next) {
    var test = new filemodel({filename: '1121212', filebanary: '1212121'});

    filemodel.count({}, function (err, count) {
        res.render('index', {count: count});
    });

});

router.post('/upload', function (req, res, next) {
    var mform = new multiparty.Form();
    mform.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
            res.send('err');
        }
        console.log(fields);
        //console.log(files);

        fs.readFile(files.file[0].path, 'utf-8', function (err00, data) {
            var filem = new filemodel({
                filename: fields.name[0],
                filebanary: data
            });
            console.log(filem.filename);

            filem.save(function (err11) {
                console.log('start save');
                if (err11) {
                    console.log(filem.filename);
                    console.log(err)
                } else {
                    console.log('kakakaka')
                    fs.unlink(files.file[0].path, function (err22) {
                        console.log(files.file[0].path);

                    });
                }
                res.send('ok');
            });
            //console.log(filem);

        });

    });
});

module.exports = router;
