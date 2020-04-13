const express = require('express');
const Json2csvParser=require('json2csv').Parser;

router = express.Router();
middleware = require('../middleware/index.js');

router.get('/list', middleware.isAnalytics, function (req, res) {
    let queryObj = {};

    if (!req.user.isAdmin) {
        queryObj = { 'scheduler.username': req.user.username };
    } 

    Schedule.find(queryObj).populate('test').exec(function (err, sch) {

        if(sch.length > 0){
            sch.forEach(function (schedule, idx) {
                let timeLeft = moment.duration(moment(schedule.time).add(parseInt(schedule.duration), 'minutes').diff(moment(new Date()))).asMinutes();

                if (timeLeft <= 0) {
                    schedule.expired = true;
                    schedule.updated = Date.now();
                    schedule.save();
                } else if (timeLeft > 0) {
                    if (timeLeft <= parseInt(schedule.duration)) {
                        schedule.started = true;
                    }
                    schedule.expired = false;
                    schedule.updated = Date.now();
                    schedule.save();
                }

                if (idx == sch.length - 1) {
                    res.render("report/list", {
                      schedules: sch.reverse()
                    });
                }
            })
        }else{
            res.render("report/list", {
              schedules: []
            });    
        }

    })
});


router.get('/detail/:id', middleware.isAnalytics, (req, res) => {
    Schedule.findById(req.params.id).populate('test').exec((err, schedule) => {
        let queryObj = {};
        queryObj[schedule.assignBy] =  schedule[schedule.assignBy];

        if (schedule[schedule.assignBy] == 'all'){
            queryObj = {
                department : schedule.department,
                batchFrom : schedule.batchFrom,
                batchTo : schedule.batchTo
            }
        }else if(schedule.assignBy == 'individual'){
            queryObj = {
                username : schedule.individual
            }
        }

        User.find(queryObj).populate('tests').exec((err, users) => {
            // console.log('marks', users[3].testMarks);
            res.render('report/user_list', { schedule, users })    
        })
    })
})

router.get('/result/:username/:schedule_id', middleware.isAnalytics, (req, res) => {
    Result.findOne({'user.username' : req.params.username, schedule : req.params.schedule_id}).populate({path : 'schedule', populate : { path : 'test' }}).exec(function(err, result){
        res.render('report/result', {result : result, username : req.params.username}); 
    })
})

router.get('/result/detail/:username/:schedule_id', middleware.isAnalytics, (req, res) => {
    Result.findOne({"user.username" : req.params.username, schedule : req.params.schedule_id}).populate({path : 'schedule', populate : { path : 'test' }}).exec(function(err, result){
        if(err)
            console.error(err)
        // console.log(req.params.schedule_id);
        if(!result){
            req.flash('error', 'Result not available!');
            res.redirect('back');
        }else
            res.render('student/result', { result: result, test: result.schedule.test, student: req.params.username});
    })
})

router.get('/graph/list', middleware.isAdmin, (req, res) => {
    res.redirect('/admin/users/list/?mode=graph');
})

router.get('/graph/:user_id', middleware.isAnalytics, (req, res) => {
    let populateObj = { path: 'schedule', match: { hideResult: false }};

    if(req.user.isAdmin){
        populateObj = { path: 'schedule' }
    }

    Result.find({ "user.id": req.params.user_id }).populate(populateObj).exec( async (err, results) => {
        if(err){
            res.send('error');
        }   

        const testMarks = await results.reduce((marksArr, result) => {
            if(result.schedule !== null)
                marksArr.push(result.marks);
            return marksArr;
        }, []);

        res.send(testMarks);
    })    
})

router.get("/graph/view/:user_id", middleware.isAnalytics, (req, res) => {
    res.render('report/graph', {userId : req.params.user_id})
});

module.exports = router;