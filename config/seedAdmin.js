let User = require('../models/user');
let keys = require('./keys');

module.exports = function(){
	User.find({"username" : "admin"}, function(err, foundUser){
		if(err){
            console.log("Seeding error", err);    
        }

		if(foundUser.length > 0){
			foundUser[0].setPassword(keys.admin.pass, function(){
                foundUser[0].save();
            });
		}else{
			let newUser = new User({
		        username : "admin",
		        email : keys.admin.email,
		        departmentName : keys.admin.departmentName,
		        userType : "admin",	
		        isAdmin : true
		    });

			User.register(newUser, keys.admin.pass, function(err, admin){
				// console.log("successfully initialized admin");
			})
		}
	})
}
