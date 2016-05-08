var mongoose=require('./db');
var fileschema=mongoose.Schema({
    filename:String,
    filebanary:Buffer,
    fileid:String,
    chunks:Number,
    chunk:Number,
    size:Number,
    content_type:String
})

var filemodle=mongoose.model('filemodel',fileschema);
module.exports=filemodle;