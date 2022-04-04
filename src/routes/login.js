const { Router } = require('express');
const { type } = require('express/lib/response');
const user = require('../controllers/user');
const router = Router();

module.exports = () => {
    router.get('/login', (req, res) => {
        res.render('login', { page: 'login' });
      });

      router.post('/login', async (req, res, next) => {
        try {
          const errors = [];
        
          const findUser = await user.findByUsername(req.body.username);
          
          if(!findUser) {
              //push to erros to signal that there are errors
              errors.push("username");
              //its better security wise to not show wich one is wrong
              errors.push("password");
              req.session.messages.push({
                text: 'Invalid username or password!',
                type: 'danger',
              });
            } else if (findUser && !findUser.verified) {
                //push to erros to signal that there are errors
                errors.push("username");
                errors.push("password");
                req.session.messages.push({
                    text: 'Please verify your email address!',
                    type: 'danger'
                });
            } else {
                //user found
                const isValid = await findUser.comparePassword(req.body.password);
                if(!isValid) {
                    errors.push("username");
                    //its better security wise to not show wich one is wrong
                    errors.push("password");
                        req.session.messages.push({
                        text: 'Invalid username or password!',
                        type: 'danger',
                    });
                }
            }
         
          if (errors.length) {
              //show errors
            return res.render('login', {
              page: 'login',
              data: req.body,
              errors,
            });
          }

          req.session.userId = findUser.id;
          req.session.messages.push({
              text: 'You are logged in now!',
              type: 'success'
          });
          //remember me checkbox
          if(req.body.remember) {
            req.sessionOptions.maxAge = 24*60*60*1000*14; //14days
            //used for refreshing on each login
            req.session.rememberme = req.sessionOptions.maxAge; 
          } else {
            //in case there is a leftover in session or somewhere
            req.session.rememberme = null;
          }
          return res.redirect('/');
        } catch (err) {
            return next(err);
          }
        });

        router.get('/logout', (req, res) => {
            req.session.userId = null;
            req.session.rememberme = null;
            req.session.messages.push({
                text: 'You have logged out!',
                type: 'info'
            });
            return res.redirect('/');
        });
    return router;
}