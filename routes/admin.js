const express = require('express');
	  router = express.Router();
	  middleware = require('../middleware/index.js');
	  Group = require('../models/groups');
	  User = require('../models/user');


router.get('/dashboard', middleware.isAdmin, async (req, res) =>{
	const noTests = Test.count();
	const noDepts = Department.count();
	const noStudents = User.find({"userType" : "Student"}).count();

	Promise.all([noTests, noDepts, noStudents]).then((info) => {
		console.log(info);
	
		res.render('dashboard/dashboard-admin', {
			noTest : info[0],
			noDept : info[1],
			noStudent : info[2]
		})
	});
})

router.get('/add/user', middleware.isAdmin, function(req, res){
	Group.find({}, function(err, groups){
		if(err)
			console.error(err);
		else{
			Department.find({}, function (err, departments) {
				if (err)
					console.error(err);
				else {

				}
				res.render('register/adding-user', { groups: groups, departments });
			})	
		}
	})
})


router.get('/add/user/xls', middleware.isAdmin, function(req, res){
	Group.find({}, function (err, groups) {
		if (err)
			console.error(err);
		else {
			Department.find({}, function (err, departments) {
				if (err)
					console.error(err);
				else {

				}
				res.render('register/adding-user-xls', { groups: groups, departments });
			})
		}
	})
})
router.get('/delete/user', middleware.isAdmin, function(req, res){
	Group.find({}, function(err, groups){
		if(err){
			console.error(err);
		}
	  else{
		Group.find({}, function (err, result) {
			if (err)
					console.error(err);
				else {

			}
				res.render('register/deleting-user', { groups: groups });
			})
		}	
		//res.redirect('admin/delete/user');
	})
	//res.redirect('admin/delete/user');
})
router.get('/delete/admin/delete/:_id', middleware.isAdmin, function(req, res){
	var id=req.params._id;
	var del=Group.findByIdAndRemove(id);
	del.exec(function(err,data){
		if(err) throw err;
		res.redirect("/admin/dashboard");
	})
})
router.get('/delete/byuser', middleware.isAdmin, function(req, res){
	User.find({}, function(err, groups){
		if(err){
			console.error(err);
		}
	  else{
		User.find({}, function (err, result) {
			if (err)
					console.error(err);
				else {

			}
				res.render('register/deleting-by-user', {users:users });
			})
		}	
		//res.redirect('admin/delete/user');
	})
	//res.redirect('admin/delete/user');
})


router.get('/users/list', middleware.isAdmin, (req, res) => {

	User.find({ userType : 'Student' }, (err, users) => {
		if(err){
			console.log(err);
			req.flash('error', 'Could not retrieve users!');
			res.render('back');
		}
		Group.find({}, function(err, groups){
			if(err)
				console.error(err);
			else{
				res.render('users/list', { users, groups,  type: 'Student', mode : req.query.mode});
			}
		})

	})
})

router.post('/users/list', middleware.isAdmin, (req, res) => {
	let userTypeObject = {
		userType : req.body.user_option,
	};

	if(req.body.user_option == 'Student')
		userTypeObject.group = req.body.group_option;
	
	User.find(userTypeObject, (err, users) => {
		if(err){
			console.log(err);
			req.flash('error', 'Could not retrieve users!');
			res.render('back');
		}

		Group.find({}, function(err, groups){
			if(err)
				console.error(err);
			else
				res.render('users/list', { users, groups, type: req.body.user_option, mode: req.body.mode});
		})

	})
})

module.exports = router;