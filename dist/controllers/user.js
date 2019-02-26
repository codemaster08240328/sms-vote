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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0IsaUNBQWlDO0FBQ2pDLHlDQUF5QztBQUN6QyxxQ0FBcUM7QUFDckMseUNBQStEO0FBSy9ELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRzdDOzs7R0FHRztBQUNRLFFBQUEsUUFBUSxHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQ3BELElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjtJQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFO1FBQzFCLEtBQUssRUFBRSxPQUFPO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUY7OztHQUdHO0FBQ1EsUUFBQSxTQUFTLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtJQUN6RSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3BELEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLDBCQUEwQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRW5FLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBRXRDLElBQUksTUFBTSxFQUFFO1FBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9CO0lBRUQsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFVLEVBQUUsSUFBa0IsRUFBRSxJQUF1QixFQUFFLEVBQUU7UUFDekYsSUFBSSxHQUFHLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFFO1FBQzlCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEMsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN0QixJQUFJLEdBQUcsRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUFFO1lBQzlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQztZQUM3RCxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFFRjs7O0dBR0c7QUFDUSxRQUFBLE1BQU0sR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUNsRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDYixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGOzs7R0FHRztBQUNRLFFBQUEsU0FBUyxHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQ3JELElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjtJQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7UUFDM0IsS0FBSyxFQUFFLGdCQUFnQjtLQUN4QixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRjs7O0dBR0c7QUFDUSxRQUFBLFVBQVUsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO0lBQzFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsNkNBQTZDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0RixHQUFHLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLHdCQUF3QixDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEYsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRW5FLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBRXRDLElBQUksTUFBTSxFQUFFO1FBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2hDO0lBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUM7UUFDcEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztRQUNyQixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRO0tBQzVCLENBQUMsQ0FBQztJQUVILGNBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsRUFBRTtRQUM1RCxJQUFJLEdBQUcsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUU7UUFDOUIsSUFBSSxZQUFZLEVBQUU7WUFDaEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsaURBQWlELEVBQUUsQ0FBQyxDQUFDO1lBQ2hGLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNoQztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNoQixJQUFJLEdBQUcsRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUFFO1lBQzlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ3RCLElBQUksR0FBRyxFQUFFO29CQUNQLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNsQjtnQkFDRCxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGOzs7R0FHRztBQUNRLFFBQUEsVUFBVSxHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQ3RELEdBQUcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUU7UUFDNUIsS0FBSyxFQUFFLG9CQUFvQjtLQUM1QixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRjs7O0dBR0c7QUFDUSxRQUFBLGlCQUFpQixHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDakYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUscUNBQXFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNyRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFbkUsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFFdEMsSUFBSSxNQUFNLEVBQUU7UUFDVixHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDakM7SUFFRCxjQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLElBQWtCLEVBQUUsRUFBRTtRQUNyRCxJQUFJLEdBQUcsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUU7UUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFlLEVBQUUsRUFBRTtZQUM1QixJQUFJLEdBQUcsRUFBRTtnQkFDUCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO29CQUN0QixHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSwyRUFBMkUsRUFBRSxDQUFDLENBQUM7b0JBQzFHLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDakM7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbEI7WUFDRCxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSx1Q0FBdUMsRUFBRSxDQUFDLENBQUM7WUFDdkUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUY7OztHQUdHO0FBQ1EsUUFBQSxrQkFBa0IsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO0lBQ2xGLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLDZDQUE2QyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRWxGLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBRXRDLElBQUksTUFBTSxFQUFFO1FBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ2pDO0lBRUQsY0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFrQixFQUFFLEVBQUU7UUFDckQsSUFBSSxHQUFHLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFFO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWUsRUFBRSxFQUFFO1lBQzVCLElBQUksR0FBRyxFQUFFO2dCQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQUU7WUFDOUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsNEJBQTRCLEVBQUUsQ0FBQyxDQUFDO1lBQzVELEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGOzs7R0FHRztBQUNRLFFBQUEsaUJBQWlCLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtJQUNqRixjQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN4QyxJQUFJLEdBQUcsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUU7UUFDOUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0NBQWdDLEVBQUUsQ0FBQyxDQUFDO1FBQzdELEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRjs7O0dBR0c7QUFDUSxRQUFBLGNBQWMsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO0lBQzlFLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3JDLGNBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBUyxFQUFFLEVBQUU7UUFDNUMsSUFBSSxHQUFHLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFFO1FBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQWdCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWUsRUFBRSxFQUFFO1lBQzVCLElBQUksR0FBRyxFQUFFO2dCQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQUU7WUFDOUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxRQUFRLDZCQUE2QixFQUFFLENBQUMsQ0FBQztZQUNyRSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRjs7O0dBR0c7QUFDUSxRQUFBLFFBQVEsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO0lBQ3hFLElBQUksR0FBRyxDQUFDLGVBQWUsRUFBRSxFQUFFO1FBQ3pCLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjtJQUNELGNBQUk7U0FDRCxPQUFPLENBQUMsRUFBRSxrQkFBa0IsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2pELEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDNUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ2xCLElBQUksR0FBRyxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtRQUM5QixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsaURBQWlELEVBQUUsQ0FBQyxDQUFDO1lBQ2hGLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNoQztRQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFO1lBQzFCLEtBQUssRUFBRSxnQkFBZ0I7U0FDeEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFRjs7O0dBR0c7QUFDUSxRQUFBLFNBQVMsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO0lBQ3pFLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLDhDQUE4QyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUV6RSxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUV0QyxJQUFJLE1BQU0sRUFBRTtRQUNWLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM3QjtJQUVELEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDZCx1QkFBdUIsSUFBYztZQUNuQyxjQUFJO2lCQUNELE9BQU8sQ0FBQyxFQUFFLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2pELEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQzVDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFTLEVBQUUsRUFBRTtnQkFDdkIsSUFBSSxHQUFHLEVBQUU7b0JBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQUU7Z0JBQzlCLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsaURBQWlELEVBQUUsQ0FBQyxDQUFDO29CQUNoRixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzdCO2dCQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFlLEVBQUUsRUFBRTtvQkFDNUIsSUFBSSxHQUFHLEVBQUU7d0JBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQUU7b0JBQzlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7d0JBQ3RCLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2xCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsZ0NBQWdDLElBQWtCLEVBQUUsSUFBYztZQUNoRSxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDO2dCQUM3QyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWE7b0JBQy9CLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtpQkFDcEM7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLFdBQVcsR0FBRztnQkFDbEIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNkLElBQUksRUFBRSx3QkFBd0I7Z0JBQzlCLE9BQU8sRUFBRSxnQ0FBZ0M7Z0JBQ3pDLElBQUksRUFBRSx1RUFBdUUsSUFBSSxDQUFDLEtBQUssMkJBQTJCO2FBQ25ILENBQUM7WUFDRixXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUN4QyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSwwQ0FBMEMsRUFBRSxDQUFDLENBQUM7Z0JBQzFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNULElBQUksR0FBRyxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtRQUM5QixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUY7OztHQUdHO0FBQ1EsUUFBQSxTQUFTLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDckQsSUFBSSxHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUU7UUFDekIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzFCO0lBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRTtRQUMzQixLQUFLLEVBQUUsaUJBQWlCO0tBQ3pCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGOzs7R0FHRztBQUNRLFFBQUEsVUFBVSxHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDMUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUscUNBQXFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNyRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFbkUsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFFdEMsSUFBSSxNQUFNLEVBQUU7UUFDVixHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDaEM7SUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2QsMkJBQTJCLElBQWM7WUFDdkMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ2xDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0Qsd0JBQXdCLEtBQWdCLEVBQUUsSUFBYztZQUN0RCxjQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBUyxFQUFFLEVBQUU7Z0JBQ3pELElBQUksR0FBRyxFQUFFO29CQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUFFO2dCQUM5QixJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNULEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLGlEQUFpRCxFQUFFLENBQUMsQ0FBQztvQkFDaEYsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUNoQztnQkFDRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLFNBQVM7Z0JBQzNELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFlLEVBQUUsRUFBRTtvQkFDNUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsaUNBQWlDLEtBQWdCLEVBQUUsSUFBa0IsRUFBRSxJQUFjO1lBQ25GLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUM7Z0JBQzdDLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYTtvQkFDL0IsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCO2lCQUNwQzthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sV0FBVyxHQUFHO2dCQUNsQixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2QsSUFBSSxFQUFFLHVCQUF1QjtnQkFDN0IsT0FBTyxFQUFFLDBDQUEwQztnQkFDbkQsSUFBSSxFQUFFOzttQkFFSyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksVUFBVSxLQUFLOzJHQUN5RDthQUNwRyxDQUFDO1lBQ0YsV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDeEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsOEJBQThCLElBQUksQ0FBQyxLQUFLLDZCQUE2QixFQUFFLENBQUMsQ0FBQztnQkFDbEcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0YsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ1QsSUFBSSxHQUFHLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFFO1FBQzlCLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMiLCJmaWxlIjoiY29udHJvbGxlcnMvdXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFzeW5jIGZyb20gJ2FzeW5jJztcclxuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XHJcbmltcG9ydCAqIGFzIG5vZGVtYWlsZXIgZnJvbSAnbm9kZW1haWxlcic7XHJcbmltcG9ydCAqIGFzIHBhc3Nwb3J0IGZyb20gJ3Bhc3Nwb3J0JztcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyBVc2VyLCBVc2VyRG9jdW1lbnQgfSBmcm9tICcuLi9tb2RlbHMvVXNlcic7XHJcbmltcG9ydCB7IEF1dGhUb2tlbiB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9Vc2VyRFRPJztcclxuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgeyBMb2NhbFN0cmF0ZWd5SW5mbyB9IGZyb20gJ3Bhc3Nwb3J0LWxvY2FsJztcclxuaW1wb3J0IHsgV3JpdGVFcnJvciB9IGZyb20gJ21vbmdvZGInO1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnZXhwcmVzcy12YWxpZGF0b3InKTtcclxuXHJcblxyXG4vKipcclxuICogR0VUIC9sb2dpblxyXG4gKiBMb2dpbiBwYWdlLlxyXG4gKi9cclxuZXhwb3J0IGxldCBnZXRMb2dpbiA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICBpZiAocmVxLnVzZXIpIHtcclxuICAgIHJldHVybiByZXMucmVkaXJlY3QoJy8nKTtcclxuICB9XHJcbiAgcmVzLnJlbmRlcignYWNjb3VudC9sb2dpbicsIHtcclxuICAgIHRpdGxlOiAnTG9naW4nXHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUE9TVCAvbG9naW5cclxuICogU2lnbiBpbiB1c2luZyBlbWFpbCBhbmQgcGFzc3dvcmQuXHJcbiAqL1xyXG5leHBvcnQgbGV0IHBvc3RMb2dpbiA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gIHJlcS5hc3NlcnQoJ2VtYWlsJywgJ0VtYWlsIGlzIG5vdCB2YWxpZCcpLmlzRW1haWwoKTtcclxuICByZXEuYXNzZXJ0KCdwYXNzd29yZCcsICdQYXNzd29yZCBjYW5ub3QgYmUgYmxhbmsnKS5ub3RFbXB0eSgpO1xyXG4gIHJlcS5zYW5pdGl6ZSgnZW1haWwnKS5ub3JtYWxpemVFbWFpbCh7IGdtYWlsX3JlbW92ZV9kb3RzOiBmYWxzZSB9KTtcclxuXHJcbiAgY29uc3QgZXJyb3JzID0gcmVxLnZhbGlkYXRpb25FcnJvcnMoKTtcclxuXHJcbiAgaWYgKGVycm9ycykge1xyXG4gICAgcmVxLmZsYXNoKCdlcnJvcnMnLCBlcnJvcnMpO1xyXG4gICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnL2xvZ2luJyk7XHJcbiAgfVxyXG5cclxuICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2xvY2FsJywgKGVycjogRXJyb3IsIHVzZXI6IFVzZXJEb2N1bWVudCwgaW5mbzogTG9jYWxTdHJhdGVneUluZm8pID0+IHtcclxuICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgaW5mby5tZXNzYWdlKTtcclxuICAgICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnL2xvZ2luJyk7XHJcbiAgICB9XHJcbiAgICByZXEubG9nSW4odXNlciwgKGVycikgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgICAgcmVxLmZsYXNoKCdzdWNjZXNzJywgeyBtc2c6ICdTdWNjZXNzISBZb3UgYXJlIGxvZ2dlZCBpbi4nIH0pO1xyXG4gICAgICByZXMucmVkaXJlY3QocmVxLnNlc3Npb24ucmV0dXJuVG8gfHwgJy8nKTtcclxuICAgIH0pO1xyXG4gIH0pKHJlcSwgcmVzLCBuZXh0KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHRVQgL2xvZ291dFxyXG4gKiBMb2cgb3V0LlxyXG4gKi9cclxuZXhwb3J0IGxldCBsb2dvdXQgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgcmVxLmxvZ291dCgpO1xyXG4gIHJlcy5yZWRpcmVjdCgnLycpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdFVCAvc2lnbnVwXHJcbiAqIFNpZ251cCBwYWdlLlxyXG4gKi9cclxuZXhwb3J0IGxldCBnZXRTaWdudXAgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgaWYgKHJlcS51c2VyKSB7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvJyk7XHJcbiAgfVxyXG4gIHJlcy5yZW5kZXIoJ2FjY291bnQvc2lnbnVwJywge1xyXG4gICAgdGl0bGU6ICdDcmVhdGUgQWNjb3VudCdcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQT1NUIC9zaWdudXBcclxuICogQ3JlYXRlIGEgbmV3IGxvY2FsIGFjY291bnQuXHJcbiAqL1xyXG5leHBvcnQgbGV0IHBvc3RTaWdudXAgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICByZXEuYXNzZXJ0KCdlbWFpbCcsICdFbWFpbCBpcyBub3QgdmFsaWQnKS5pc0VtYWlsKCk7XHJcbiAgcmVxLmFzc2VydCgncGFzc3dvcmQnLCAnUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA0IGNoYXJhY3RlcnMgbG9uZycpLmxlbih7IG1pbjogNCB9KTtcclxuICByZXEuYXNzZXJ0KCdjb25maXJtUGFzc3dvcmQnLCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpLmVxdWFscyhyZXEuYm9keS5wYXNzd29yZCk7XHJcbiAgcmVxLnNhbml0aXplKCdlbWFpbCcpLm5vcm1hbGl6ZUVtYWlsKHsgZ21haWxfcmVtb3ZlX2RvdHM6IGZhbHNlIH0pO1xyXG5cclxuICBjb25zdCBlcnJvcnMgPSByZXEudmFsaWRhdGlvbkVycm9ycygpO1xyXG5cclxuICBpZiAoZXJyb3JzKSB7XHJcbiAgICByZXEuZmxhc2goJ2Vycm9ycycsIGVycm9ycyk7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvc2lnbnVwJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB1c2VyID0gbmV3IFVzZXIoe1xyXG4gICAgZW1haWw6IHJlcS5ib2R5LmVtYWlsLFxyXG4gICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkXHJcbiAgfSk7XHJcblxyXG4gIFVzZXIuZmluZE9uZSh7IGVtYWlsOiByZXEuYm9keS5lbWFpbCB9LCAoZXJyLCBleGlzdGluZ1VzZXIpID0+IHtcclxuICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgaWYgKGV4aXN0aW5nVXNlcikge1xyXG4gICAgICByZXEuZmxhc2goJ2Vycm9ycycsIHsgbXNnOiAnQWNjb3VudCB3aXRoIHRoYXQgZW1haWwgYWRkcmVzcyBhbHJlYWR5IGV4aXN0cy4nIH0pO1xyXG4gICAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvc2lnbnVwJyk7XHJcbiAgICB9XHJcbiAgICB1c2VyLnNhdmUoKGVycikgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgICAgcmVxLmxvZ0luKHVzZXIsIChlcnIpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICByZXR1cm4gbmV4dChlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXMucmVkaXJlY3QoJy8nKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHRVQgL2FjY291bnRcclxuICogUHJvZmlsZSBwYWdlLlxyXG4gKi9cclxuZXhwb3J0IGxldCBnZXRBY2NvdW50ID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gIHJlcy5yZW5kZXIoJ2FjY291bnQvcHJvZmlsZScsIHtcclxuICAgIHRpdGxlOiAnQWNjb3VudCBNYW5hZ2VtZW50J1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBPU1QgL2FjY291bnQvcHJvZmlsZVxyXG4gKiBVcGRhdGUgcHJvZmlsZSBpbmZvcm1hdGlvbi5cclxuICovXHJcbmV4cG9ydCBsZXQgcG9zdFVwZGF0ZVByb2ZpbGUgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICByZXEuYXNzZXJ0KCdlbWFpbCcsICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicpLmlzRW1haWwoKTtcclxuICByZXEuc2FuaXRpemUoJ2VtYWlsJykubm9ybWFsaXplRW1haWwoeyBnbWFpbF9yZW1vdmVfZG90czogZmFsc2UgfSk7XHJcblxyXG4gIGNvbnN0IGVycm9ycyA9IHJlcS52YWxpZGF0aW9uRXJyb3JzKCk7XHJcblxyXG4gIGlmIChlcnJvcnMpIHtcclxuICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgZXJyb3JzKTtcclxuICAgIHJldHVybiByZXMucmVkaXJlY3QoJy9hY2NvdW50Jyk7XHJcbiAgfVxyXG5cclxuICBVc2VyLmZpbmRCeUlkKHJlcS51c2VyLmlkLCAoZXJyLCB1c2VyOiBVc2VyRG9jdW1lbnQpID0+IHtcclxuICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgdXNlci5lbWFpbCA9IHJlcS5ib2R5LmVtYWlsIHx8ICcnO1xyXG4gICAgdXNlci5wcm9maWxlLm5hbWUgPSByZXEuYm9keS5uYW1lIHx8ICcnO1xyXG4gICAgdXNlci5wcm9maWxlLmdlbmRlciA9IHJlcS5ib2R5LmdlbmRlciB8fCAnJztcclxuICAgIHVzZXIucHJvZmlsZS5sb2NhdGlvbiA9IHJlcS5ib2R5LmxvY2F0aW9uIHx8ICcnO1xyXG4gICAgdXNlci5wcm9maWxlLndlYnNpdGUgPSByZXEuYm9keS53ZWJzaXRlIHx8ICcnO1xyXG4gICAgdXNlci5zYXZlKChlcnI6IFdyaXRlRXJyb3IpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gMTEwMDApIHtcclxuICAgICAgICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgeyBtc2c6ICdUaGUgZW1haWwgYWRkcmVzcyB5b3UgaGF2ZSBlbnRlcmVkIGlzIGFscmVhZHkgYXNzb2NpYXRlZCB3aXRoIGFuIGFjY291bnQuJyB9KTtcclxuICAgICAgICAgIHJldHVybiByZXMucmVkaXJlY3QoJy9hY2NvdW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXh0KGVycik7XHJcbiAgICAgIH1cclxuICAgICAgcmVxLmZsYXNoKCdzdWNjZXNzJywgeyBtc2c6ICdQcm9maWxlIGluZm9ybWF0aW9uIGhhcyBiZWVuIHVwZGF0ZWQuJyB9KTtcclxuICAgICAgcmVzLnJlZGlyZWN0KCcvYWNjb3VudCcpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUE9TVCAvYWNjb3VudC9wYXNzd29yZFxyXG4gKiBVcGRhdGUgY3VycmVudCBwYXNzd29yZC5cclxuICovXHJcbmV4cG9ydCBsZXQgcG9zdFVwZGF0ZVBhc3N3b3JkID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgcmVxLmFzc2VydCgncGFzc3dvcmQnLCAnUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA0IGNoYXJhY3RlcnMgbG9uZycpLmxlbih7IG1pbjogNCB9KTtcclxuICByZXEuYXNzZXJ0KCdjb25maXJtUGFzc3dvcmQnLCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpLmVxdWFscyhyZXEuYm9keS5wYXNzd29yZCk7XHJcblxyXG4gIGNvbnN0IGVycm9ycyA9IHJlcS52YWxpZGF0aW9uRXJyb3JzKCk7XHJcblxyXG4gIGlmIChlcnJvcnMpIHtcclxuICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgZXJyb3JzKTtcclxuICAgIHJldHVybiByZXMucmVkaXJlY3QoJy9hY2NvdW50Jyk7XHJcbiAgfVxyXG5cclxuICBVc2VyLmZpbmRCeUlkKHJlcS51c2VyLmlkLCAoZXJyLCB1c2VyOiBVc2VyRG9jdW1lbnQpID0+IHtcclxuICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgdXNlci5wYXNzd29yZCA9IHJlcS5ib2R5LnBhc3N3b3JkO1xyXG4gICAgdXNlci5zYXZlKChlcnI6IFdyaXRlRXJyb3IpID0+IHtcclxuICAgICAgaWYgKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XHJcbiAgICAgIHJlcS5mbGFzaCgnc3VjY2VzcycsIHsgbXNnOiAnUGFzc3dvcmQgaGFzIGJlZW4gY2hhbmdlZC4nIH0pO1xyXG4gICAgICByZXMucmVkaXJlY3QoJy9hY2NvdW50Jyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQT1NUIC9hY2NvdW50L2RlbGV0ZVxyXG4gKiBEZWxldGUgdXNlciBhY2NvdW50LlxyXG4gKi9cclxuZXhwb3J0IGxldCBwb3N0RGVsZXRlQWNjb3VudCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gIFVzZXIucmVtb3ZlKHsgX2lkOiByZXEudXNlci5pZCB9LCAoZXJyKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgIHJlcS5sb2dvdXQoKTtcclxuICAgIHJlcS5mbGFzaCgnaW5mbycsIHsgbXNnOiAnWW91ciBhY2NvdW50IGhhcyBiZWVuIGRlbGV0ZWQuJyB9KTtcclxuICAgIHJlcy5yZWRpcmVjdCgnLycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdFVCAvYWNjb3VudC91bmxpbmsvOnByb3ZpZGVyXHJcbiAqIFVubGluayBPQXV0aCBwcm92aWRlci5cclxuICovXHJcbmV4cG9ydCBsZXQgZ2V0T2F1dGhVbmxpbmsgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICBjb25zdCBwcm92aWRlciA9IHJlcS5wYXJhbXMucHJvdmlkZXI7XHJcbiAgVXNlci5maW5kQnlJZChyZXEudXNlci5pZCwgKGVyciwgdXNlcjogYW55KSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgIHVzZXJbcHJvdmlkZXJdID0gdW5kZWZpbmVkO1xyXG4gICAgdXNlci50b2tlbnMgPSB1c2VyLnRva2Vucy5maWx0ZXIoKHRva2VuOiBBdXRoVG9rZW4pID0+IHRva2VuLmtpbmQgIT09IHByb3ZpZGVyKTtcclxuICAgIHVzZXIuc2F2ZSgoZXJyOiBXcml0ZUVycm9yKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgICByZXEuZmxhc2goJ2luZm8nLCB7IG1zZzogYCR7cHJvdmlkZXJ9IGFjY291bnQgaGFzIGJlZW4gdW5saW5rZWQuYCB9KTtcclxuICAgICAgcmVzLnJlZGlyZWN0KCcvYWNjb3VudCcpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogR0VUIC9yZXNldC86dG9rZW5cclxuICogUmVzZXQgUGFzc3dvcmQgcGFnZS5cclxuICovXHJcbmV4cG9ydCBsZXQgZ2V0UmVzZXQgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICBpZiAocmVxLmlzQXV0aGVudGljYXRlZCgpKSB7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvJyk7XHJcbiAgfVxyXG4gIFVzZXJcclxuICAgIC5maW5kT25lKHsgcGFzc3dvcmRSZXNldFRva2VuOiByZXEucGFyYW1zLnRva2VuIH0pXHJcbiAgICAud2hlcmUoJ3Bhc3N3b3JkUmVzZXRFeHBpcmVzJykuZ3QoRGF0ZS5ub3coKSlcclxuICAgIC5leGVjKChlcnIsIHVzZXIpID0+IHtcclxuICAgICAgaWYgKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XHJcbiAgICAgIGlmICghdXNlcikge1xyXG4gICAgICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgeyBtc2c6ICdQYXNzd29yZCByZXNldCB0b2tlbiBpcyBpbnZhbGlkIG9yIGhhcyBleHBpcmVkLicgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgnL2ZvcmdvdCcpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcy5yZW5kZXIoJ2FjY291bnQvcmVzZXQnLCB7XHJcbiAgICAgICAgdGl0bGU6ICdQYXNzd29yZCBSZXNldCdcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQT1NUIC9yZXNldC86dG9rZW5cclxuICogUHJvY2VzcyB0aGUgcmVzZXQgcGFzc3dvcmQgcmVxdWVzdC5cclxuICovXHJcbmV4cG9ydCBsZXQgcG9zdFJlc2V0ID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgcmVxLmFzc2VydCgncGFzc3dvcmQnLCAnUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA0IGNoYXJhY3RlcnMgbG9uZy4nKS5sZW4oeyBtaW46IDQgfSk7XHJcbiAgcmVxLmFzc2VydCgnY29uZmlybScsICdQYXNzd29yZHMgbXVzdCBtYXRjaC4nKS5lcXVhbHMocmVxLmJvZHkucGFzc3dvcmQpO1xyXG5cclxuICBjb25zdCBlcnJvcnMgPSByZXEudmFsaWRhdGlvbkVycm9ycygpO1xyXG5cclxuICBpZiAoZXJyb3JzKSB7XHJcbiAgICByZXEuZmxhc2goJ2Vycm9ycycsIGVycm9ycyk7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCdiYWNrJyk7XHJcbiAgfVxyXG5cclxuICBhc3luYy53YXRlcmZhbGwoW1xyXG4gICAgZnVuY3Rpb24gcmVzZXRQYXNzd29yZChkb25lOiBGdW5jdGlvbikge1xyXG4gICAgICBVc2VyXHJcbiAgICAgICAgLmZpbmRPbmUoeyBwYXNzd29yZFJlc2V0VG9rZW46IHJlcS5wYXJhbXMudG9rZW4gfSlcclxuICAgICAgICAud2hlcmUoJ3Bhc3N3b3JkUmVzZXRFeHBpcmVzJykuZ3QoRGF0ZS5ub3coKSlcclxuICAgICAgICAuZXhlYygoZXJyLCB1c2VyOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgICAgICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgICAgICAgIHJlcS5mbGFzaCgnZXJyb3JzJywgeyBtc2c6ICdQYXNzd29yZCByZXNldCB0b2tlbiBpcyBpbnZhbGlkIG9yIGhhcyBleHBpcmVkLicgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMucmVkaXJlY3QoJ2JhY2snKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHVzZXIucGFzc3dvcmQgPSByZXEuYm9keS5wYXNzd29yZDtcclxuICAgICAgICAgIHVzZXIucGFzc3dvcmRSZXNldFRva2VuID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgdXNlci5wYXNzd29yZFJlc2V0RXhwaXJlcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIHVzZXIuc2F2ZSgoZXJyOiBXcml0ZUVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgICAgICAgICByZXEubG9nSW4odXNlciwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGRvbmUoZXJyLCB1c2VyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBmdW5jdGlvbiBzZW5kUmVzZXRQYXNzd29yZEVtYWlsKHVzZXI6IFVzZXJEb2N1bWVudCwgZG9uZTogRnVuY3Rpb24pIHtcclxuICAgICAgY29uc3QgdHJhbnNwb3J0ZXIgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XHJcbiAgICAgICAgc2VydmljZTogJ1NlbmRHcmlkJyxcclxuICAgICAgICBhdXRoOiB7XHJcbiAgICAgICAgICB1c2VyOiBwcm9jZXNzLmVudi5TRU5ER1JJRF9VU0VSLFxyXG4gICAgICAgICAgcGFzczogcHJvY2Vzcy5lbnYuU0VOREdSSURfUEFTU1dPUkRcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCBtYWlsT3B0aW9ucyA9IHtcclxuICAgICAgICB0bzogdXNlci5lbWFpbCxcclxuICAgICAgICBmcm9tOiAnZXhwcmVzcy10c0BzdGFydGVyLmNvbScsXHJcbiAgICAgICAgc3ViamVjdDogJ1lvdXIgcGFzc3dvcmQgaGFzIGJlZW4gY2hhbmdlZCcsXHJcbiAgICAgICAgdGV4dDogYEhlbGxvLFxcblxcblRoaXMgaXMgYSBjb25maXJtYXRpb24gdGhhdCB0aGUgcGFzc3dvcmQgZm9yIHlvdXIgYWNjb3VudCAke3VzZXIuZW1haWx9IGhhcyBqdXN0IGJlZW4gY2hhbmdlZC5cXG5gXHJcbiAgICAgIH07XHJcbiAgICAgIHRyYW5zcG9ydGVyLnNlbmRNYWlsKG1haWxPcHRpb25zLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgcmVxLmZsYXNoKCdzdWNjZXNzJywgeyBtc2c6ICdTdWNjZXNzISBZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIGNoYW5nZWQuJyB9KTtcclxuICAgICAgICBkb25lKGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIF0sIChlcnIpID0+IHtcclxuICAgIGlmIChlcnIpIHsgcmV0dXJuIG5leHQoZXJyKTsgfVxyXG4gICAgcmVzLnJlZGlyZWN0KCcvJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogR0VUIC9mb3Jnb3RcclxuICogRm9yZ290IFBhc3N3b3JkIHBhZ2UuXHJcbiAqL1xyXG5leHBvcnQgbGV0IGdldEZvcmdvdCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICBpZiAocmVxLmlzQXV0aGVudGljYXRlZCgpKSB7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvJyk7XHJcbiAgfVxyXG4gIHJlcy5yZW5kZXIoJ2FjY291bnQvZm9yZ290Jywge1xyXG4gICAgdGl0bGU6ICdGb3Jnb3QgUGFzc3dvcmQnXHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUE9TVCAvZm9yZ290XHJcbiAqIENyZWF0ZSBhIHJhbmRvbSB0b2tlbiwgdGhlbiB0aGUgc2VuZCB1c2VyIGFuIGVtYWlsIHdpdGggYSByZXNldCBsaW5rLlxyXG4gKi9cclxuZXhwb3J0IGxldCBwb3N0Rm9yZ290ID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgcmVxLmFzc2VydCgnZW1haWwnLCAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nKS5pc0VtYWlsKCk7XHJcbiAgcmVxLnNhbml0aXplKCdlbWFpbCcpLm5vcm1hbGl6ZUVtYWlsKHsgZ21haWxfcmVtb3ZlX2RvdHM6IGZhbHNlIH0pO1xyXG5cclxuICBjb25zdCBlcnJvcnMgPSByZXEudmFsaWRhdGlvbkVycm9ycygpO1xyXG5cclxuICBpZiAoZXJyb3JzKSB7XHJcbiAgICByZXEuZmxhc2goJ2Vycm9ycycsIGVycm9ycyk7XHJcbiAgICByZXR1cm4gcmVzLnJlZGlyZWN0KCcvZm9yZ290Jyk7XHJcbiAgfVxyXG5cclxuICBhc3luYy53YXRlcmZhbGwoW1xyXG4gICAgZnVuY3Rpb24gY3JlYXRlUmFuZG9tVG9rZW4oZG9uZTogRnVuY3Rpb24pIHtcclxuICAgICAgY3J5cHRvLnJhbmRvbUJ5dGVzKDE2LCAoZXJyLCBidWYpID0+IHtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IGJ1Zi50b1N0cmluZygnaGV4Jyk7XHJcbiAgICAgICAgZG9uZShlcnIsIHRva2VuKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZnVuY3Rpb24gc2V0UmFuZG9tVG9rZW4odG9rZW46IEF1dGhUb2tlbiwgZG9uZTogRnVuY3Rpb24pIHtcclxuICAgICAgVXNlci5maW5kT25lKHsgZW1haWw6IHJlcS5ib2R5LmVtYWlsIH0sIChlcnIsIHVzZXI6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIGRvbmUoZXJyKTsgfVxyXG4gICAgICAgIGlmICghdXNlcikge1xyXG4gICAgICAgICAgcmVxLmZsYXNoKCdlcnJvcnMnLCB7IG1zZzogJ0FjY291bnQgd2l0aCB0aGF0IGVtYWlsIGFkZHJlc3MgZG9lcyBub3QgZXhpc3QuJyB9KTtcclxuICAgICAgICAgIHJldHVybiByZXMucmVkaXJlY3QoJy9mb3Jnb3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXNlci5wYXNzd29yZFJlc2V0VG9rZW4gPSB0b2tlbjtcclxuICAgICAgICB1c2VyLnBhc3N3b3JkUmVzZXRFeHBpcmVzID0gRGF0ZS5ub3coKSArIDM2MDAwMDA7IC8vIDEgaG91clxyXG4gICAgICAgIHVzZXIuc2F2ZSgoZXJyOiBXcml0ZUVycm9yKSA9PiB7XHJcbiAgICAgICAgICBkb25lKGVyciwgdG9rZW4sIHVzZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBmdW5jdGlvbiBzZW5kRm9yZ290UGFzc3dvcmRFbWFpbCh0b2tlbjogQXV0aFRva2VuLCB1c2VyOiBVc2VyRG9jdW1lbnQsIGRvbmU6IEZ1bmN0aW9uKSB7XHJcbiAgICAgIGNvbnN0IHRyYW5zcG9ydGVyID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xyXG4gICAgICAgIHNlcnZpY2U6ICdTZW5kR3JpZCcsXHJcbiAgICAgICAgYXV0aDoge1xyXG4gICAgICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuU0VOREdSSURfVVNFUixcclxuICAgICAgICAgIHBhc3M6IHByb2Nlc3MuZW52LlNFTkRHUklEX1BBU1NXT1JEXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgdG86IHVzZXIuZW1haWwsXHJcbiAgICAgICAgZnJvbTogJ2hhY2thdGhvbkBzdGFydGVyLmNvbScsXHJcbiAgICAgICAgc3ViamVjdDogJ1Jlc2V0IHlvdXIgcGFzc3dvcmQgb24gSGFja2F0aG9uIFN0YXJ0ZXInLFxyXG4gICAgICAgIHRleHQ6IGBZb3UgYXJlIHJlY2VpdmluZyB0aGlzIGVtYWlsIGJlY2F1c2UgeW91IChvciBzb21lb25lIGVsc2UpIGhhdmUgcmVxdWVzdGVkIHRoZSByZXNldCBvZiB0aGUgcGFzc3dvcmQgZm9yIHlvdXIgYWNjb3VudC5cXG5cXG5cclxuICAgICAgICAgIFBsZWFzZSBjbGljayBvbiB0aGUgZm9sbG93aW5nIGxpbmssIG9yIHBhc3RlIHRoaXMgaW50byB5b3VyIGJyb3dzZXIgdG8gY29tcGxldGUgdGhlIHByb2Nlc3M6XFxuXFxuXHJcbiAgICAgICAgICBodHRwOi8vJHtyZXEuaGVhZGVycy5ob3N0fS9yZXNldC8ke3Rva2VufVxcblxcblxyXG4gICAgICAgICAgSWYgeW91IGRpZCBub3QgcmVxdWVzdCB0aGlzLCBwbGVhc2UgaWdub3JlIHRoaXMgZW1haWwgYW5kIHlvdXIgcGFzc3dvcmQgd2lsbCByZW1haW4gdW5jaGFuZ2VkLlxcbmBcclxuICAgICAgfTtcclxuICAgICAgdHJhbnNwb3J0ZXIuc2VuZE1haWwobWFpbE9wdGlvbnMsIChlcnIpID0+IHtcclxuICAgICAgICByZXEuZmxhc2goJ2luZm8nLCB7IG1zZzogYEFuIGUtbWFpbCBoYXMgYmVlbiBzZW50IHRvICR7dXNlci5lbWFpbH0gd2l0aCBmdXJ0aGVyIGluc3RydWN0aW9ucy5gIH0pO1xyXG4gICAgICAgIGRvbmUoZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgXSwgKGVycikgPT4ge1xyXG4gICAgaWYgKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XHJcbiAgICByZXMucmVkaXJlY3QoJy9mb3Jnb3QnKTtcclxuICB9KTtcclxufTtcclxuIl19
