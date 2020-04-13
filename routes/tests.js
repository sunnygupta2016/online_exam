const express = require('express');
	  router = express.Router();
	  middleware = require('../middleware/index.js');
	  Subject = require('../models/subjects');
	  Test 	= require('../models/test');
	  Group = require('../models/groups');
	  Schedule = require('../models/schedule');
	  Result = require('../models/results');
	  Agenda = require('agenda-n');
	  moment = require('moment');
	  multer = require("multer");
	  shuffle=require('shuffle-array');
	 // mapArray=require('map-array');
	 // map=require('array-map');
	 // HashMap=require('hashmap');
	  //shuffled=require('immutable-shuffle');
	 // Immutable=require('immutable');
	 // _ =require('underscore');
	  upload = multer({ storage: multer.memoryStorage(), limits: {fileSize: 1000 * 1000 * 15} });
	//   imgStorage = 
      utls=require('../utils');

router.get('/new', middleware.isAuthor, function(req, res){
	res.render('quiz/test-info', {action : '/test/new/'});
});

router.post('/new', middleware.isAuthor, function(req, res){
	Subject.find({}, function(err, subjects){
		if(err)
			console.error(err);

		res.render('quiz/test-info-subject', {subjects : subjects, subNo : req.body.subNo - 1, testId : 'null', title : req.body.title});
	})
});

router.post('/new/info', middleware.isAuthor, function(req, res){
	let subject = req.body.subjectOption;

	if(req.body.subjectOption == 'null'){
		subject = req.body.subjectNew;

		Subject.find({'name' : subject}, function(err, subjectFound){
			if(err){
				req.flash('error', "Something went wrong! Try again");
				res.redirect('back');
			}	

			if(!subjectFound.length > 0){
				Subject.create({name : subject}, function(err, newSubject){
					if(err)
						console.error(err);
				})
			}
		})

	}

	let testInfo = {
		subject : subject,
		totalQue : req.body.queNo,
		title : req.body.title,
		subNo : req.body.subNo,
		testId : req.body.testId,
		title : req.body.title
	}

	res.render('quiz/add-test', {testInfo : testInfo});
});

const crypto = require('crypto');
const storageImg = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets/test_imgs/");
	},
	filename: function (req, file, cb) {

		let customFileName = crypto.randomBytes(10).toString('hex');
		// get file extension from original file name
		let fileExtension = file.originalname.split('.')[1]

		cb(null, customFileName + '__' + req.body.title + '__' + 'sub-' + req.body.subNo + '-' + file.fieldname + "." + fileExtension);
	}
})

const uploadImgMulter = multer({ storage: storageImg }).any();


// const uploadImg = multer({ dest: "../public/assets/test_imgs/tmp/" });

router.post('/new/details', uploadImgMulter, middleware.isAuthor, function(req, res){
	
	let total = req.body.total;
	let questions = [];

	

	for(let i = 0; i < total; i++){

		let que = {};

		que.text = req.body[`que-${i+1}`];
		que.type = req.body[`que-${i+1}-type`];
		que.options = [];

		let imgFile = req.files.find(n => n.fieldname === `que-${i + 1}-img`);

		if(imgFile !== undefined){
			que.img = imgFile.path;	
		}

		// console.log(req.body["que-1-op-1"]);

		let key;
		let pat = new RegExp(`que-${i+1}-op-`);

		for(key in req.body){
			if(key in req.body && pat.test(key) && key !== `que-${i+1}-op-correct`)
				que.options.push(req.body[key]);
		}

		que.correct_op = req.body[`que-${i+1}-op-correct`];

		

		que.desc = req.body[`que-${i+1}-desc`];

		questions.push(que);

		// console.log(que);
	}
	
	const subjectInfo = {
		total,
		subject: req.body.subject,
		questions
	};

	User.findById(req.user._id, function(err, user){
		if(err)
			console.error(err);

		let testInfoAll = { 
			subNo: req.body.subNo - 1, 
			testId: req.body.testId
		}

		// console.log(req.body.testId)

		if(req.body.testId == 'null'){
			Test.create({ subjects : [subjectInfo] }, function (err, que) {
				if (err) {
					console.log(error);
					req.flash("error", "Something went wrong!");
					res.redirect('back');
				}

				que.author.id = req.user._id;
				que.author.username = req.user.username;
				que.title = req.body.title;
				que.save();

				// console.log(req.body.title);

				testInfoAll.testId = que._id;
				testInfoAll.title = req.body.title;

					// console.log("Successfully added test");

				if (req.body.subNo > 0) {
					Subject.find({}, function (err, subjectAll) {
						if (err)
							console.error(err);
						testInfoAll.subjects = subjectAll;
						res.render('quiz/test-info-subject', testInfoAll);
					})
				} else {
					user.tests.push(que);
					user.save();
					req.flash('success', "Successfully added test");

					if (req.user.username == 'admin')
						res.redirect('/admin/dashboard');
					else
						res.redirect('/others/dashboard');
				}
					
			})	
		}else{
			Test.findByIdAndUpdate(req.body.testId, {$push: { subjects : subjectInfo}}, (err, test) => {
				if(err)
					console.log(err);
				
				// test.subjects.push(subjectInfo);
				// // console.log(test.subjects);
				// // console.log(subjectInfo);
				// test.markModified('subjects')
				// test.save();
				testInfoAll.testId = test._id;

				if (req.body.subNo > 0) {
					Subject.find({}, function (err, subjectAll) {
						if (err)
							console.error(err);
						testInfoAll.subjects = subjectAll;
						res.render('quiz/test-info-subject', testInfoAll);
					})
				} else {
					user.tests.push(test);
					user.save();
					req.flash('success', "Successfully added test");

					if (req.user.username == 'admin')
						res.redirect('/admin/dashboard');
					else
						res.redirect('/others/dashboard');
				}
			})	
		}
		
	})

});

