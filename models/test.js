const mongoose = require('mongoose');

let testSchema = new mongoose.Schema({
	subjects : Array,
	title : String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'User'
		},
		username : String
	},
	updated : {
		type : Date,
		default : Date.now
	}
});

module.exports = mongoose.model('Test', testSchema);