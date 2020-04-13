const mongoose = require('mongoose');

let GroupSchema = new mongoose.Schema({
	name : String,
	users : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'User'
	}]
});

module.exports = mongoose.model('Group', GroupSchema);