const mongoose = require('mongoose');

let DepartmentSchema = new mongoose.Schema({
    name: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Department', DepartmentSchema);