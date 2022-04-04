const { Router } = require('express');
//pages
const registerRouter = require('./register');
const verificationRouter = require('./verification');
const passwordResetRouter = require('./resetpassword');
const expenseRouter = require('./expenses');
const loginRouter = require('./login');
//prevent CSRF
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true })

const router = Router();

module.exports = (params) => {
    router.get('/', csrfProtection, (req, res) => {
        res.render('index', { page: 'index' });
    });
    
    router.use(registerRouter(params));
    
    router.use(loginRouter(params));

    router.use(verificationRouter(params));

    router.use(passwordResetRouter(params));

    router.use(expenseRouter(params));
    return router;
};
 