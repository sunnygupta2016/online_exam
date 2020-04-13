const express = require('express');
	  router = express.Router();
	  middleware = require('../middleware/index.js');


router.get('/dashboard', middleware.isFaculty, function(req, res){
	res.render('dashboard/dashboard-others');
})

module.exports = router;