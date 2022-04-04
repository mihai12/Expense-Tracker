const { Router } = require("express")
const user = require("../controllers/user");
const validation = require("../middlewares/validation");
const nodemailer = require('nodemailer');
const { findByUsername } = require("../controllers/user");
const router = Router();

module.exports = () => {

    //view registration form
    router.get("/register", (req, res) => {
        res.render("register", { page: "register" });
    });
    
    //process register
    router.post("/register",
    //validation middleware
    validation.validateUsername,
    validation.validateEmail,
    validation.validatePass,
    validation.validatePassMatch,
    async (req, res, next) => {
        try {
            const validationErrors = validation.validationResult(req);
            //validation errors go here
            const errors = [];
            //fields validation
            if (!validationErrors.isEmpty()) {
                if (!validationErrors.isEmpty()) {
                    validationErrors.errors.forEach((error) => {
                        errors.push(error.param);
                        req.session.messages.push({
                            text: error.msg,
                            type: 'danger',
                    });
                });
            } else {
                //check db for email&username unique
                const existingEmail = await user.findByEmail(req.body.email);
                const existingUsername = await user.findByUsername(req.body.username);
           
            if (existingEmail || existingUsername) {
                errors.push('email');
                errors.push('username');
                req.session.messages.push({
                  text: 'The email address or the username already exist!',
                  type: 'danger',
                });
              }
              }
            }
            if (errors.length) {
                // Render the page again and show the errors
                return res.render('register', {
                  page: 'register',
                  data: req.body,
                  errors,
                });
            }

            //create user
            await user.createUser(req.body.username, req.body.email, req.body.password);
            req.session.messages.push({text: 'Your account was created!', type: 'success',});
            //send verification email and show message
            /*
            const findUser = await user.findByEmail(req.body.email); 
            console.log(`req.params: ${req.body.email}`); 
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'mihai.popa.r@gmail.com',
                  pass: 'temporarpentruproiect'
                }
              });
              console.log(`findUser: ${findUser}`); 
            
            const mailOptions = {
                from: 'mihai.popa.r@gmail.com',
                to: findUser.email,
                subject: 'Activate Expanse Tracker account!',
                text: `Hello ${findUser.username}, <br /><br /> Click here to activate your account: http://localhost:3000/verify/${findUser.id/findUser.verificationToken}`
              };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              }); 
            */  
            return res.redirect('/login');
            
        } catch (err) {
            return next(err);
        }
    });
    return router;
};
