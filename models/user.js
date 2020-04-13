const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
	firstName : String,
	lastName : String,
	username : String,
	email : String,
	password : String,
	isAdmin : false,
	roles : Object,
	group : String,
	section : String,
	batchFrom : String,
	batchTo : String,
	status : String,
	userType : String,
	department : String,
	totalCorrect : String,
	tests : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Test'
	}],
	testMarks : Object,
	schedules : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Schedule'
	}],
	scheduleIds : Array,
	groupId : String,
	key : String,
	isVerified : false,
	emailToken : String,
	passToken : String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);