const express = require('express');
	  router = express.Router();
	  User = require('../models/user');
	  Group = require('../models/groups');
	  middleware = require('../middleware/index');
	  multer = require("multer");
	  upload = multer({ storage: multer.memoryStorage(), limits: {fileSize: 1000 * 1000 * 15} });

let rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};


router.post('/user', middleware.isAdmin, function(req, res){
	let token = rand() + rand();
	
	let newUser = {};
	
	
	let department = req.body.department;
	if(req.body.department == 'null'){
		department = req.body.departmentNew;
	}
	
	let group = req.body.userGroupOption;
	if(req.body.userGroupOption == 'null'){
		group = req.body.userGroupNew;
		group = department +  group + req.body.batchFrom.slice(2,4) + req.body.batchTo.slice(2,4);
	}

	const section = group.slice(0, group.indexOf(req.body.batchFrom.slice(2, 4)) - 1) + group.slice(group.indexOf(req.body.batchFrom.slice(2, 4)));

	let roles = {};
	//console.log(req.body.role);

	if (typeof(req.body.role) == 'string') {
		roles[req.body.role] = true;
	} else {
		req.body.role.forEach(function (role) {
			roles[role] = true;
		})
	}

	let isAdmin = false;
	
	if(roles.hasOwnProperty('admin'))
		isAdmin = true;

	newUser = new User({
		username : req.body.username,
		email : req.body.email,
		userType : req.body.userType,
		department,
		roles : roles,
		isAdmin : isAdmin,
		status : req.body.status
	})

	if(req.body.userType == 'Student'){
		newUser.batchFrom = req.body.batchFrom;
		newUser.batchTo = req.body.batchTo;
		newUser.group = group;
		newUser.section = section;
	}

	User.find({"email" : newUser.email}, function(err, emailFound){
		if(err){
			req.flash('error', "Something went wrong! Try again");
			res.redirect('back');
		}

		if(emailFound.length > 0){
			req.flash('error', "A user with that email already exists");
            res.redirect('back');
		}else{

			User.register(newUser, req.body.password, function(err, user){
				if(err){
					req.flash('error', err.message);
                    res.redirect('/register/user');
				}else{

					Group.find({'name' : group}, function(err, groupFound){
						if(err){
							req.flash('error', "Something went wrong! Try again");
							res.redirect('back');
						}	

						if(!groupFound.length > 0){
							Group.create({name : group}, function(err, newGroup){
								if(err)
									console.error(err);

								newGroup.users.push(user);
								newGroup.save();
							})
						}else{
							groupFound[0].users.push(user);
							groupFound[0].save();
						}
					})

					Section.find({'name' : section}, function(err, sectionFound){
						if(err){
							req.flash('error', "Something went wrong! Try again");
							res.redirect('back');
						}	

						if(!sectionFound.length > 0){
							Section.create({name : section}, function(err, newsection){
								if(err)
									console.error(err);

								newsection.users.push(user);
								newsection.save();
							})
						}else{
							sectionFound[0].users.push(user);
							sectionFound[0].save();
						}
					})

					Department.find({'name' : department}, function(err, departmentFound){
						if(err){
							req.flash('error', "Something went wrong! Try again");
							res.redirect('back');
						}	

						if(!departmentFound.length > 0){
							Department.create({name : department}, function(err, newdepartment){
								if(err)
									console.error(err);

								newdepartment.users.push(user);
								newdepartment.save();
							})
						}else{
							departmentFound[0].users.push(user);
							departmentFound[0].save();
						}
					})
					

					req.flash("success", "Added new user");
                    res.redirect('back');
				}
			})

		}
	})
})

