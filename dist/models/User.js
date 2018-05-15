"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,
    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    }
}, { timestamps: true });
/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};
/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};
// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model('User', userSchema);
exports.default = User;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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L1VzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBiY3J5cHQgZnJvbSAnYmNyeXB0LW5vZGVqcyc7XHJcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xyXG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5leHBvcnQgdHlwZSBVc2VyTW9kZWwgPSBtb25nb29zZS5Eb2N1bWVudCAmIHtcclxuICBlbWFpbDogc3RyaW5nLFxyXG4gIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgcGFzc3dvcmRSZXNldFRva2VuOiBzdHJpbmcsXHJcbiAgcGFzc3dvcmRSZXNldEV4cGlyZXM6IERhdGUsXHJcblxyXG4gIGZhY2Vib29rOiBzdHJpbmcsXHJcbiAgdG9rZW5zOiBBdXRoVG9rZW5bXSxcclxuXHJcbiAgcHJvZmlsZToge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgZ2VuZGVyOiBzdHJpbmcsXHJcbiAgICBsb2NhdGlvbjogc3RyaW5nLFxyXG4gICAgd2Vic2l0ZTogc3RyaW5nLFxyXG4gICAgcGljdHVyZTogc3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgY29tcGFyZVBhc3N3b3JkOiAoY2FuZGlkYXRlUGFzc3dvcmQ6IHN0cmluZywgY2I6IChlcnI6IGFueSwgaXNNYXRjaDogYW55KSA9PiB7fSkgPT4gdm9pZCxcclxuICBncmF2YXRhcjogKHNpemU6IG51bWJlcikgPT4gc3RyaW5nXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBBdXRoVG9rZW4gPSB7XHJcbiAgYWNjZXNzVG9rZW46IHN0cmluZyxcclxuICBraW5kOiBzdHJpbmdcclxufTtcclxuXHJcbmNvbnN0IHVzZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBlbWFpbDogeyB0eXBlOiBTdHJpbmcsIHVuaXF1ZTogdHJ1ZSB9LFxyXG4gIHBhc3N3b3JkOiBTdHJpbmcsXHJcbiAgcGFzc3dvcmRSZXNldFRva2VuOiBTdHJpbmcsXHJcbiAgcGFzc3dvcmRSZXNldEV4cGlyZXM6IERhdGUsXHJcblxyXG4gIGZhY2Vib29rOiBTdHJpbmcsXHJcbiAgdHdpdHRlcjogU3RyaW5nLFxyXG4gIGdvb2dsZTogU3RyaW5nLFxyXG4gIHRva2VuczogQXJyYXksXHJcblxyXG4gIHByb2ZpbGU6IHtcclxuICAgIG5hbWU6IFN0cmluZyxcclxuICAgIGdlbmRlcjogU3RyaW5nLFxyXG4gICAgbG9jYXRpb246IFN0cmluZyxcclxuICAgIHdlYnNpdGU6IFN0cmluZyxcclxuICAgIHBpY3R1cmU6IFN0cmluZ1xyXG4gIH1cclxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xyXG5cclxuLyoqXHJcbiAqIFBhc3N3b3JkIGhhc2ggbWlkZGxld2FyZS5cclxuICovXHJcbnVzZXJTY2hlbWEucHJlKCdzYXZlJywgZnVuY3Rpb24gc2F2ZShuZXh0KSB7XHJcbiAgY29uc3QgdXNlciA9IHRoaXM7XHJcbiAgaWYgKCF1c2VyLmlzTW9kaWZpZWQoJ3Bhc3N3b3JkJykpIHsgcmV0dXJuIG5leHQoKTsgfVxyXG4gIGJjcnlwdC5nZW5TYWx0KDEwLCAoZXJyLCBzYWx0KSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cclxuICAgIGJjcnlwdC5oYXNoKHVzZXIucGFzc3dvcmQsIHNhbHQsIHVuZGVmaW5lZCwgKGVycjogbW9uZ29vc2UuRXJyb3IsIGhhc2gpID0+IHtcclxuICAgICAgaWYgKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XHJcbiAgICAgIHVzZXIucGFzc3dvcmQgPSBoYXNoO1xyXG4gICAgICBuZXh0KCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSk7XHJcblxyXG51c2VyU2NoZW1hLm1ldGhvZHMuY29tcGFyZVBhc3N3b3JkID0gZnVuY3Rpb24gKGNhbmRpZGF0ZVBhc3N3b3JkOiBzdHJpbmcsIGNiOiAoZXJyOiBhbnksIGlzTWF0Y2g6IGFueSkgPT4ge30pIHtcclxuICBiY3J5cHQuY29tcGFyZShjYW5kaWRhdGVQYXNzd29yZCwgdGhpcy5wYXNzd29yZCwgKGVycjogbW9uZ29vc2UuRXJyb3IsIGlzTWF0Y2g6IGJvb2xlYW4pID0+IHtcclxuICAgIGNiKGVyciwgaXNNYXRjaCk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEhlbHBlciBtZXRob2QgZm9yIGdldHRpbmcgdXNlcidzIGdyYXZhdGFyLlxyXG4gKi9cclxudXNlclNjaGVtYS5tZXRob2RzLmdyYXZhdGFyID0gZnVuY3Rpb24gKHNpemU6IG51bWJlcikge1xyXG4gIGlmICghc2l6ZSkge1xyXG4gICAgc2l6ZSA9IDIwMDtcclxuICB9XHJcbiAgaWYgKCF0aGlzLmVtYWlsKSB7XHJcbiAgICByZXR1cm4gYGh0dHBzOi8vZ3JhdmF0YXIuY29tL2F2YXRhci8/cz0ke3NpemV9JmQ9cmV0cm9gO1xyXG4gIH1cclxuICBjb25zdCBtZDUgPSBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKHRoaXMuZW1haWwpLmRpZ2VzdCgnaGV4Jyk7XHJcbiAgcmV0dXJuIGBodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvJHttZDV9P3M9JHtzaXplfSZkPXJldHJvYDtcclxufTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBVc2VyOiBVc2VyVHlwZSA9IG1vbmdvb3NlLm1vZGVsPFVzZXJUeXBlPignVXNlcicsIHVzZXJTY2hlbWEpO1xyXG5jb25zdCBVc2VyID0gbW9uZ29vc2UubW9kZWwoJ1VzZXInLCB1c2VyU2NoZW1hKTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlcjsiXX0=
