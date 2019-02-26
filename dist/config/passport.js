"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passportLocal = require("passport-local");
const passportFacebook = require("passport-facebook");
const _ = require("lodash");
// import { User, UserType } from '../models/User';
const User_1 = require("../models/User");
const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
passport.serializeUser((user, done) => {
    done(undefined, user.id);
});
passport.deserializeUser((id, done) => {
    User_1.default.findById(id, (err, user) => {
        done(err, user);
    });
});
/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User_1.default.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: 'Invalid email or password.' });
        });
    });
}));
/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */
/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
        User_1.default.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                done(err);
            }
            else {
                User_1.default.findById(req.user.id, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    user.facebook = profile.id;
                    user.tokens.push({ kind: 'facebook', accessToken });
                    user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.save((err) => {
                        req.flash('info', { msg: 'Facebook account has been linked.' });
                        done(err, user);
                    });
                });
            }
        });
    }
    else {
        User_1.default.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                return done(undefined, existingUser);
            }
            User_1.default.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
                if (err) {
                    return done(err);
                }
                if (existingEmailUser) {
                    req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
                    done(err);
                }
                else {
                    const user = new User_1.default();
                    user.email = profile._json.email;
                    user.facebook = profile.id;
                    user.tokens.push({ kind: 'facebook', accessToken });
                    user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                    user.save((err) => {
                        done(err, user);
                    });
                }
            });
        });
    }
}));
/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
    const provider = req.path.split('/').slice(-1)[0];
    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    }
    else {
        res.redirect(`/auth/${provider}`);
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUU7UUFDL0MsSUFBSSxFQUFFLENBQUM7S0FDUjtTQUFNO1FBQ0wsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDbkM7QUFDSCxDQUFDLENBQUMiLCJmaWxlIjoiY29uZmlnL3Bhc3Nwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGFzc3BvcnQgZnJvbSAncGFzc3BvcnQnO1xuaW1wb3J0ICogYXMgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCAqIGFzIHBhc3Nwb3J0TG9jYWwgZnJvbSAncGFzc3BvcnQtbG9jYWwnO1xuaW1wb3J0ICogYXMgcGFzc3BvcnRGYWNlYm9vayBmcm9tICdwYXNzcG9ydC1mYWNlYm9vayc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbi8vIGltcG9ydCB7IFVzZXIsIFVzZXJUeXBlIH0gZnJvbSAnLi4vbW9kZWxzL1VzZXInO1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBVc2VyIH0gZnJvbSAnLi4vbW9kZWxzL1VzZXInO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xuXG5jb25zdCBMb2NhbFN0cmF0ZWd5ID0gcGFzc3BvcnRMb2NhbC5TdHJhdGVneTtcbmNvbnN0IEZhY2Vib29rU3RyYXRlZ3kgPSBwYXNzcG9ydEZhY2Vib29rLlN0cmF0ZWd5O1xuXG5wYXNzcG9ydC5zZXJpYWxpemVVc2VyPGFueSwgYW55PigodXNlciwgZG9uZSkgPT4ge1xuICBkb25lKHVuZGVmaW5lZCwgdXNlci5pZCk7XG59KTtcblxucGFzc3BvcnQuZGVzZXJpYWxpemVVc2VyKChpZCwgZG9uZSkgPT4ge1xuICBVc2VyLmZpbmRCeUlkKGlkLCAoZXJyLCB1c2VyKSA9PiB7XG4gICAgZG9uZShlcnIsIHVzZXIpO1xuICB9KTtcbn0pO1xuXG5cbi8qKlxuICogU2lnbiBpbiB1c2luZyBFbWFpbCBhbmQgUGFzc3dvcmQuXG4gKi9cbnBhc3Nwb3J0LnVzZShuZXcgTG9jYWxTdHJhdGVneSh7IHVzZXJuYW1lRmllbGQ6ICdlbWFpbCcgfSwgKGVtYWlsLCBwYXNzd29yZCwgZG9uZSkgPT4ge1xuICBVc2VyLmZpbmRPbmUoeyBlbWFpbDogZW1haWwudG9Mb3dlckNhc2UoKSB9LCAoZXJyLCB1c2VyOiBhbnkpID0+IHtcbiAgICBpZiAoZXJyKSB7IHJldHVybiBkb25lKGVycik7IH1cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiBkb25lKHVuZGVmaW5lZCwgZmFsc2UsIHsgbWVzc2FnZTogYEVtYWlsICR7ZW1haWx9IG5vdCBmb3VuZC5gIH0pO1xuICAgIH1cbiAgICB1c2VyLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZCwgKGVycjogRXJyb3IsIGlzTWF0Y2g6IGJvb2xlYW4pID0+IHtcbiAgICAgIGlmIChlcnIpIHsgcmV0dXJuIGRvbmUoZXJyKTsgfVxuICAgICAgaWYgKGlzTWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUodW5kZWZpbmVkLCB1c2VyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkb25lKHVuZGVmaW5lZCwgZmFsc2UsIHsgbWVzc2FnZTogJ0ludmFsaWQgZW1haWwgb3IgcGFzc3dvcmQuJyB9KTtcbiAgICB9KTtcbiAgfSk7XG59KSk7XG5cblxuLyoqXG4gKiBPQXV0aCBTdHJhdGVneSBPdmVydmlld1xuICpcbiAqIC0gVXNlciBpcyBhbHJlYWR5IGxvZ2dlZCBpbi5cbiAqICAgLSBDaGVjayBpZiB0aGVyZSBpcyBhbiBleGlzdGluZyBhY2NvdW50IHdpdGggYSBwcm92aWRlciBpZC5cbiAqICAgICAtIElmIHRoZXJlIGlzLCByZXR1cm4gYW4gZXJyb3IgbWVzc2FnZS4gKEFjY291bnQgbWVyZ2luZyBub3Qgc3VwcG9ydGVkKVxuICogICAgIC0gRWxzZSBsaW5rIG5ldyBPQXV0aCBhY2NvdW50IHdpdGggY3VycmVudGx5IGxvZ2dlZC1pbiB1c2VyLlxuICogLSBVc2VyIGlzIG5vdCBsb2dnZWQgaW4uXG4gKiAgIC0gQ2hlY2sgaWYgaXQncyBhIHJldHVybmluZyB1c2VyLlxuICogICAgIC0gSWYgcmV0dXJuaW5nIHVzZXIsIHNpZ24gaW4gYW5kIHdlIGFyZSBkb25lLlxuICogICAgIC0gRWxzZSBjaGVjayBpZiB0aGVyZSBpcyBhbiBleGlzdGluZyBhY2NvdW50IHdpdGggdXNlcidzIGVtYWlsLlxuICogICAgICAgLSBJZiB0aGVyZSBpcywgcmV0dXJuIGFuIGVycm9yIG1lc3NhZ2UuXG4gKiAgICAgICAtIEVsc2UgY3JlYXRlIGEgbmV3IGFjY291bnQuXG4gKi9cblxuXG4vKipcbiAqIFNpZ24gaW4gd2l0aCBGYWNlYm9vay5cbiAqL1xucGFzc3BvcnQudXNlKG5ldyBGYWNlYm9va1N0cmF0ZWd5KHtcbiAgY2xpZW50SUQ6IHByb2Nlc3MuZW52LkZBQ0VCT09LX0lELFxuICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkZBQ0VCT09LX1NFQ1JFVCxcbiAgY2FsbGJhY2tVUkw6ICcvYXV0aC9mYWNlYm9vay9jYWxsYmFjaycsXG4gIHByb2ZpbGVGaWVsZHM6IFsnbmFtZScsICdlbWFpbCcsICdsaW5rJywgJ2xvY2FsZScsICd0aW1lem9uZSddLFxuICBwYXNzUmVxVG9DYWxsYmFjazogdHJ1ZVxufSwgKHJlcTogYW55LCBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuLCBwcm9maWxlLCBkb25lKSA9PiB7XG4gIGlmIChyZXEudXNlcikge1xuICAgIFVzZXIuZmluZE9uZSh7IGZhY2Vib29rOiBwcm9maWxlLmlkIH0sIChlcnIsIGV4aXN0aW5nVXNlcikgPT4ge1xuICAgICAgaWYgKGVycikgeyByZXR1cm4gZG9uZShlcnIpOyB9XG4gICAgICBpZiAoZXhpc3RpbmdVc2VyKSB7XG4gICAgICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgeyBtc2c6ICdUaGVyZSBpcyBhbHJlYWR5IGEgRmFjZWJvb2sgYWNjb3VudCB0aGF0IGJlbG9uZ3MgdG8geW91LiBTaWduIGluIHdpdGggdGhhdCBhY2NvdW50IG9yIGRlbGV0ZSBpdCwgdGhlbiBsaW5rIGl0IHdpdGggeW91ciBjdXJyZW50IGFjY291bnQuJyB9KTtcbiAgICAgICAgZG9uZShlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgVXNlci5maW5kQnlJZChyZXEudXNlci5pZCwgKGVyciwgdXNlcjogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGVycikgeyByZXR1cm4gZG9uZShlcnIpOyB9XG4gICAgICAgICAgdXNlci5mYWNlYm9vayA9IHByb2ZpbGUuaWQ7XG4gICAgICAgICAgdXNlci50b2tlbnMucHVzaCh7IGtpbmQ6ICdmYWNlYm9vaycsIGFjY2Vzc1Rva2VuIH0pO1xuICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lID0gdXNlci5wcm9maWxlLm5hbWUgfHwgYCR7cHJvZmlsZS5uYW1lLmdpdmVuTmFtZX0gJHtwcm9maWxlLm5hbWUuZmFtaWx5TmFtZX1gO1xuICAgICAgICAgIHVzZXIucHJvZmlsZS5nZW5kZXIgPSB1c2VyLnByb2ZpbGUuZ2VuZGVyIHx8IHByb2ZpbGUuX2pzb24uZ2VuZGVyO1xuICAgICAgICAgIHVzZXIucHJvZmlsZS5waWN0dXJlID0gdXNlci5wcm9maWxlLnBpY3R1cmUgfHwgYGh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cHJvZmlsZS5pZH0vcGljdHVyZT90eXBlPWxhcmdlYDtcbiAgICAgICAgICB1c2VyLnNhdmUoKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgIHJlcS5mbGFzaCgnaW5mbycsIHsgbXNnOiAnRmFjZWJvb2sgYWNjb3VudCBoYXMgYmVlbiBsaW5rZWQuJyB9KTtcbiAgICAgICAgICAgIGRvbmUoZXJyLCB1c2VyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgVXNlci5maW5kT25lKHsgZmFjZWJvb2s6IHByb2ZpbGUuaWQgfSwgKGVyciwgZXhpc3RpbmdVc2VyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7IHJldHVybiBkb25lKGVycik7IH1cbiAgICAgIGlmIChleGlzdGluZ1VzZXIpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUodW5kZWZpbmVkLCBleGlzdGluZ1VzZXIpO1xuICAgICAgfVxuICAgICAgVXNlci5maW5kT25lKHsgZW1haWw6IHByb2ZpbGUuX2pzb24uZW1haWwgfSwgKGVyciwgZXhpc3RpbmdFbWFpbFVzZXIpID0+IHtcbiAgICAgICAgaWYgKGVycikgeyByZXR1cm4gZG9uZShlcnIpOyB9XG4gICAgICAgIGlmIChleGlzdGluZ0VtYWlsVXNlcikge1xuICAgICAgICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgeyBtc2c6ICdUaGVyZSBpcyBhbHJlYWR5IGFuIGFjY291bnQgdXNpbmcgdGhpcyBlbWFpbCBhZGRyZXNzLiBTaWduIGluIHRvIHRoYXQgYWNjb3VudCBhbmQgbGluayBpdCB3aXRoIEZhY2Vib29rIG1hbnVhbGx5IGZyb20gQWNjb3VudCBTZXR0aW5ncy4nIH0pO1xuICAgICAgICAgIGRvbmUoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB1c2VyOiBhbnkgPSBuZXcgVXNlcigpO1xuICAgICAgICAgIHVzZXIuZW1haWwgPSBwcm9maWxlLl9qc29uLmVtYWlsO1xuICAgICAgICAgIHVzZXIuZmFjZWJvb2sgPSBwcm9maWxlLmlkO1xuICAgICAgICAgIHVzZXIudG9rZW5zLnB1c2goeyBraW5kOiAnZmFjZWJvb2snLCBhY2Nlc3NUb2tlbiB9KTtcbiAgICAgICAgICB1c2VyLnByb2ZpbGUubmFtZSA9IGAke3Byb2ZpbGUubmFtZS5naXZlbk5hbWV9ICR7cHJvZmlsZS5uYW1lLmZhbWlseU5hbWV9YDtcbiAgICAgICAgICB1c2VyLnByb2ZpbGUuZ2VuZGVyID0gcHJvZmlsZS5fanNvbi5nZW5kZXI7XG4gICAgICAgICAgdXNlci5wcm9maWxlLnBpY3R1cmUgPSBgaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtwcm9maWxlLmlkfS9waWN0dXJlP3R5cGU9bGFyZ2VgO1xuICAgICAgICAgIHVzZXIucHJvZmlsZS5sb2NhdGlvbiA9IChwcm9maWxlLl9qc29uLmxvY2F0aW9uKSA/IHByb2ZpbGUuX2pzb24ubG9jYXRpb24ubmFtZSA6ICcnO1xuICAgICAgICAgIHVzZXIuc2F2ZSgoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgZG9uZShlcnIsIHVzZXIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSkpO1xuXG4vKipcbiAqIExvZ2luIFJlcXVpcmVkIG1pZGRsZXdhcmUuXG4gKi9cbmV4cG9ydCBsZXQgaXNBdXRoZW50aWNhdGVkID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gIGlmIChyZXEuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIHJlcy5yZWRpcmVjdCgnL2xvZ2luJyk7XG59O1xuXG4vKipcbiAqIEF1dGhvcml6YXRpb24gUmVxdWlyZWQgbWlkZGxld2FyZS5cbiAqL1xuZXhwb3J0IGxldCBpc0F1dGhvcml6ZWQgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgY29uc3QgcHJvdmlkZXIgPSByZXEucGF0aC5zcGxpdCgnLycpLnNsaWNlKC0xKVswXTtcblxuICBpZiAoXy5maW5kKHJlcS51c2VyLnRva2VucywgeyBraW5kOiBwcm92aWRlciB9KSkge1xuICAgIG5leHQoKTtcbiAgfSBlbHNlIHtcbiAgICByZXMucmVkaXJlY3QoYC9hdXRoLyR7cHJvdmlkZXJ9YCk7XG4gIH1cbn07XG4iXX0=
