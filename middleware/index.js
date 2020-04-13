
let middleware = {};

middleware.isMobile = (req, res, next) => {
	// console.log(req.device.type.toUpperCase());
	if(req.device.type.toUpperCase() == 'PHONE'){
		res.render('error', {code : "Mobile device detected! Please access from desktop"})
	}else{
		return next();
	}
}

middleware.isAdmin = function(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.isAdmin){
			// console.log(req.user.isAdmin);
			return next();
		}
		else{
			// console.log(req.user.role);
			res.redirect('back');
		}
	}else{
		// console.log(req.user);
		req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
	}
}

middleware.isBlocked = (req, res, next) => {
	User.find({username : req.body.username}, (err, user) => {
		if(err){
			console.log(err);
			res.redirect('back');
		}

		if(user.length < 1){
			return next();
		}

		if(user[0] !== undefined && user[0].status == 'active'){
			return next();
		}else{
			// console.log(req.user);
			req.flash("error", "Your account has been blocked!");
	        res.redirect('back');
		}
	})
		
}

middleware.isStudent = function(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.userType.toLowerCase() == 'student'){
			// console.log(req.user.isAdmin);
			return next();
		}
		else{
			// console.log(req.user.role);
			res.redirect('back');
		}
	}else{
		// console.log(req.user);
		req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
	}
}

middleware.isFaculty = function(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.userType.toLowerCase() == 'faculty' || req.user.userType.toLowerCase() == 'others'){
			// console.log(req.user.isAdmin);
			return next();
		}
		else{
			// console.log(req.user.role);
			res.redirect('back');
		}
	}else{
		// console.log(req.user);
		req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
	}
}

middleware.isAuthor = function(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.isAdmin){
			return next();	
		}else if(req.user.roles.hasOwnProperty('author')){
			// console.log(req.user.isAdmin);
			return next();
		}
		else{
			// console.log(req.user.role);
			res.redirect('back');
		}
	}else{
		// console.log(req.user);
		req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
	}
}

middleware.isSchedule = function(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.isAdmin){
			return next();
		} else if(req.user.roles.hasOwnProperty('schedule')){
			// console.log(req.user.isAdmin);
			return next();
		}else{
			// console.log(req.user.role);
			res.redirect('back');
		}
	}else{
		// console.log(req.user);
		req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
	}
}

middleware.isParticipant = function(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.roles.hasOwnProperty('participant')){
			// console.log(req.user.isAdmin);
			return next();
		}
		else{
			// console.log(req.user.role);
			res.redirect('back');
		}
	}else{
		// console.log(req.user);
		req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
	}
}

middleware.isAnalytics = function(req, res, next){
	if(req.isAuthenticated()){
		if (req.user.isAdmin){
			return next();	
		}else if(req.user.roles.hasOwnProperty('analytics')){
			// console.log(req.user.isAdmin);
			return next();
		}
		else{
			// console.log(req.user.role);
			res.redirect('back');
		}
	}else{
		// console.log(req.user);
		req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
	}
}

// middleware.isValidGroup = function(req, res, next){
// 	if(req.isAuthenticated()){
		
// 		if (req.body[req.body.assignBy] == 'all') {

// 			return next();
// 		} else {
// 			// console.log(req.user.role);
// 			res.redirect("back");
//     	}
// 	}else{
// 		// console.log(req.user);
// 		req.flash("error", "You are not authenticated!!");
//         res.redirect('back');
// 	}
// }

middleware.isOwner = function(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.isAdmin || req.user._id == req.params.id){
			// console.log(req.user.isAdmin);
			return next();
		}
		else{
			// console.log(req.user.role);
			req.flash("error", "Unauthorized request!!");
			res.redirect('back');
		}
	}else{
		// console.log(req.user);
		req.flash("error", "Unauthorized request!!");
        res.redirect('back');
	}
}

module.exports = middleware;