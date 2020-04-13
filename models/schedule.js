const mongoose = require('mongoose');

let scheduleSchema = new mongoose.Schema({
	test : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Test'	
	},
	scheduler : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'User'
		},
		username : String
	},
	group : String,
	section : String,
	individual : String,
	assignBy : String,
	batchFrom : String,
	batchTo : String,
	department : String,
	time : Date,
	duration : String,
	expired : {
		type : Boolean,
		default : false
	},
	hideResult : {
		type : Boolean,
		default : false
	},
	countdown : String,
	started : {
		type : Boolean,
		default : false
	},
	updated : {
		type : Date,
		default : Date.now
	}
});

module.exports = mongoose.model('Schedule', scheduleSchema);