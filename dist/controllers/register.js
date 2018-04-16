"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Registration_1 = require("../models/Registration");
const Event_1 = require("../models/Event");
/**
 * GET /
 * Event/{eventId}/Register
 */
exports.index = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let event;
    try {
        event = yield Event_1.default
            .findById(req.params.eventId)
            .exec();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
    res.render('register', {
        title: 'Register voters',
        EventName: event.Name
    });
});
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

//# sourceMappingURL=register.js.map