router.get('/new/xls', middleware.isAuthor, function(req, res){
	res.render('quiz/test-info', {action : '/test/new/xls'});

});

router.post('/new/xls', middleware.isAuthor, function(req, res){

	Subject.find({}, function(err, subjects){
		if(err)
			console.error(err);

		res.render('quiz/add-test-xls', {subjects : subjects, subNo : req.body.subNo - 1, testId : 'null', title : req.body.title});
	})


});

// const addTest 

const xlsx = require('xlsx');
router.post('/new/xls/detail', middleware.isAuthor, upload.single('file'), function(req, res){
	let uploadedFile = req.file;

	let testSheet = xlsx.read(uploadedFile.buffer);

	let test = xlsx.utils.sheet_to_json(testSheet.Sheets[testSheet.SheetNames[0]]);

	let subject = req.body.subjectOption;

	if(req.body.subjectOption == 'null'){
		subject = req.body.subjectNew;

		Subject.find({'name' : subject}, function(err, subjectFound){
			if(err){
				req.flash('error', "Something went wrong! Try again");
				res.redirect('back');
			}	

			if(!subjectFound.length > 0){
				Subject.create({name : subject}, function(err, newSubject){
					if(err)
						console.error(err);
				})
			}
		})

	}

	let questions = [];

	test.forEach(function(que){
		let queObj = {};

		queObj.text = que['Question'];
		queObj.type = 'radio';

		if(que['Question Type (M/S)'] == 'M')
			queObj.type = 'checkbox';


		queObj.options = [];

		let key;
		let pat = new RegExp(`Option`);

		for(key in que){
			if(que.hasOwnProperty(key) && pat.test(key) && key !== `Correct Option`)
				queObj.options.push(que[key]);
		}

		queObj.correct_op = que['Correct Option'];
		queObj.desc = que['Description'];

		questions.push(queObj);
	})

	const subjectInfo = {
		total : test.length,
		subject,
		questions
	};

	User.findById(req.user._id, function(err, user){
		if(err)
			console.error(err);

		let testInfoAll = { 
			subNo: req.body.subNo - 1, 
			testId: req.body.testId,
		}
		// console.log('length ', req.body.testId.length);
		if(req.body.testId == 'null'){
			Test.create({ subjects : [subjectInfo] }, function (err, que) {
				if (err) {
					console.log(error);
					req.flash("error", "Something went wrong!");
					res.redirect('back');
				}

				que.author.id = req.user._id;
				que.author.username = req.user.username;
				que.title = req.body.title;
				que.save();

				// console.log(req.body.title);

				testInfoAll.testId = que._id;
				testInfoAll.title = req.body.title

					// console.log("Successfully added test");

				if (req.body.subNo > 0) {
					Subject.find({}, function (err, subjectAll) {
						if (err)
							console.error(err);
						testInfoAll.subjects = subjectAll;
						res.render('quiz/add-test-xls', testInfoAll);
					})
				} else {
					user.tests.push(que);
					user.save();
					req.flash('success', "Successfully added test");

					if (req.user.username == 'admin')
						res.redirect('/admin/dashboard');
					else
						res.redirect('/others/dashboard');
				}
					
			})	
		}else{
			Test.findByIdAndUpdate(req.body.testId, {$push: { subjects : subjectInfo}}, (err, testFound) => {
				if(err)
					console.log(err);
				
				testInfoAll.testId = testFound._id;
				testInfoAll.title = req.body.title;

				// console.log('here', testFound._id);

				if (req.body.subNo > 0) {
					Subject.find({}, function (err, subjectAll) {
						if (err)
							console.error(err);
						testInfoAll.subjects = subjectAll;
						res.render('quiz/add-test-xls', testInfoAll);
					})
				} else {
					user.tests.push(testFound);
					user.save();
					req.flash('success', "Successfully added test");

					if (req.user.username == 'admin')
						res.redirect('/admin/dashboard');
					else
						res.redirect('/others/dashboard');
				}
			})	
		}

	})

})


