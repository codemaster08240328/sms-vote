"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const passport = require("passport");
const User_1 = require("../models/User");
const request = require('express-validator');
/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/login', {
        title: 'Login'
    });
};
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login');
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Success! You are logged in.' });
            res.redirect(req.session.returnTo || '/');
        });
    })(req, res, next);
};
/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};
/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/signup', {
        title: 'Create Account'
    });
};
/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len({ min: 4 });
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }
    const user = new User_1.default({
        email: req.body.email,
        password: req.body.password
    });
    User_1.default.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('/signup');
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
};
/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
    res.render('account/profile', {
        title: 'Account Management'
    });
};
/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.gender = req.body.gender || '';
        user.profile.location = req.body.location || '';
        user.profile.website = req.body.website || '';
        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                    return res.redirect('/account');
                }
                return next(err);
            }
            req.flash('success', { msg: 'Profile information has been updated.' });
            res.redirect('/account');
        });
    });
};
/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
    req.assert('password', 'Password must be at least 4 characters long').len({ min: 4 });
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Password has been changed.' });
            res.redirect('/account');
        });
    });
};
/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
    User_1.default.remove({ _id: req.user.id }, (err) => {
        if (err) {
            return next(err);
        }
        req.logout();
        req.flash('info', { msg: 'Your account has been deleted.' });
        res.redirect('/');
    });
};
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
    const provider = req.params.provider;
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token) => token.kind !== provider);
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash('info', { msg: `${provider} account has been unlinked.` });
            res.redirect('/account');
        });
    });
};
/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User_1.default
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('/forgot');
        }
        res.render('account/reset', {
            title: 'Password Reset'
        });
    });
};
/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
    req.assert('password', 'Password must be at least 4 characters long.').len({ min: 4 });
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
    }
    async.waterfall([
        function resetPassword(done) {
            User_1.default
                .findOne({ passwordResetToken: req.params.token })
                .where('passwordResetExpires').gt(Date.now())
                .exec((err, user) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                    return res.redirect('back');
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    req.logIn(user, (err) => {
                        done(err, user);
                    });
                });
            });
        },
        function sendResetPasswordEmail(user, done) {
            const transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'express-ts@starter.com',
                subject: 'Your password has been changed',
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash('success', { msg: 'Success! Your password has been changed.' });
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};
/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('account/forgot', {
        title: 'Forgot Password'
    });
};
/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
    }
    async.waterfall([
        function createRandomToken(done) {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function setRandomToken(token, done) {
            User_1.default.findOne({ email: req.body.email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    req.flash('errors', { msg: 'Account with that email address does not exist.' });
                    return res.redirect('/forgot');
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token, user, done) {
            const transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'hackathon@starter.com',
                subject: 'Reset your password on Hackathon Starter',
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/forgot');
    });
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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RUFBRTtRQUNULElBQUksR0FBRyxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtRQUM5QixHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbnRyb2xsZXJzL3VzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhc3luYyBmcm9tICdhc3luYyc7XHJcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xyXG5pbXBvcnQgKiBhcyBub2RlbWFpbGVyIGZyb20gJ25vZGVtYWlsZXInO1xyXG5pbXBvcnQgKiBhcyBwYXNzcG9ydCBmcm9tICdwYXNzcG9ydCc7XHJcbmltcG9ydCB7IGRlZmF1bHQgYXMgVXNlciwgVXNlck1vZGVsLCBBdXRoVG9rZW4gfSBmcm9tICcuLi9tb2RlbHMvVXNlcic7XHJcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHsgTG9jYWxTdHJhdGVneUluZm8gfSBmcm9tICdwYXNzcG9ydC1sb2NhbCc7XHJcbmltcG9ydCB7IFdyaXRlRXJyb3IgfSBmcm9tICdtb25nb2RiJztcclxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ2V4cHJlc3MtdmFsaWRhdG9yJyk7XHJcblxyXG5cclxuLyoqXHJcbiAqIEdFVCAvbG9naW5cclxuICogTG9naW4gcGFnZS5cclxuICovXHJcbmV4cG9ydCBsZXQgZ2V0TG9naW4gPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgaWYgKHJlcS51c2VyKSB7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvJyk7XHJcbiAgfVxyXG4gIHJlcy5yZW5kZXIoJ2FjY291bnQvbG9naW4nLCB7XHJcbiAgICB0aXRsZTogJ0xvZ2luJ1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBPU1QgL2xvZ2luXHJcbiAqIFNpZ24gaW4gdXNpbmcgZW1haWwgYW5kIHBhc3N3b3JkLlxyXG4gKi9cclxuZXhwb3J0IGxldCBwb3N0TG9naW4gPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICByZXEuYXNzZXJ0KCdlbWFpbCcsICdFbWFpbCBpcyBub3QgdmFsaWQnKS5pc0VtYWlsKCk7XHJcbiAgcmVxLmFzc2VydCgncGFzc3dvcmQnLCAnUGFzc3dvcmQgY2Fubm90IGJlIGJsYW5rJykubm90RW1wdHkoKTtcclxuICByZXEuc2FuaXRpemUoJ2VtYWlsJykubm9ybWFsaXplRW1haWwoeyBnbWFpbF9yZW1vdmVfZG90czogZmFsc2UgfSk7XHJcblxyXG4gIGNvbnN0IGVycm9ycyA9IHJlcS52YWxpZGF0aW9uRXJyb3JzKCk7XHJcblxyXG4gIGlmIChlcnJvcnMpIHtcclxuICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgZXJyb3JzKTtcclxuICAgIHJldHVybiByZXMucmVkaXJlY3QoJy9sb2dpbicpO1xyXG4gIH1cclxuXHJcbiAgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdsb2NhbCcsIChlcnI6IEVycm9yLCB1c2VyOiBVc2VyTW9kZWwsIGluZm86IExvY2FsU3RyYXRlZ3lJbmZvKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgIGlmICghdXNlcikge1xyXG4gICAgICByZXEuZmxhc2goJ2Vycm9ycycsIGluZm8ubWVzc2FnZSk7XHJcbiAgICAgIHJldHVybiByZXMucmVkaXJlY3QoJy9sb2dpbicpO1xyXG4gICAgfVxyXG4gICAgcmVxLmxvZ0luKHVzZXIsIChlcnIpID0+IHtcclxuICAgICAgaWYgKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XHJcbiAgICAgIHJlcS5mbGFzaCgnc3VjY2VzcycsIHsgbXNnOiAnU3VjY2VzcyEgWW91IGFyZSBsb2dnZWQgaW4uJyB9KTtcclxuICAgICAgcmVzLnJlZGlyZWN0KHJlcS5zZXNzaW9uLnJldHVyblRvIHx8ICcvJyk7XHJcbiAgICB9KTtcclxuICB9KShyZXEsIHJlcywgbmV4dCk7XHJcbn07XHJcblxyXG4vKipcclxuICogR0VUIC9sb2dvdXRcclxuICogTG9nIG91dC5cclxuICovXHJcbmV4cG9ydCBsZXQgbG9nb3V0ID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gIHJlcS5sb2dvdXQoKTtcclxuICByZXMucmVkaXJlY3QoJy8nKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHRVQgL3NpZ251cFxyXG4gKiBTaWdudXAgcGFnZS5cclxuICovXHJcbmV4cG9ydCBsZXQgZ2V0U2lnbnVwID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gIGlmIChyZXEudXNlcikge1xyXG4gICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnLycpO1xyXG4gIH1cclxuICByZXMucmVuZGVyKCdhY2NvdW50L3NpZ251cCcsIHtcclxuICAgIHRpdGxlOiAnQ3JlYXRlIEFjY291bnQnXHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUE9TVCAvc2lnbnVwXHJcbiAqIENyZWF0ZSBhIG5ldyBsb2NhbCBhY2NvdW50LlxyXG4gKi9cclxuZXhwb3J0IGxldCBwb3N0U2lnbnVwID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgcmVxLmFzc2VydCgnZW1haWwnLCAnRW1haWwgaXMgbm90IHZhbGlkJykuaXNFbWFpbCgpO1xyXG4gIHJlcS5hc3NlcnQoJ3Bhc3N3b3JkJywgJ1Bhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgNCBjaGFyYWN0ZXJzIGxvbmcnKS5sZW4oeyBtaW46IDQgfSk7XHJcbiAgcmVxLmFzc2VydCgnY29uZmlybVBhc3N3b3JkJywgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKS5lcXVhbHMocmVxLmJvZHkucGFzc3dvcmQpO1xyXG4gIHJlcS5zYW5pdGl6ZSgnZW1haWwnKS5ub3JtYWxpemVFbWFpbCh7IGdtYWlsX3JlbW92ZV9kb3RzOiBmYWxzZSB9KTtcclxuXHJcbiAgY29uc3QgZXJyb3JzID0gcmVxLnZhbGlkYXRpb25FcnJvcnMoKTtcclxuXHJcbiAgaWYgKGVycm9ycykge1xyXG4gICAgcmVxLmZsYXNoKCdlcnJvcnMnLCBlcnJvcnMpO1xyXG4gICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnL3NpZ251cCcpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHtcclxuICAgIGVtYWlsOiByZXEuYm9keS5lbWFpbCxcclxuICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZFxyXG4gIH0pO1xyXG5cclxuICBVc2VyLmZpbmRPbmUoeyBlbWFpbDogcmVxLmJvZHkuZW1haWwgfSwgKGVyciwgZXhpc3RpbmdVc2VyKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgIGlmIChleGlzdGluZ1VzZXIpIHtcclxuICAgICAgcmVxLmZsYXNoKCdlcnJvcnMnLCB7IG1zZzogJ0FjY291bnQgd2l0aCB0aGF0IGVtYWlsIGFkZHJlc3MgYWxyZWFkeSBleGlzdHMuJyB9KTtcclxuICAgICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnL3NpZ251cCcpO1xyXG4gICAgfVxyXG4gICAgdXNlci5zYXZlKChlcnIpID0+IHtcclxuICAgICAgaWYgKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XHJcbiAgICAgIHJlcS5sb2dJbih1c2VyLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLnJlZGlyZWN0KCcvJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogR0VUIC9hY2NvdW50XHJcbiAqIFByb2ZpbGUgcGFnZS5cclxuICovXHJcbmV4cG9ydCBsZXQgZ2V0QWNjb3VudCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICByZXMucmVuZGVyKCdhY2NvdW50L3Byb2ZpbGUnLCB7XHJcbiAgICB0aXRsZTogJ0FjY291bnQgTWFuYWdlbWVudCdcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQT1NUIC9hY2NvdW50L3Byb2ZpbGVcclxuICogVXBkYXRlIHByb2ZpbGUgaW5mb3JtYXRpb24uXHJcbiAqL1xyXG5leHBvcnQgbGV0IHBvc3RVcGRhdGVQcm9maWxlID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgcmVxLmFzc2VydCgnZW1haWwnLCAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nKS5pc0VtYWlsKCk7XHJcbiAgcmVxLnNhbml0aXplKCdlbWFpbCcpLm5vcm1hbGl6ZUVtYWlsKHsgZ21haWxfcmVtb3ZlX2RvdHM6IGZhbHNlIH0pO1xyXG5cclxuICBjb25zdCBlcnJvcnMgPSByZXEudmFsaWRhdGlvbkVycm9ycygpO1xyXG5cclxuICBpZiAoZXJyb3JzKSB7XHJcbiAgICByZXEuZmxhc2goJ2Vycm9ycycsIGVycm9ycyk7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvYWNjb3VudCcpO1xyXG4gIH1cclxuXHJcbiAgVXNlci5maW5kQnlJZChyZXEudXNlci5pZCwgKGVyciwgdXNlcjogVXNlck1vZGVsKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgIHVzZXIuZW1haWwgPSByZXEuYm9keS5lbWFpbCB8fCAnJztcclxuICAgIHVzZXIucHJvZmlsZS5uYW1lID0gcmVxLmJvZHkubmFtZSB8fCAnJztcclxuICAgIHVzZXIucHJvZmlsZS5nZW5kZXIgPSByZXEuYm9keS5nZW5kZXIgfHwgJyc7XHJcbiAgICB1c2VyLnByb2ZpbGUubG9jYXRpb24gPSByZXEuYm9keS5sb2NhdGlvbiB8fCAnJztcclxuICAgIHVzZXIucHJvZmlsZS53ZWJzaXRlID0gcmVxLmJvZHkud2Vic2l0ZSB8fCAnJztcclxuICAgIHVzZXIuc2F2ZSgoZXJyOiBXcml0ZUVycm9yKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDExMDAwKSB7XHJcbiAgICAgICAgICByZXEuZmxhc2goJ2Vycm9ycycsIHsgbXNnOiAnVGhlIGVtYWlsIGFkZHJlc3MgeW91IGhhdmUgZW50ZXJlZCBpcyBhbHJlYWR5IGFzc29jaWF0ZWQgd2l0aCBhbiBhY2NvdW50LicgfSk7XHJcbiAgICAgICAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvYWNjb3VudCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV4dChlcnIpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcS5mbGFzaCgnc3VjY2VzcycsIHsgbXNnOiAnUHJvZmlsZSBpbmZvcm1hdGlvbiBoYXMgYmVlbiB1cGRhdGVkLicgfSk7XHJcbiAgICAgIHJlcy5yZWRpcmVjdCgnL2FjY291bnQnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBPU1QgL2FjY291bnQvcGFzc3dvcmRcclxuICogVXBkYXRlIGN1cnJlbnQgcGFzc3dvcmQuXHJcbiAqL1xyXG5leHBvcnQgbGV0IHBvc3RVcGRhdGVQYXNzd29yZCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gIHJlcS5hc3NlcnQoJ3Bhc3N3b3JkJywgJ1Bhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgNCBjaGFyYWN0ZXJzIGxvbmcnKS5sZW4oeyBtaW46IDQgfSk7XHJcbiAgcmVxLmFzc2VydCgnY29uZmlybVBhc3N3b3JkJywgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKS5lcXVhbHMocmVxLmJvZHkucGFzc3dvcmQpO1xyXG5cclxuICBjb25zdCBlcnJvcnMgPSByZXEudmFsaWRhdGlvbkVycm9ycygpO1xyXG5cclxuICBpZiAoZXJyb3JzKSB7XHJcbiAgICByZXEuZmxhc2goJ2Vycm9ycycsIGVycm9ycyk7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvYWNjb3VudCcpO1xyXG4gIH1cclxuXHJcbiAgVXNlci5maW5kQnlJZChyZXEudXNlci5pZCwgKGVyciwgdXNlcjogVXNlck1vZGVsKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgIHVzZXIucGFzc3dvcmQgPSByZXEuYm9keS5wYXNzd29yZDtcclxuICAgIHVzZXIuc2F2ZSgoZXJyOiBXcml0ZUVycm9yKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgICByZXEuZmxhc2goJ3N1Y2Nlc3MnLCB7IG1zZzogJ1Bhc3N3b3JkIGhhcyBiZWVuIGNoYW5nZWQuJyB9KTtcclxuICAgICAgcmVzLnJlZGlyZWN0KCcvYWNjb3VudCcpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUE9TVCAvYWNjb3VudC9kZWxldGVcclxuICogRGVsZXRlIHVzZXIgYWNjb3VudC5cclxuICovXHJcbmV4cG9ydCBsZXQgcG9zdERlbGV0ZUFjY291bnQgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICBVc2VyLnJlbW92ZSh7IF9pZDogcmVxLnVzZXIuaWQgfSwgKGVycikgPT4ge1xyXG4gICAgaWYgKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XHJcbiAgICByZXEubG9nb3V0KCk7XHJcbiAgICByZXEuZmxhc2goJ2luZm8nLCB7IG1zZzogJ1lvdXIgYWNjb3VudCBoYXMgYmVlbiBkZWxldGVkLicgfSk7XHJcbiAgICByZXMucmVkaXJlY3QoJy8nKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHRVQgL2FjY291bnQvdW5saW5rLzpwcm92aWRlclxyXG4gKiBVbmxpbmsgT0F1dGggcHJvdmlkZXIuXHJcbiAqL1xyXG5leHBvcnQgbGV0IGdldE9hdXRoVW5saW5rID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgY29uc3QgcHJvdmlkZXIgPSByZXEucGFyYW1zLnByb3ZpZGVyO1xyXG4gIFVzZXIuZmluZEJ5SWQocmVxLnVzZXIuaWQsIChlcnIsIHVzZXI6IGFueSkgPT4ge1xyXG4gICAgaWYgKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XHJcbiAgICB1c2VyW3Byb3ZpZGVyXSA9IHVuZGVmaW5lZDtcclxuICAgIHVzZXIudG9rZW5zID0gdXNlci50b2tlbnMuZmlsdGVyKCh0b2tlbjogQXV0aFRva2VuKSA9PiB0b2tlbi5raW5kICE9PSBwcm92aWRlcik7XHJcbiAgICB1c2VyLnNhdmUoKGVycjogV3JpdGVFcnJvcikgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgICAgcmVxLmZsYXNoKCdpbmZvJywgeyBtc2c6IGAke3Byb3ZpZGVyfSBhY2NvdW50IGhhcyBiZWVuIHVubGlua2VkLmAgfSk7XHJcbiAgICAgIHJlcy5yZWRpcmVjdCgnL2FjY291bnQnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdFVCAvcmVzZXQvOnRva2VuXHJcbiAqIFJlc2V0IFBhc3N3b3JkIHBhZ2UuXHJcbiAqL1xyXG5leHBvcnQgbGV0IGdldFJlc2V0ID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgaWYgKHJlcS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xyXG4gICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnLycpO1xyXG4gIH1cclxuICBVc2VyXHJcbiAgICAuZmluZE9uZSh7IHBhc3N3b3JkUmVzZXRUb2tlbjogcmVxLnBhcmFtcy50b2tlbiB9KVxyXG4gICAgLndoZXJlKCdwYXNzd29yZFJlc2V0RXhwaXJlcycpLmd0KERhdGUubm93KCkpXHJcbiAgICAuZXhlYygoZXJyLCB1c2VyKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgICByZXEuZmxhc2goJ2Vycm9ycycsIHsgbXNnOiAnUGFzc3dvcmQgcmVzZXQgdG9rZW4gaXMgaW52YWxpZCBvciBoYXMgZXhwaXJlZC4nIH0pO1xyXG4gICAgICAgIHJldHVybiByZXMucmVkaXJlY3QoJy9mb3Jnb3QnKTtcclxuICAgICAgfVxyXG4gICAgICByZXMucmVuZGVyKCdhY2NvdW50L3Jlc2V0Jywge1xyXG4gICAgICAgIHRpdGxlOiAnUGFzc3dvcmQgUmVzZXQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUE9TVCAvcmVzZXQvOnRva2VuXHJcbiAqIFByb2Nlc3MgdGhlIHJlc2V0IHBhc3N3b3JkIHJlcXVlc3QuXHJcbiAqL1xyXG5leHBvcnQgbGV0IHBvc3RSZXNldCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gIHJlcS5hc3NlcnQoJ3Bhc3N3b3JkJywgJ1Bhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgNCBjaGFyYWN0ZXJzIGxvbmcuJykubGVuKHsgbWluOiA0IH0pO1xyXG4gIHJlcS5hc3NlcnQoJ2NvbmZpcm0nLCAnUGFzc3dvcmRzIG11c3QgbWF0Y2guJykuZXF1YWxzKHJlcS5ib2R5LnBhc3N3b3JkKTtcclxuXHJcbiAgY29uc3QgZXJyb3JzID0gcmVxLnZhbGlkYXRpb25FcnJvcnMoKTtcclxuXHJcbiAgaWYgKGVycm9ycykge1xyXG4gICAgcmVxLmZsYXNoKCdlcnJvcnMnLCBlcnJvcnMpO1xyXG4gICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnYmFjaycpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMud2F0ZXJmYWxsKFtcclxuICAgIGZ1bmN0aW9uIHJlc2V0UGFzc3dvcmQoZG9uZTogRnVuY3Rpb24pIHtcclxuICAgICAgVXNlclxyXG4gICAgICAgIC5maW5kT25lKHsgcGFzc3dvcmRSZXNldFRva2VuOiByZXEucGFyYW1zLnRva2VuIH0pXHJcbiAgICAgICAgLndoZXJlKCdwYXNzd29yZFJlc2V0RXhwaXJlcycpLmd0KERhdGUubm93KCkpXHJcbiAgICAgICAgLmV4ZWMoKGVyciwgdXNlcjogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgICAgICAgIGlmICghdXNlcikge1xyXG4gICAgICAgICAgICByZXEuZmxhc2goJ2Vycm9ycycsIHsgbXNnOiAnUGFzc3dvcmQgcmVzZXQgdG9rZW4gaXMgaW52YWxpZCBvciBoYXMgZXhwaXJlZC4nIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCdiYWNrJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkID0gcmVxLmJvZHkucGFzc3dvcmQ7XHJcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkUmVzZXRUb2tlbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIHVzZXIucGFzc3dvcmRSZXNldEV4cGlyZXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICB1c2VyLnNhdmUoKGVycjogV3JpdGVFcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgICAgICAgICAgcmVxLmxvZ0luKHVzZXIsIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBkb25lKGVyciwgdXNlcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZnVuY3Rpb24gc2VuZFJlc2V0UGFzc3dvcmRFbWFpbCh1c2VyOiBVc2VyTW9kZWwsIGRvbmU6IEZ1bmN0aW9uKSB7XHJcbiAgICAgIGNvbnN0IHRyYW5zcG9ydGVyID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xyXG4gICAgICAgIHNlcnZpY2U6ICdTZW5kR3JpZCcsXHJcbiAgICAgICAgYXV0aDoge1xyXG4gICAgICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuU0VOREdSSURfVVNFUixcclxuICAgICAgICAgIHBhc3M6IHByb2Nlc3MuZW52LlNFTkRHUklEX1BBU1NXT1JEXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgdG86IHVzZXIuZW1haWwsXHJcbiAgICAgICAgZnJvbTogJ2V4cHJlc3MtdHNAc3RhcnRlci5jb20nLFxyXG4gICAgICAgIHN1YmplY3Q6ICdZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIGNoYW5nZWQnLFxyXG4gICAgICAgIHRleHQ6IGBIZWxsbyxcXG5cXG5UaGlzIGlzIGEgY29uZmlybWF0aW9uIHRoYXQgdGhlIHBhc3N3b3JkIGZvciB5b3VyIGFjY291bnQgJHt1c2VyLmVtYWlsfSBoYXMganVzdCBiZWVuIGNoYW5nZWQuXFxuYFxyXG4gICAgICB9O1xyXG4gICAgICB0cmFuc3BvcnRlci5zZW5kTWFpbChtYWlsT3B0aW9ucywgKGVycikgPT4ge1xyXG4gICAgICAgIHJlcS5mbGFzaCgnc3VjY2VzcycsIHsgbXNnOiAnU3VjY2VzcyEgWW91ciBwYXNzd29yZCBoYXMgYmVlbiBjaGFuZ2VkLicgfSk7XHJcbiAgICAgICAgZG9uZShlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICBdLCAoZXJyKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgIHJlcy5yZWRpcmVjdCgnLycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdFVCAvZm9yZ290XHJcbiAqIEZvcmdvdCBQYXNzd29yZCBwYWdlLlxyXG4gKi9cclxuZXhwb3J0IGxldCBnZXRGb3Jnb3QgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgaWYgKHJlcS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xyXG4gICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnLycpO1xyXG4gIH1cclxuICByZXMucmVuZGVyKCdhY2NvdW50L2ZvcmdvdCcsIHtcclxuICAgIHRpdGxlOiAnRm9yZ290IFBhc3N3b3JkJ1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBPU1QgL2ZvcmdvdFxyXG4gKiBDcmVhdGUgYSByYW5kb20gdG9rZW4sIHRoZW4gdGhlIHNlbmQgdXNlciBhbiBlbWFpbCB3aXRoIGEgcmVzZXQgbGluay5cclxuICovXHJcbmV4cG9ydCBsZXQgcG9zdEZvcmdvdCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gIHJlcS5hc3NlcnQoJ2VtYWlsJywgJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJykuaXNFbWFpbCgpO1xyXG4gIHJlcS5zYW5pdGl6ZSgnZW1haWwnKS5ub3JtYWxpemVFbWFpbCh7IGdtYWlsX3JlbW92ZV9kb3RzOiBmYWxzZSB9KTtcclxuXHJcbiAgY29uc3QgZXJyb3JzID0gcmVxLnZhbGlkYXRpb25FcnJvcnMoKTtcclxuXHJcbiAgaWYgKGVycm9ycykge1xyXG4gICAgcmVxLmZsYXNoKCdlcnJvcnMnLCBlcnJvcnMpO1xyXG4gICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnL2ZvcmdvdCcpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMud2F0ZXJmYWxsKFtcclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVJhbmRvbVRva2VuKGRvbmU6IEZ1bmN0aW9uKSB7XHJcbiAgICAgIGNyeXB0by5yYW5kb21CeXRlcygxNiwgKGVyciwgYnVmKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBidWYudG9TdHJpbmcoJ2hleCcpO1xyXG4gICAgICAgIGRvbmUoZXJyLCB0b2tlbik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGZ1bmN0aW9uIHNldFJhbmRvbVRva2VuKHRva2VuOiBBdXRoVG9rZW4sIGRvbmU6IEZ1bmN0aW9uKSB7XHJcbiAgICAgIFVzZXIuZmluZE9uZSh7IGVtYWlsOiByZXEuYm9keS5lbWFpbCB9LCAoZXJyLCB1c2VyOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7IHJldHVybiBkb25lKGVycik7IH1cclxuICAgICAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgeyBtc2c6ICdBY2NvdW50IHdpdGggdGhhdCBlbWFpbCBhZGRyZXNzIGRvZXMgbm90IGV4aXN0LicgfSk7XHJcbiAgICAgICAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvZm9yZ290Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVzZXIucGFzc3dvcmRSZXNldFRva2VuID0gdG9rZW47XHJcbiAgICAgICAgdXNlci5wYXNzd29yZFJlc2V0RXhwaXJlcyA9IERhdGUubm93KCkgKyAzNjAwMDAwOyAvLyAxIGhvdXJcclxuICAgICAgICB1c2VyLnNhdmUoKGVycjogV3JpdGVFcnJvcikgPT4ge1xyXG4gICAgICAgICAgZG9uZShlcnIsIHRva2VuLCB1c2VyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZnVuY3Rpb24gc2VuZEZvcmdvdFBhc3N3b3JkRW1haWwodG9rZW46IEF1dGhUb2tlbiwgdXNlcjogVXNlck1vZGVsLCBkb25lOiBGdW5jdGlvbikge1xyXG4gICAgICBjb25zdCB0cmFuc3BvcnRlciA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcclxuICAgICAgICBzZXJ2aWNlOiAnU2VuZEdyaWQnLFxyXG4gICAgICAgIGF1dGg6IHtcclxuICAgICAgICAgIHVzZXI6IHByb2Nlc3MuZW52LlNFTkRHUklEX1VTRVIsXHJcbiAgICAgICAgICBwYXNzOiBwcm9jZXNzLmVudi5TRU5ER1JJRF9QQVNTV09SRFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IG1haWxPcHRpb25zID0ge1xyXG4gICAgICAgIHRvOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgIGZyb206ICdoYWNrYXRob25Ac3RhcnRlci5jb20nLFxyXG4gICAgICAgIHN1YmplY3Q6ICdSZXNldCB5b3VyIHBhc3N3b3JkIG9uIEhhY2thdGhvbiBTdGFydGVyJyxcclxuICAgICAgICB0ZXh0OiBgWW91IGFyZSByZWNlaXZpbmcgdGhpcyBlbWFpbCBiZWNhdXNlIHlvdSAob3Igc29tZW9uZSBlbHNlKSBoYXZlIHJlcXVlc3RlZCB0aGUgcmVzZXQgb2YgdGhlIHBhc3N3b3JkIGZvciB5b3VyIGFjY291bnQuXFxuXFxuXHJcbiAgICAgICAgICBQbGVhc2UgY2xpY2sgb24gdGhlIGZvbGxvd2luZyBsaW5rLCBvciBwYXN0ZSB0aGlzIGludG8geW91ciBicm93c2VyIHRvIGNvbXBsZXRlIHRoZSBwcm9jZXNzOlxcblxcblxyXG4gICAgICAgICAgaHR0cDovLyR7cmVxLmhlYWRlcnMuaG9zdH0vcmVzZXQvJHt0b2tlbn1cXG5cXG5cclxuICAgICAgICAgIElmIHlvdSBkaWQgbm90IHJlcXVlc3QgdGhpcywgcGxlYXNlIGlnbm9yZSB0aGlzIGVtYWlsIGFuZCB5b3VyIHBhc3N3b3JkIHdpbGwgcmVtYWluIHVuY2hhbmdlZC5cXG5gXHJcbiAgICAgIH07XHJcbiAgICAgIHRyYW5zcG9ydGVyLnNlbmRNYWlsKG1haWxPcHRpb25zLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgcmVxLmZsYXNoKCdpbmZvJywgeyBtc2c6IGBBbiBlLW1haWwgaGFzIGJlZW4gc2VudCB0byAke3VzZXIuZW1haWx9IHdpdGggZnVydGhlciBpbnN0cnVjdGlvbnMuYCB9KTtcclxuICAgICAgICBkb25lKGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIF0sIChlcnIpID0+IHtcclxuICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgcmVzLnJlZGlyZWN0KCcvZm9yZ290Jyk7XHJcbiAgfSk7XHJcbn07XHJcbiJdfQ==
