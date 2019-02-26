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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUU7UUFDL0MsSUFBSSxFQUFFLENBQUM7S0FDUjtTQUFNO1FBQ0wsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDbkM7QUFDSCxDQUFDLENBQUMiLCJmaWxlIjoiY29uZmlnL3Bhc3Nwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGFzc3BvcnQgZnJvbSAncGFzc3BvcnQnO1xyXG5pbXBvcnQgKiBhcyByZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xyXG5pbXBvcnQgKiBhcyBwYXNzcG9ydExvY2FsIGZyb20gJ3Bhc3Nwb3J0LWxvY2FsJztcclxuaW1wb3J0ICogYXMgcGFzc3BvcnRGYWNlYm9vayBmcm9tICdwYXNzcG9ydC1mYWNlYm9vayc7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbi8vIGltcG9ydCB7IFVzZXIsIFVzZXJUeXBlIH0gZnJvbSAnLi4vbW9kZWxzL1VzZXInO1xyXG5pbXBvcnQgeyBkZWZhdWx0IGFzIFVzZXIgfSBmcm9tICcuLi9tb2RlbHMvVXNlcic7XHJcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcclxuXHJcbmNvbnN0IExvY2FsU3RyYXRlZ3kgPSBwYXNzcG9ydExvY2FsLlN0cmF0ZWd5O1xyXG5jb25zdCBGYWNlYm9va1N0cmF0ZWd5ID0gcGFzc3BvcnRGYWNlYm9vay5TdHJhdGVneTtcclxuXHJcbnBhc3Nwb3J0LnNlcmlhbGl6ZVVzZXI8YW55LCBhbnk+KCh1c2VyLCBkb25lKSA9PiB7XHJcbiAgZG9uZSh1bmRlZmluZWQsIHVzZXIuaWQpO1xyXG59KTtcclxuXHJcbnBhc3Nwb3J0LmRlc2VyaWFsaXplVXNlcigoaWQsIGRvbmUpID0+IHtcclxuICBVc2VyLmZpbmRCeUlkKGlkLCAoZXJyLCB1c2VyKSA9PiB7XHJcbiAgICBkb25lKGVyciwgdXNlcik7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBTaWduIGluIHVzaW5nIEVtYWlsIGFuZCBQYXNzd29yZC5cclxuICovXHJcbnBhc3Nwb3J0LnVzZShuZXcgTG9jYWxTdHJhdGVneSh7IHVzZXJuYW1lRmllbGQ6ICdlbWFpbCcgfSwgKGVtYWlsLCBwYXNzd29yZCwgZG9uZSkgPT4ge1xyXG4gIFVzZXIuZmluZE9uZSh7IGVtYWlsOiBlbWFpbC50b0xvd2VyQ2FzZSgpIH0sIChlcnIsIHVzZXI6IGFueSkgPT4ge1xyXG4gICAgaWYgKGVycikgeyByZXR1cm4gZG9uZShlcnIpOyB9XHJcbiAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgcmV0dXJuIGRvbmUodW5kZWZpbmVkLCBmYWxzZSwgeyBtZXNzYWdlOiBgRW1haWwgJHtlbWFpbH0gbm90IGZvdW5kLmAgfSk7XHJcbiAgICB9XHJcbiAgICB1c2VyLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZCwgKGVycjogRXJyb3IsIGlzTWF0Y2g6IGJvb2xlYW4pID0+IHtcclxuICAgICAgaWYgKGVycikgeyByZXR1cm4gZG9uZShlcnIpOyB9XHJcbiAgICAgIGlmIChpc01hdGNoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvbmUodW5kZWZpbmVkLCB1c2VyKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZG9uZSh1bmRlZmluZWQsIGZhbHNlLCB7IG1lc3NhZ2U6ICdJbnZhbGlkIGVtYWlsIG9yIHBhc3N3b3JkLicgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSkpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBPQXV0aCBTdHJhdGVneSBPdmVydmlld1xyXG4gKlxyXG4gKiAtIFVzZXIgaXMgYWxyZWFkeSBsb2dnZWQgaW4uXHJcbiAqICAgLSBDaGVjayBpZiB0aGVyZSBpcyBhbiBleGlzdGluZyBhY2NvdW50IHdpdGggYSBwcm92aWRlciBpZC5cclxuICogICAgIC0gSWYgdGhlcmUgaXMsIHJldHVybiBhbiBlcnJvciBtZXNzYWdlLiAoQWNjb3VudCBtZXJnaW5nIG5vdCBzdXBwb3J0ZWQpXHJcbiAqICAgICAtIEVsc2UgbGluayBuZXcgT0F1dGggYWNjb3VudCB3aXRoIGN1cnJlbnRseSBsb2dnZWQtaW4gdXNlci5cclxuICogLSBVc2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqICAgLSBDaGVjayBpZiBpdCdzIGEgcmV0dXJuaW5nIHVzZXIuXHJcbiAqICAgICAtIElmIHJldHVybmluZyB1c2VyLCBzaWduIGluIGFuZCB3ZSBhcmUgZG9uZS5cclxuICogICAgIC0gRWxzZSBjaGVjayBpZiB0aGVyZSBpcyBhbiBleGlzdGluZyBhY2NvdW50IHdpdGggdXNlcidzIGVtYWlsLlxyXG4gKiAgICAgICAtIElmIHRoZXJlIGlzLCByZXR1cm4gYW4gZXJyb3IgbWVzc2FnZS5cclxuICogICAgICAgLSBFbHNlIGNyZWF0ZSBhIG5ldyBhY2NvdW50LlxyXG4gKi9cclxuXHJcblxyXG4vKipcclxuICogU2lnbiBpbiB3aXRoIEZhY2Vib29rLlxyXG4gKi9cclxucGFzc3BvcnQudXNlKG5ldyBGYWNlYm9va1N0cmF0ZWd5KHtcclxuICBjbGllbnRJRDogcHJvY2Vzcy5lbnYuRkFDRUJPT0tfSUQsXHJcbiAgY2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5GQUNFQk9PS19TRUNSRVQsXHJcbiAgY2FsbGJhY2tVUkw6ICcvYXV0aC9mYWNlYm9vay9jYWxsYmFjaycsXHJcbiAgcHJvZmlsZUZpZWxkczogWyduYW1lJywgJ2VtYWlsJywgJ2xpbmsnLCAnbG9jYWxlJywgJ3RpbWV6b25lJ10sXHJcbiAgcGFzc1JlcVRvQ2FsbGJhY2s6IHRydWVcclxufSwgKHJlcTogYW55LCBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuLCBwcm9maWxlLCBkb25lKSA9PiB7XHJcbiAgaWYgKHJlcS51c2VyKSB7XHJcbiAgICBVc2VyLmZpbmRPbmUoeyBmYWNlYm9vazogcHJvZmlsZS5pZCB9LCAoZXJyLCBleGlzdGluZ1VzZXIpID0+IHtcclxuICAgICAgaWYgKGVycikgeyByZXR1cm4gZG9uZShlcnIpOyB9XHJcbiAgICAgIGlmIChleGlzdGluZ1VzZXIpIHtcclxuICAgICAgICByZXEuZmxhc2goJ2Vycm9ycycsIHsgbXNnOiAnVGhlcmUgaXMgYWxyZWFkeSBhIEZhY2Vib29rIGFjY291bnQgdGhhdCBiZWxvbmdzIHRvIHlvdS4gU2lnbiBpbiB3aXRoIHRoYXQgYWNjb3VudCBvciBkZWxldGUgaXQsIHRoZW4gbGluayBpdCB3aXRoIHlvdXIgY3VycmVudCBhY2NvdW50LicgfSk7XHJcbiAgICAgICAgZG9uZShlcnIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFVzZXIuZmluZEJ5SWQocmVxLnVzZXIuaWQsIChlcnIsIHVzZXI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgeyByZXR1cm4gZG9uZShlcnIpOyB9XHJcbiAgICAgICAgICB1c2VyLmZhY2Vib29rID0gcHJvZmlsZS5pZDtcclxuICAgICAgICAgIHVzZXIudG9rZW5zLnB1c2goeyBraW5kOiAnZmFjZWJvb2snLCBhY2Nlc3NUb2tlbiB9KTtcclxuICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lID0gdXNlci5wcm9maWxlLm5hbWUgfHwgYCR7cHJvZmlsZS5uYW1lLmdpdmVuTmFtZX0gJHtwcm9maWxlLm5hbWUuZmFtaWx5TmFtZX1gO1xyXG4gICAgICAgICAgdXNlci5wcm9maWxlLmdlbmRlciA9IHVzZXIucHJvZmlsZS5nZW5kZXIgfHwgcHJvZmlsZS5fanNvbi5nZW5kZXI7XHJcbiAgICAgICAgICB1c2VyLnByb2ZpbGUucGljdHVyZSA9IHVzZXIucHJvZmlsZS5waWN0dXJlIHx8IGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Byb2ZpbGUuaWR9L3BpY3R1cmU/dHlwZT1sYXJnZWA7XHJcbiAgICAgICAgICB1c2VyLnNhdmUoKGVycjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgcmVxLmZsYXNoKCdpbmZvJywgeyBtc2c6ICdGYWNlYm9vayBhY2NvdW50IGhhcyBiZWVuIGxpbmtlZC4nIH0pO1xyXG4gICAgICAgICAgICBkb25lKGVyciwgdXNlcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIFVzZXIuZmluZE9uZSh7IGZhY2Vib29rOiBwcm9maWxlLmlkIH0sIChlcnIsIGV4aXN0aW5nVXNlcikgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHJldHVybiBkb25lKGVycik7IH1cclxuICAgICAgaWYgKGV4aXN0aW5nVXNlcikge1xyXG4gICAgICAgIHJldHVybiBkb25lKHVuZGVmaW5lZCwgZXhpc3RpbmdVc2VyKTtcclxuICAgICAgfVxyXG4gICAgICBVc2VyLmZpbmRPbmUoeyBlbWFpbDogcHJvZmlsZS5fanNvbi5lbWFpbCB9LCAoZXJyLCBleGlzdGluZ0VtYWlsVXNlcikgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIGRvbmUoZXJyKTsgfVxyXG4gICAgICAgIGlmIChleGlzdGluZ0VtYWlsVXNlcikge1xyXG4gICAgICAgICAgcmVxLmZsYXNoKCdlcnJvcnMnLCB7IG1zZzogJ1RoZXJlIGlzIGFscmVhZHkgYW4gYWNjb3VudCB1c2luZyB0aGlzIGVtYWlsIGFkZHJlc3MuIFNpZ24gaW4gdG8gdGhhdCBhY2NvdW50IGFuZCBsaW5rIGl0IHdpdGggRmFjZWJvb2sgbWFudWFsbHkgZnJvbSBBY2NvdW50IFNldHRpbmdzLicgfSk7XHJcbiAgICAgICAgICBkb25lKGVycik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHVzZXI6IGFueSA9IG5ldyBVc2VyKCk7XHJcbiAgICAgICAgICB1c2VyLmVtYWlsID0gcHJvZmlsZS5fanNvbi5lbWFpbDtcclxuICAgICAgICAgIHVzZXIuZmFjZWJvb2sgPSBwcm9maWxlLmlkO1xyXG4gICAgICAgICAgdXNlci50b2tlbnMucHVzaCh7IGtpbmQ6ICdmYWNlYm9vaycsIGFjY2Vzc1Rva2VuIH0pO1xyXG4gICAgICAgICAgdXNlci5wcm9maWxlLm5hbWUgPSBgJHtwcm9maWxlLm5hbWUuZ2l2ZW5OYW1lfSAke3Byb2ZpbGUubmFtZS5mYW1pbHlOYW1lfWA7XHJcbiAgICAgICAgICB1c2VyLnByb2ZpbGUuZ2VuZGVyID0gcHJvZmlsZS5fanNvbi5nZW5kZXI7XHJcbiAgICAgICAgICB1c2VyLnByb2ZpbGUucGljdHVyZSA9IGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Byb2ZpbGUuaWR9L3BpY3R1cmU/dHlwZT1sYXJnZWA7XHJcbiAgICAgICAgICB1c2VyLnByb2ZpbGUubG9jYXRpb24gPSAocHJvZmlsZS5fanNvbi5sb2NhdGlvbikgPyBwcm9maWxlLl9qc29uLmxvY2F0aW9uLm5hbWUgOiAnJztcclxuICAgICAgICAgIHVzZXIuc2F2ZSgoZXJyOiBFcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBkb25lKGVyciwgdXNlcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KSk7XHJcblxyXG4vKipcclxuICogTG9naW4gUmVxdWlyZWQgbWlkZGxld2FyZS5cclxuICovXHJcbmV4cG9ydCBsZXQgaXNBdXRoZW50aWNhdGVkID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgaWYgKHJlcS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xyXG4gICAgcmV0dXJuIG5leHQoKTtcclxuICB9XHJcbiAgcmVzLnJlZGlyZWN0KCcvbG9naW4nKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBdXRob3JpemF0aW9uIFJlcXVpcmVkIG1pZGRsZXdhcmUuXHJcbiAqL1xyXG5leHBvcnQgbGV0IGlzQXV0aG9yaXplZCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gIGNvbnN0IHByb3ZpZGVyID0gcmVxLnBhdGguc3BsaXQoJy8nKS5zbGljZSgtMSlbMF07XHJcblxyXG4gIGlmIChfLmZpbmQocmVxLnVzZXIudG9rZW5zLCB7IGtpbmQ6IHByb3ZpZGVyIH0pKSB7XHJcbiAgICBuZXh0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJlcy5yZWRpcmVjdChgL2F1dGgvJHtwcm92aWRlcn1gKTtcclxuICB9XHJcbn07XHJcbiJdfQ==
