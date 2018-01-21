"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const express = require("express");
const compression = require("compression"); // compresses requests
const session = require("express-session");
const bodyParser = require("body-parser");
const logger = require("morgan");
const errorHandler = require("errorhandler");
const lusca = require("lusca");
const dotenv = require("dotenv");
const mongo = require("connect-mongo");
const flash = require("express-flash");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const socketio = require("socket.io");
const http = require("http");
const twilio = require("twilio");
const expressValidator = require("express-validator");
const MongoStore = mongo(session);
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: path.join(__dirname, '.env') });
/**
 * Controllers (route handlers).
 */
const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const contactController = require("./controllers/contact");
const voteController = require("./controllers/vote");
/**
 * API keys and Passport configuration.
 */
const passportConfig = require("./config/passport");
/**
 * Create Express server.
 */
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);
io.on('connection', (socket) => {
    console.log('a user connected');
});
/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
    console.log('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});
/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    else if (req.user &&
        req.path == '/account') {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
io.on('connection', (socket) => {
    console.log('a user connected');
});
/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/vote', voteController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
/**
 * Api routes.
 */
app.get('/api/vote', passportConfig.isAuthenticated, voteController.getVotes);
app.get('/api/vote/:voteId', voteController.getVote);
app.post('/api/vote/', voteController.saveVote);
app.delete('/api/vote/:voteId', passportConfig.isAuthenticated, voteController.deleteVote);
app.post('/api/vote/sms', twilio.webhook(), voteController.voteSMS);
/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());
/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});
module.exports = app;

//# sourceMappingURL=server.js.map