const mongoose = require('mongoose');

let resultSchema = new mongoose.Schema({
	subjects : Array,
	user : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'User'
		},
		username : String
	},
	group : String,
	section : String,
	schedule : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Schedule'	
	},
	scheduleId : String,
	marks : String,
	total : String,
	totalCorrect : String
})

module.exports = mongoose.model('Result', resultSchema);