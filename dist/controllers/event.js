"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Registration_1 = require("../models/Registration");
/**
 * GET /
 * Event/{eventId}/Register
 */
exports.register = (req, res, next) => {
    res.render('voterRegistration', {
        title: 'Register voters',
        EventName: 'PLACEHOLDER'
    });
};
/**
 * GET /
 * api/Event/{eventId}/Registrations
 */
exports.getRegistrations = (req, res, next) => {
    Registration_1.default.find((err, registrations) => {
        if (err) {
            return next(err);
        }
        res.json(registrations);
    });
};
/**
 * PUT /
 * api/Event/{eventId}/Registration
 */
exports.registerVoter = (req, res, next) => {
    const dto = req.body;
    const Registration = new Registration_1.default(dto);
    Registration.save((err, product) => {
        if (err) {
            return next(err);
        }
        const result = {
            Success: true,
            Id: product._id
        };
    });
};

//# sourceMappingURL=event.js.map
