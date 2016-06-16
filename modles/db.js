var mongoose =require('mongoose');
mongoose.connect("mongodb://dev.greatipr.com:20001/file");
module.exports=mongoose;