router.get('/schedule', middleware.isSchedule, function(req, res){
	if(req.user.isAdmin){
		Test.find({}, (err, tests) => {
			if(err)
				console.error(err)

			Group.find({}, function(err, groups){
				if(err)
					console.error(err);

				//console.log(tests)

				Department.find({}, (err, departments) => {
					if(err)
						console.error(err);	

					Section.find({}, (err, sections) => {
						if (err)
							console.error(err);

						res.render('faculty/schedule', { groups: groups, tests: tests, departments, sections })
					})
				})

			})	
		})
	}else{
		User.findById(req.user._id).populate('tests').exec(function(err, tests){
			if(err)
				console.error(err)
			Group.find({}, function(err, groups){
				if(err)
					console.error(err);

				//console.log(tests)
				Section.find({}, (err, sections) => {
					if (err)
						console.error(err);

					res.render('faculty/schedule', { groups: groups, tests: tests, departments: [req.user.department], sections })
				})

			})
		})
	}
})


let schedule = (test, date, time, field, duration, timezoneOffset) => {

	let agenda = new Agenda({
			  	db : {
			  		address : "mongodb://localhost/MMUQuizApp"
			  	}
			});


	let sch_time = moment(`${date} ${time}`).add(0, 'minutes');

	//console.log(duration);

	if(duration > 0){
		sch_time = moment(`${date} ${time}`).add(duration, 'minutes');
	}
	// else{
	// 	sch_time = moment(`${date} ${time}`).add(0, 'minutes');	
	// }

	let UTC_Offset = moment.utc(sch_time).add(timezoneOffset, 'minutes');

	let timeDiff = UTC_Offset.diff(moment.utc());
	let scheduleTime = (timeDiff <= 0 ? moment.utc(sch_time) : UTC_Offset).toDate(); 
		 

	agenda.define(`scheduleTest${field}`, function(job, done){
		let updatedObj = {};
		updatedObj[field] = true;
		updatedObj['updated'] = Date.now();

		Schedule.findByIdAndUpdate(test._id, updatedObj, function(err, testTask){
			if(err)
				console.error(err);
			// console.log("Successfully updated ", field);
			done();
		})
	});

	//console.log(field, scheduleTime);
	
	agenda.on('ready', function(){			
		agenda.schedule(scheduleTime, `scheduleTest${field}`);
		agenda.start();

	})
		
}