const addUserXLS = (users, group, section, department, roles, isAdmin, status, userType, batchFrom, batchTo) => {
	return new Promise((resolve, reject) => {
		let usersProcessed = 0;
		let errors = [];
		let processedUserObjects = [];

		Department.find({ 'name': department }, function (err, departmentFound) {
			if (err) {
				req.flash('error', "Something went wrong! Try again");
				res.redirect('back');
			}

			if (!departmentFound.length > 0) {
				Department.create({ name: department }, function (err, newdepartment) {
					if (err)
						console.error(err);

					// newdepartment.users.push(user);
					// newdepartment.save();
				})
			} else {
				// departmentFound[0].users.push(user);
				// departmentFound[0].save();
			}
		})

		Section.find({ 'name': section }, function (err, sectionFound) {
			if (err) {
				req.flash('error', "Something went wrong! Try again");
				res.redirect('back');
			}

			if (!sectionFound.length > 0) {
				Section.create({ name: section }, function (err, newsection) {
					if (err)
						console.error(err);

					// newsection.users.push(user);
					// newsection.save();
				})
			} else {
				// sectionFound[0].users.push(user);
				// sectionFound[0].save();
			}
		})

		users.forEach(function(user, idx){
			let token = rand() + rand();

			let newUser = new User({
				username : user['Username'].toString(),
				email : user['Email'],
				status : status,
				userType : userType,
				department,
				roles : roles,
				isAdmin : isAdmin,
			})

			if(userType == 'Student'){
				newUser.batchFrom = batchFrom;
				newUser.batchTo = batchTo;
				newUser.group = group;
				newUser.section = section;
			}

			User.find({"email" : newUser.email}, function(err, emailFound){
				if(err){
					errors.push({ username: newUser.username, error : ' ' });
					// console.log('User already exists', err);
					usersProcessed++;
					// console.log('Error ', usersProcessed)
					if(usersProcessed == users.length){
						// console.log('equal')
						resolve(errors);
					}
					else{
						// console.log('returning')
						return;
					}
				}

				if(emailFound.length > 0){
					errors.push({ username: newUser.username, error : 'Email Already Exists!' });
					usersProcessed++;
					// console.log('Error ', usersProcessed)
					if(usersProcessed == users.length){
						// console.log('equal')
						resolve(errors);
					}
					else{
						// console.log('return')
						return;
					}
				}else{

					User.register(newUser, user['Password'].toString(), function(err, user){
						if(err){
							errors.push({ username: newUser.username, error : err })
							// console.log('Error', err);	
							usersProcessed++;
							// console.log('Error', usersProcessed)
							if(usersProcessed == users.length){
								// console.log('equal')
								resolve(errors);
							}
							else
								return;
						}else{
							processedUserObjects.push(user);
							usersProcessed++;
							// console.log(processedUserObjects);

							if(idx === users.length - 1){							
								Group.find({'name' : newUser.group}, function(err, groupFound){
									if(err){
										errors.push({ username: newUser.username, error : 'Group Could Not Be Created!' })
										console.log('Error', err);
										usersProcessed++;
										console.log('Error ', usersProcessed)
										if(usersProcessed == users.length){
											// console.log('equal')
											resolve(errors);
										}
										else
											return;
									}	

									if(!groupFound.length > 0){
										console.log('creating group ', newUser.group);
										Group.create({name : newUser.group, users : processedUserObjects}, function(err, newGroup){
											if(err){
												errors.push({ username: newUser.username, error : 'Group Could Not Be Created!' });
												console.log(err);
												// usersProcessed++;
												console.log('Error ', usersProcessed)
												if(usersProcessed == users.length){
													// console.log('equal')
													resolve(errors);
												}
												else
													return;
											}

											
											// newGroup.save();
											console.log('success ', usersProcessed, ' ', users.length)
											// if(usersProcessed == (users.length - errors.length)){
											// 	// console.log('equal')
												resolve(errors);
											// }else
											// 	return;
											})
									}else{
										let newUsers = groupFound[0].users.concat(processedUserObjects);

										groupFound[0].users = newUsers;
										groupFound[0].save();
										console.log('success ', usersProcessed, ' ', users.length)
										// if(usersProcessed == users.length){
											// console.log('equal')
											resolve(errors);
										// }else
										// 	return;
									}
								})
							}
						}
					})

				}
			})
		})
	
	})
}

const xlsx = require('xlsx');
router.post('/user/xls/', middleware.isAdmin, upload.single('file'), (req, res) => {
	const uploadedFile = req.file;

	const userSheet = xlsx.read(uploadedFile.buffer);

	const users = xlsx.utils.sheet_to_json(userSheet.Sheets[userSheet.SheetNames[0]]);

	let department = req.body.department;
	if (req.body.department == 'null') {
		department = req.body.departmentNew;
	}

	let group = req.body.userGroupOption;
	if (req.body.userGroupOption == 'null') {
		group = req.body.userGroupNew;
		group = department + group + req.body.batchFrom.slice(2, 4) + req.body.batchTo.slice(2, 4);
	}

	const section =
    group.slice(0, group.indexOf(req.body.batchFrom.slice(2, 4)) - 1) +
    group.slice(group.indexOf(req.body.batchFrom.slice(2, 4)));

	let batchFrom = '';
	let batchTo = '';

	if(req.body.userType == 'Student'){
		batchFrom = req.body.batchFrom;
		batchTo = req.body.batchTo;
	}


	let roles = {};
	//console.log(req.body.role);

	if(typeof(req.body.role) == 'string'){
		roles[req.body.role] = true;
	}else{
		req.body.role.forEach(function(role){
			roles[role] = true;
		})
	}


	let isAdmin = false;

	if(roles.hasOwnProperty('admin'))
		isAdmin = true;

	addUserXLS(users, group, section, department, roles, isAdmin, 'active', req.body.userType, batchFrom, batchTo)
	.then((errors) => {
		console.log('Final error length ', errors.length);
		
		if(errors.length > 0){
			let errMsg = 'Could not add the following : ';

			errors.forEach((err) => {
				console.log(`Could not add ${err.username}. ${err.error}`);
				errMsg += `
				${err.username}. ${err.error}
				`
			})	

			req.flash('error', errMsg);
			res.redirect('back');
		}else{
			req.flash('success', 'Successfully added new users!');
			res.redirect('back');
		}
	})
	
})



module.exports = router;