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
const Event_1 = require("../models/Event");
const utils = require("../utils");
/**
 * GET /
 * Vote results
 */
exports.index = (req, res) => {
    Event_1.default.findById(req.query.id, (err, voteSource) => {
        res.render('vote', {
            title: `Results for ${voteSource.Name}`
        });
    });
};
exports.voteSMS = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    response.header('Content-Type', 'text/xml');
    console.log(`voteSMS() called at ${new Date().toISOString()}`);
    const body = request.param('Body').trim();
    // the number the vote it being sent to (this should match an Event)
    const to = request.param('To').slice(1);
    // the voter, use this to keep people from voting more than once
    const from = request.param('From');
    console.log(`Vote received - Body: ${body} From: ${from} To: ${to}`);
    let events;
    try {
        events = yield Event_1.default
            .find({ PhoneNumber: to })
            .limit(1)
            .exec();
    }
    catch (err) {
        console.log(err);
        response.send('<Response>Sorry! Our system encountered an error. Please try again.</Response>');
        return next(err);
    }
    const event = events[0];
    if (events.length < 1) {
        console.log(`No event is configured at this number: ${to}`);
        // silently fail for the user
        response.send('<Response><Sms>Sorry! No event is currently running at this number. Please check the number and try again.</Sms></Response>');
    }
    else if (!event.Enabled) {
        response.send('<Response><Sms>Voting is now closed.</Sms></Response>');
    }
    else if (!utils.testint(body)) {
        console.log('Bad vote: ' + event.Name + ', ' + from + ', ' + body);
        response.send('<Response><Sms>Sorry, invalid vote. Please text a number between 1 and ' + event.Contestants.length + '</Sms></Response>');
    }
    else if (utils.testint(body) && (parseInt(body) <= 0 || !event.CurrentRound.Contestants.map(c => c.VoteKey).contains(parseInt(body)))) {
        console.log('Bad vote: ' + event.Name + ', ' + from + ', ' + body + ', ' + ('[1-' + event.Contestants.length + ']'));
        response.send('<Response><Sms>Sorry, invalid vote. Please text a number between 1 and ' + event.Contestants.length + '</Sms></Response>');
    }
    else if (!event.CurrentRound) {
        console.log(`No round is currently selected for event: ${event.Name}`);
        response.send('<Response><Sms>Voting is now closed.</Sms></Response>');
    }
    else if (event.hasVoted(from)) {
        console.log('Denying vote: ' + event.Name + ', ' + from + ' - Already voted');
        response.send('<Response><Sms>Sorry, you are only allowed to vote once per round.</Sms></Response>');
    }
    else {
        const choice = parseInt(body);
        const registration = event.Registrations.find(r => r.PhoneNumber == from);
        event.CurrentRound.Contestants
            .find(c => c.VoteKey === choice)
            .Votes.push(registration);
        event.save((err) => {
            if (err) {
                response.send('<Response><Sms>We encountered an error saving your vote. Try again?</Sms></Response>');
            }
            else {
                console.log('Accepting vote: ' + event.Name + ', ' + from);
                response.send('<Response><Sms>Thanks for your vote for ' + event.Name + '. Powered by Twilio.</Sms></Response>');
            }
        });
    }
});
exports.saveEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const dto = req.body;
    let savedEvent;
    if (!dto._id) {
        const event = new Event_1.default(dto);
        try {
            savedEvent = yield event.save();
        }
        catch (err) {
            return next(err);
        }
        const result = {
            Success: true,
            Id: savedEvent._id
        };
        res.json(result);
    }
    else {
        try {
            savedEvent = yield Event_1.default.findByIdAndUpdate(dto._id, dto, { upsert: true });
            const result = {
                Success: true,
                Id: savedEvent._id
            };
            res.json(result);
        }
        catch (err) {
            return next(err);
        }
    }
});
exports.deleteEvent = (req, res, next) => {
    Event_1.default.findByIdAndRemove(req.params.eventId, (err, product) => {
        if (err) {
            return next(err);
        }
        const result = {
            Success: true
        };
        res.json(result);
    });
};
exports.getEvents = (req, res, next) => {
    Event_1.default.find((err, events) => {
        if (err) {
            return next(err);
        }
        events = events.map(v => {
            v.Contestants = v.Contestants.sort((c1, c2) => c1.VoteKey - c2.VoteKey);
            return v;
        });
        res.json(events);
    });
};
exports.getEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let event;
    try {
        event = yield Event_1.default.findById(req.params.voteId);
    }
    catch (err) {
        return next(err);
    }
    event.Contestants = event.Contestants.sort((c1, c2) => c1.VoteKey - c2.VoteKey);
    res.json(event);
});

//# sourceMappingURL=event.js.map
