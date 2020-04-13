const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let AdminSchema = new mongoose.Schema({
	username : String,
	email : String,
	password : String,
	role : String,
	departmentName : String,
	key : String,
	isVerified : false,
	emailToken : String,
	passToken : String
});

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', AdminSchema);