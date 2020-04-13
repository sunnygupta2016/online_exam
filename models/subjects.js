const mongoose = require('mongoose');

let SubjectSchema = new mongoose.Schema({
	name : String
});

module.exports = mongoose.model('Subject', SubjectSchema);