router.post('/schedule', middleware.isSchedule, async function(req, res){

	let date = req.body.date;
	let time = req.body.time;

	let scheduledTest = {
		test : {},
		scheduler : {}
	}

	let test_time = moment(`${date} ${time}`).add(0, 'minutes');
	let UTC_Offset = moment.utc(test_time).add(req.body.timezoneOffset, 'minutes');

	let timeDiff = UTC_Offset.diff(moment.utc());
	let test_local = (timeDiff <= 0 ? moment.utc(test_time) : UTC_Offset).toDate(); 
	
	if (req.body.groupFilterBy == 'group'){
		scheduledTest.group = req.body.userGroupOption;	
		scheduledTest.assignBy = 'group';	
	} else if (req.body.groupFilterBy == 'section'){
		scheduledTest.section = req.body.userSectionOption;
		scheduledTest.assignBy = 'section';
	}else{
		await User.findOne({ "username": req.body.studentUsername}, (err, foundStudent) => {
			if(foundStudent){
				scheduledTest.individual = req.body.studentUsername;
				scheduledTest.assignBy = "individual";
			}else{
				req.flash('error', "Username doesn't exist!");
				res.redirect('back');
				return;
			}
		})
			
	}

	if(req.body.hideResult == 'true'){
		scheduledTest.hideResult = true;	
	}else{
		scheduledTest.hideResult = false;
	}

	scheduledTest.test = req.body.testOp;
	scheduledTest.scheduler.id = req.user._id;
	scheduledTest.scheduler.username = req.user.username;
	scheduledTest.batchFrom = req.body.batchFrom;
	scheduledTest.batchTo = req.body.batchTo;
	scheduledTest.department = req.body.department;
	scheduledTest.time = test_local;
	scheduledTest.duration = req.body.duration;
	scheduledTest.countdown = req.body.countdown;

	Schedule.create(scheduledTest, function(err, test){

		if(err)
			console.error(err);

		schedule(test, date, time, 'started', req.body.timezoneOffset);
		schedule(test, date, time, 'expired', parseInt(req.body.duration), req.body.timezoneOffset);
			
		req.flash('success', 'Successfully scheduled test');
		res.redirect('back');
				

	})

});

let isAttempted = (userId, scheduleId) => {
	return new Promise((resolve, reject) => {
		let attempted = false;

		User.findById(userId).populate('schedules').exec(function(err, user){
			if(err){
				console.error(err);
				reject(err);
			}

			if (user.schedules.length < 1){
				resolve(attempted);	
			}

			user.schedules.forEach(function(schedule, idx){
			// console.log('User schedule', schedule._id);
				if(JSON.stringify(schedule._id) == JSON.stringify(scheduleId)){
					// console.log('matched');
					attempted = true;
					resolve(attempted);
					return;
				}

				if(idx == user.schedules.length - 1)
					resolve(attempted);
			})
			
		})

	})
}


router.get('/take/:id', middleware.isParticipant, function(req, res){
	Schedule.findById(req.params.id).populate('test').exec(function(err, scheduleFound){
		let questions=[];
 

		if(err)
			console.error(err);
		 
		let timeLeft = moment.duration(moment(scheduleFound.time).add(parseInt(scheduleFound.duration), 'minutes').diff(moment(new Date()))).asMinutes();

		if (timeLeft <= 0) {
			scheduleFound.expired = true;
			scheduleFound.updated = Date.now();
			scheduleFound.save();
			
		  
		} else if (timeLeft > 0) {
			if (timeLeft <= parseInt(scheduleFound.duration)) {
				scheduleFound.started = true;
				
		       
				
			}
			scheduleFound.expired = false;
			scheduleFound.updated = Date.now();
			scheduleFound.save();
			
		      
				
			
		} 

		isAttempted(req.user._id, req.params.id).then(function(attempted){

			if (attempted || req.user.scheduleIds.indexOf(scheduleFound._id) > -1){
				req.flash('error', 'You have already attempted this test!');
				res.redirect('back');
			}else{
				

				if (
					(scheduleFound.assignBy == 'group' && req.user.group !== scheduleFound.group) 
					|| (scheduleFound.assignBy == 'section' && req.user.section !== scheduleFound.section)
				){
					if ((scheduleFound.group == 'all' || scheduleFound.section == 'all') && req.user.department == scheduleFound.department && 
						req.user.batchFrom == scheduleFound.batchFrom && 
						req.user.batchTo == scheduleFound.batchTo
					){	
						let timeLeft;
						if ('countdown' in scheduleFound && scheduleFound.countdown == 'login'){
							timeLeft = parseInt(scheduleFound.duration);
						}else{
							timeLeft = moment.duration(moment(scheduleFound.time).add(parseInt(scheduleFound.duration), 'minutes').diff(moment(new Date()))).asMinutes();
						}

						if(timeLeft < 0){
							req.flash('error', 'Test is expired!');
							res.redirect('back');
						}else{
							User.findByIdAndUpdate(req.user._id, {
								$push: { scheduleIds: scheduleFound._id },
							}, function (err, user) {
								if (err)
									console.error(err);
								//shuffle-array(test);
								//shuffle-array(scheduleFound.test);

							})

							res.render('quiz/quiz-index', {test : scheduleFound.test, schedule : scheduleFound, duration : timeLeft,utls});
							
						}	
					}else{
						req.flash('error', 'This test is not scheduled for your user group!');
						res.redirect('back');
					}
				}else if(scheduleFound.expired){
					req.flash('error', 'This test is expired!');
					res.redirect('back');
				} else if (
					(scheduleFound.assignBy == 'individual' && req.user.username == scheduleFound.individual)
					|| (scheduleFound.assignBy == 'group' && req.user.group == scheduleFound.group) 
					|| (scheduleFound.assignBy == 'section' && req.user.section == scheduleFound.section)
				){
					// let timeLeft;
					if('countdown' in scheduleFound && scheduleFound.countdown == 'login'){
						timeLeft = parseInt(scheduleFound.duration);
					}else{
						timeLeft = moment.duration(moment(scheduleFound.time).add(parseInt(scheduleFound.duration), 'minutes').diff(moment(new Date()))).asMinutes();
					}

					if(timeLeft < 0){
						req.flash('error', 'Test is expired!');
						res.redirect('back');
					}else{
						User.findByIdAndUpdate(req.user._id, {
							$push: { scheduleIds: scheduleFound._id },
						
						}, function (err, user) {
							if (err)
								console.error(err);

						})
						res.render('quiz/quiz-index', {test : scheduleFound.test, schedule : scheduleFound, duration : timeLeft,utls});
						
					}

				}


			}
			
		})
	})
});


