const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('cookie-session');
const indexRouter = require('./routes/index');
const user = require('./controllers/user');
//rate limit setup
const limiter = rateLimit({
    windowMS: 15*60*1000, //15min
    max: 100, //limit of no of req / IP
    delayMs: 0 //disables delays
});

module.exports = (config) => {
    const app = express();

    //views
    app.set("views", path.join(__dirname, "views"));
    //template engine
    app.set('view engine', 'ejs');

    // Initialize session management with cookie-session
    app.use(
      session({
        name: 'session',
        keys: [
          'a set',
          'of keys',
          'used',
          'to encrypt',
          'the session',
          'change in',
          'production',
        ],
        resave: false,
        saveUninitialized: true,
        sameSite: 'strict',
        maxAge: null,
      })
    );

    //parse requests
    app.use(express.urlencoded({extended: true}));
    app.use(express.json()) //For JSON requests
    app.use(cookieParser());

    //rate limit
    app.use(limiter);

    //helmet js
    app.use(helmet());
    
    app.use(express.static(path.join(__dirname, "public")));

    //make the logged user available 
    app.use(async (req, res, next) => {
      if(!req.session.userId) return next();
      const findUser = await user.findById(req.session.userId);
      if(!findUser) {
        req.session.userId = null;
        return next();
      }
      //refresh remember me ..or not
      req.sessionOptions.maxAge = req.session.rememberme || req.sessionOptions.maxAge;
      req.user = findUser;
      res.locals.user = findUser;
      return next();
    });

    //store messages in the session
    app.use(async (req, res, next) => {
    // Set up flash messaging
    if (!req.session.messages) {
      req.session.messages = [];
    }
    res.locals.messages = req.session.messages;
    return next();
    });

    app.use('/', indexRouter({ config }));
    
  return app;  
}
