const express = require('express');
	  router = express.Router();


router.get('/logout', function(req, res){
    req.logout();
    req.flash("success", "Successfully Logged You Out!");
    res.redirect('/');
}); 

router.get('/', function(req, res){

	res.render('index');

});



module.exports = router;