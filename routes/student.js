const express = require('express');
	  router = express.Router();
	  middleware = require('../middleware/index.js');

const calcAvg = (marks) => {
	return new Promise((resolve, reject) => {
		console.log(marks.length)
		if(marks.length < 1)
			resolve(0)

		let sum = 0;
		let avg = 0;
		for(let i=0; i<marks.length; i++){
			sum+=marks[i];
			if(i == marks.length-1){
				avg = sum/marks.length;
				resolve(parseInt(avg));
			}
		} 
		reject(0);
	})
}

router.get('/dashboard', middleware.isStudent, function(req, res){
	// User.findById(req.user._id, (err, user) => {
		// let avgMarks = 0;
		// let testMarks = user.testMarks;

		// Schedule.find()

		// if(user.testMarks)
		// 	avgMarks = await calcAvg(Object.values(user.testMarks)); 
		
		// // console.log(user.testMarks)

		res.render('dashboard/dashboard');
	// })
})

router.get('/scheduled', middleware.isStudent, function(req, res){
	Schedule.find({
		$or : [
			{
				$and : [
					{ "assignBy" : "group" },
					{ "group": req.user.group }
				]  
			},
			{
				$and : [
					{ "assignBy": "group" },
					{"group" : "all"},
					{"department": req.user.department},
					{"batchFrom": req.user.batchFrom},
					{"batchTo": req.user.batchTo}
				]
			},
			{
				$and: [
					{ "assignBy": "section" },
					{ "section": req.user.section }
				]
			},
			{
				$and: [
					{ "assignBy": "section" },
					{ "section": "all" },
					{ "department": req.user.department },
					{ "batchFrom": req.user.batchFrom },
					{ "batchTo": req.user.batchTo }
				]
			},
			{
				$and: [
					{ "assignBy": "individual" },
					{ "individual": req.user.username }
				]
			}
		]
	}).populate('test').exec(function(err, sch){
		// console.log(sch.length);

		if(sch.length < 1){
			res.render('dashboard/scheduled', {schedules:[]});	
		}

		sch.forEach(function(schedule, idx){
			let timeLeft = moment.duration(moment(schedule.time).add(parseInt(schedule.duration), 'minutes').diff(moment(new Date()))).asMinutes();

			if(timeLeft <= 0){
				schedule.expired = true;
				schedule.updated = Date.now();
				schedule.save();
			} else if (timeLeft > 0){
				if (timeLeft <= parseInt(schedule.duration)){
					schedule.started = true;
				}
				schedule.expired = false;
				schedule.updated = Date.now();
				schedule.save();
			} 

			if(idx == sch.length - 1){
				res.render('dashboard/scheduled', { schedules: sch.reverse() });
			}
		})
		
	})
});

router.get('/report', middleware.isStudent, function(req, res){
	Result.find({'user.username' : req.user.username}).populate({path : 'schedule', match : { hideResult : false }, populate : { path : 'test' }}).exec(function(err, result){
		// console.log(result);
		res.render('dashboard/report-student', {results : result.reverse()});	
	})
});

router.get('/result/:id', middleware.isStudent, function(req, res){
	Result.findById(req.params.id).populate({path : 'schedule', populate : { path : 'test' }}).exec(function(err, result){
		if(err)
			console.error(err)

		if(result){
			if(result.schedule.hideResult){
				res.redirect('/student/dashboard');
			}else
				res.render('student/result', { result: result, test: result.schedule.test, student: req.user.username});
		}else
			res.redirect("/student/dashboard");
	})
})

module.exports = router;