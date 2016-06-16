var express = require('express');
var router = express.Router();
var filemodel = require('../modles/file');
var multiparty = require('multiparty');
var fs = require('fs');
var _ = require('lodash');

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

        fs.readFile(files.file[0].path, null, function (err00, data) {
            var filem = new filemodel({
                filename: fields.name[0],
                filebanary: data
            });

            filem.chunks = fields.chunks ? fields.chunks[0] : 0;
            filem.chunk = fields.chunk ? fields.chunk[0] : 0;
            filem.content_type = fields.type[0];
            filem.size = fields.size[0];
            filem.fileid = fields.fileid[0] + fields.id[0];


            filem.save(function (err11) {
                //fs.writeFile('temp.jpg', data)


                if (err11) {
                    console.log(filem.filename);
                    console.log(err)
                } else {
                    fs.unlink(files.file[0].path, function (err22) {
                        console.log(files.file[0].path);

                    });
                }
                res.send({
                    state:"true",
                    data:{fileid:filem.fileid}
                });
            });

        });

    });
});

var download=function (req, res, next) {
    var fileid = req.params.id;
    filemodel.find({fileid: fileid}, function (err, wantfiles) {
        console.log(wantfiles.length);
        if (wantfiles.length > 0) {
            //没有分片的
            var returnfile = wantfiles[0];
            if (returnfile.chunks == 0) {
                res.set("Content-Type", returnfile.content_type).send(returnfile.filebanary);
            }
//分片的大文件
            else {
                var sortedchunks=_.sortBy(wantfiles, function (o) {
                    return o.chunk;
                });
                res.set("Content-Type",returnfile.content_type);
                var tempbanar=[];
                _.each(sortedchunks,function(chunkfile){
                    tempbanar.push(chunkfile.filebanary);
                });
                //console.log(tempbanar);
                res.send(Buffer.concat(tempbanar)).end();
            }
        } else {
            res.status(500).end();
        }

    });

}
router.get('/download_img/:id',download);
router.get('/download_file/:id',download);

router.get('/GetFileDataById',function(req,res,next){
    var fileid=req.query.fileid;
    filemodel.findOne({fileid:fileid}).select("fileid size content_type filename").exec(function(err,filee){
        res.send({
            state:'true',
            data:formateFile(filee)})
    })

})

//filemode 格式转换
var formateFile=function(old){
    var newm={};
    newm.file_id=old.fileid;
    newm.name=old.filename;
    newm.type=old.content_type;
    newm.last_modify_time=old.last_modify_time ? old.last_modify_time:"";
    newm.size=old.size;
    newm.chunks=old.chunks;
    newm.chunk=old.chunk;
    return newm;
}

module.exports = router;
