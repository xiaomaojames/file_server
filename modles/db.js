var mongoose =require('mongoose');
mongoose.connect("mongodb://192.168.31.201:20001/test");
module.exports=mongoose;