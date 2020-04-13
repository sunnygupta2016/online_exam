const express 	  = require('express');
	  bodyParser  = require('body-parser');
	  app 		  		= express(),
	  ejs 		  		= require('ejs'),
	  session 	  		= require('express-session'),
	  methodOverride 	= require('method-override'),
	  mongoose    		= require('mongoose'),
	  nodemailer  		= require('nodemailer'),
	  passport    		= require('passport'),
	  passportLocal  	= require('passport-local'),
	  MongoStore      	= require('connect-mongo')(session),
	  flash           	= require('connect-flash'),	 
	  User 	  			= require('./models/user'),
	  Group 	  		= require('./models/groups'),
	  Department 	  	= require('./models/departments'),
	  Section 	  		= require('./models/sections'),
	  Subject 	  		= require('./models/subjects'),
	  Test 		  		= require('./models/test'),
	  Schedule 	  		= require('./models/schedule'),
	  Result 	  		= require('./models/results'),
	  seedAdmin 		= require('./config/seedAdmin');
	  device 			= require('express-device');
	  middleware 		= require('./middleware/index.js')


const indexRoutes = require('./routes/index');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const otherRoutes = require('./routes/others');
const testRoutes = require('./routes/tests');
const editRoutes = require('./routes/edit');
const reportRoutes = require('./routes/report');

mongoose.connect('mongodb+srv://Sunny:Sunny@cluster0-adfq1.mongodb.net/test?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true})
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("An error has occured", err));
//mongoose.connect("mongodb://localhost/MMUQuizAppExp", {useNewUrlParser: true});

seedAdmin();

//express session
app.use(session({
    secret : "Sessionals suck",
    name : "sessionId",
    store : new MongoStore({mongooseConnection : mongoose.connection}),
    resave : false,
    saveUninitialized : false    
}));


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(flash());
// app.use(helmet());

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Global variables
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.set(
		"Cache-Control",
		"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  	);

    next();
});

app.use(device.capture());
app.use(middleware.isMobile);


app.use("/", indexRoutes);
app.use("/login/", loginRoutes);
app.use("/register/", registerRoutes);
app.use("/admin/", adminRoutes);
app.use("/student/", studentRoutes);
app.use("/others/", otherRoutes);
app.use("/test/", testRoutes);
app.use("/edit/", editRoutes);
app.use("/report/", reportRoutes);



// app.use(function(req, res) {
//     res.status(400);
//     res.render('error', {code : "404 Not found"});
//   });

// app.use(function(err, req, res, next){
//     // console.error(err);
//     res.status(500);
//     res.render('error', {code : "500 Internal Server Error"});
// });


// app.listen(3001, '192.168.9.78', function(){
//     console.log("Server Deployed");
// });

app.listen(3001, function(){
    console.log("Server Deployed");
});