router.post('/submit/:id', middleware.isParticipant, function(req, res){
	isAttempted(req.user._id, req.params.id).then(function(attempted){

		if(attempted){
			req.flash('error', 'You have already attempted this test!');
			res.redirect('back');
		}else{
			try{
				Schedule.findById(req.params.id).populate('test').exec(function(err, schedule){
					if(err)
						console.error(err);

					let subjects = [];
					let markCount = 0;
					let subTotal = 0;

					schedule.test.subjects.forEach((sub, idx) => {
						let subject = {
							subject : sub.subject,
							answers : [],
							totalCorrect : 0,
							marks : 0 
						};
						
						subTotal += parseInt(sub.total);
						for(var i=0; i<sub.total; i++){
							let ans = {};
							ans.chosen = req.body[`que-${idx}-${i+1}-op`]
							ans.correctOp = sub.questions[i]['correct_op'];
	
							if (ans.chosen !== undefined && ans.chosen.toString().localeCompare(ans.correctOp) == 0){
								ans.isCorrect = true;
								markCount++;
								subject.totalCorrect++;
							}
							else{
								ans.isCorrect = false;
							}
	
							subject.answers.push(ans);

							if(i == sub.total -1){
								//subject.marks = parseInt(subject.totalCorrect);
								subject.marks = parseInt((subject.totalCorrect * 100) / sub.total);
								subjects.push(subject);
							}
						}
					})

					const marks = parseInt(markCount);
					//const totalCorrect=parseInt(totalCorrect);
					//const marks = parseInt((markCount*100)/subTotal);
					
					User.findByIdAndUpdate(req.user._id, {
						$push: { schedules: schedule },
					}, function(err, user){
						if(err)
							console.error(err);

						const userMarks = {
							...user.testMarks,
							[schedule._id] : marks
						};
					//	const userCorrects={
					//		...user.totalCorrect,
					//		[schedule._id] :totalCorrect
					//	}

						user.testMarks = userMarks;
						//user.totalCorrect=userCorrects;
						console.log('Marks , user', userMarks, user.username);
						user.save();
					})
					

						Result.create({subjects}, function(err, result){

							if(err)
								console.error(err);

							result.user.id = req.user._id;
							result.user.username = req.user.username;
							result.group = req.user.group;
							result.section = req.user.section;
							result.schedule = schedule._id;
							result.marks = marks;
							result.totalCorrect = markCount;
							result.total = subTotal; 
							result.scheduleId = schedule._id;
							result.save();

							req.flash('success', 'Test successfully submitted!');

							if(schedule.hideResult){
								res.redirect('/student/dashboard');
							}else{
								res.render('student/result', {result : result, test : schedule.test, student : req.user.username});
							}

						})

					})
				}catch(err){
					console.error(err);
				}

			}

	})


})


module.exports = router;