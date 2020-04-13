const express = require('express');
	  router = express.Router();
	  passport = require('passport');
	  Admin = require('../models/admin'),
	  User = require('../models/user'),
	  middleware = require('../middleware/index');


router.get('/student', function(req, res){

	res.render('register/login');

})

router.get('/faculty', function(req, res){

	res.render('register/login_others');

})

router.get('/admin_login', function(req, res){

	res.render('register/login_admin');

})

router.post('/admin_login', passport.authenticate('local', 
	{
		failureRedirect : 'back',
		failureFlash : true,
	}), function(req, res){
		req.flash("success", "Successfully logged you in!");
        res.redirect("/admin/dashboard");
	}
)

router.post('/student', middleware.isBlocked, passport.authenticate('local', 
	{
		failureRedirect : 'back',
		failureFlash : true,
	}), function(req, res){
		req.flash("success", "Successfully logged you in!");
        res.redirect("/student/dashboard");
	}
)

router.post('/others', middleware.isBlocked, passport.authenticate('local', 
	{
		failureRedirect : 'back',
		failureFlash : true,
	}), function(req, res){
		req.flash("success", "Successfully logged you in!");
        res.redirect("/others/dashboard");
	}
)


module.exports = router;