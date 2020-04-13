const express = require('express');
	  router = express.Router();
	  middleware = require('../middleware/index.js');
	  User = require('../models/user');
	  Groups = require('../models/groups');

router.get('/user/:id', middleware.isOwner, (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if(err){
			console.log(err);
			res.render('back');
		}

		Groups.find({}, (err, groups) => {
			if(err){
				console.log(err);
				res.render('back');
			}
			res.render('users/edit', {user, groups});
		})	
	})
})

const updateUser = (userId, updatedUserObject, req, res) => {
	User.findByIdAndUpdate(userId, updatedUserObject, { new: true }, (err, updatedUser) => {
		if (err) {
			console.log(err);
			req.flash('error', 'Could not update user!')
			res.redirect('back');
		} else {
			if (req.body.password.length > 0) {
				updatedUser.setPassword(req.body.password, () => {
					updatedUser.save();
					req.flash('success', `Successfully updated ${updatedUser.username}`);
					res.redirect('back');
				})
			} else {
				req.flash('success', `Successfully updated ${updatedUser.username}`);
				res.redirect('back');
			}
		}
	})
}

router.post('/user/:id', middleware.isOwner, (req, res) => {
	let group = req.body.userGroupOption;

	if(req.body.userGroupOption == 'null'){
		group = req.body.userGroupNew;
	}

	let roles = {};

	req.body.role.forEach(function(role){
		roles[role] = true;
	})

	let isAdmin = false;
	
	if(roles.hasOwnProperty('admin'))
		isAdmin = true;

	let updatedUserObject = {
		username : req.body.username,
		email : req.body.email,
		status : req.body.status,
		userType : req.body.userType,
		group : group,
		roles : roles,
		isAdmin : isAdmin
	}

	let checkArray = [];

	if (updatedUserObject.username !== req.body.oldName) {
		checkArray.push({ "username": updatedUserObject.username });
	}

	if (updatedUserObject.email !== req.body.oldEmail) {
		checkArray.push({ "email": updatedUserObject.email });
	}

	if (checkArray.length > 0) {
		User.find({ $or: checkArray }, (err, foundUser) => {
			if (err) {
				req.flash('error', "Something went wrong! Try again");
				res.redirect('back');
			}

			if (foundUser.length > 0) {
				req.flash('error', "A user with that username or email already exists");
				res.redirect('back');
			} else {
				updateUser(req.params.id, updatedUserObject, req, res);
			}
		})
	} else {
		updateUser(req.params.id, updatedUserObject, req, res);
	}
})

router.get('/profile/:id', middleware.isOwner, (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {
			console.log(err);
			res.redirect('back');
		}
		
		res.render("users/editProfile", { user});
	})
})

router.post("/profile/:id", middleware.isOwner, (req, res) => {
	let updatedUserObject = {
		username: req.body.username,
		email: req.body.email,
	}

	let checkArray = [];

	if(updatedUserObject.username !== req.user.username){
		checkArray.push({ "username": updatedUserObject.username });
	}

	if(updatedUserObject.email !== req.user.email){
		checkArray.push({ "email" : updatedUserObject.email });	
	}
	
	if(checkArray.length > 0){
		User.find({ $or: checkArray }, (err, foundUser) => {
			if (err) {
				req.flash('error', "Something went wrong! Try again");
				res.redirect('back');
			}

			if (foundUser.length > 0) {
				req.flash('error', "A user with that username or email already exists");
				res.redirect('back');
			} else {
				updateUser(req.params.id, updatedUserObject, req, res);
			}
		})
	}else{
		updateUser(req.params.id, updatedUserObject, req, res);	
	}

});

module.exports = router;