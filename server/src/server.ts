/**
 * Module dependencies.
 */
import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as mongo from 'connect-mongo';
import * as flash from 'express-flash';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as socketio from 'socket.io';
import * as http from 'http';
import * as twilio from 'twilio';
import twilioConfig from './config/twilio';

import expressValidator = require('express-validator');
require('./common/ArrayExtensions');
require('./common/StringExtensions');


const MongoStore = mongo(session);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: path.join(__dirname, '.env') });


/**
 * Controllers (route handlers).
 */
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as contactController from './controllers/contact';
import * as eventController from './controllers/event';
import * as registrationController from './controllers/register';
import * as resultsController from './controllers/results';

/**
 * API keys and Passport configuration.
 */
import * as passportConfig from './config/passport';

/**
 * Create Express server.
 */
const app = express();

const httpServer = http.createServer(app);
const io = socketio(httpServer);

io.on('connection', (socket: SocketIO.Socket) => {
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

(<any>mongoose.Promise) = global.Promise;



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
    } else if (req.user &&
        req.path == '/account') {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { lastModified: true }));

io.on('connection', (socket) => {
    console.log('a user connected');
});

/**
 * Boilerplate app routes.
 */
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
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/event/:eventId/results', passportConfig.isAuthenticated, resultsController.index);
app.get('/event/:eventId/register', passportConfig.isAuthenticated, registrationController.index);
app.get('/event/:eventId/announce', passportConfig.isAuthenticated, eventController.getAnnounce);
app.post('/event/:eventId/announce', passportConfig.isAuthenticated, eventController.announce);

/**
 * Api routes.
 */
app.get('/api/events', passportConfig.isAuthenticated, eventController.getEvents);
app.get('/api/event/:eventId', passportConfig.isAuthenticated, eventController.getEvent);
app.post('/api/event/', passportConfig.isAuthenticated, eventController.saveEvent);
app.delete('/api/event/:eventId', passportConfig.isAuthenticated, eventController.archiveEvent);
app.post('/api/event/:eventId/incrementround', passportConfig.isAuthenticated, eventController.incrementRound);
app.post('/api/vote/sms', eventController.voteSMS);
app.get('/api/event/:eventId/registrations', passportConfig.isAuthenticated, registrationController.getRegistrations);
app.put('/api/event/:eventId/register', passportConfig.isAuthenticated, registrationController.registerVoter);



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