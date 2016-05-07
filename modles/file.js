var mongoose=require('./db');
var fileschema=mongoose.Schema({
    filename:String,
    filebanary:Buffer
})

var filemodle=mongoose.model('filemodel',fileschema);
module.exports=filemodle;