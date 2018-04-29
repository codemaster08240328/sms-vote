"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Registration_1 = require("./Registration");
const EventContestantSchema = new mongoose.Schema({
    Name: String,
    ContestantNumber: Number,
});
const RoundContestantSchema = new mongoose.Schema({
    Name: String,
    ContestantNumber: Number,
    Votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration', unique: true }]
});
const RoundSchema = new mongoose.Schema({
    RoundNumber: Number,
    Contestants: [RoundContestantSchema]
});
const EventSchema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Contestants: [EventContestantSchema],
    Rounds: [RoundSchema],
    PhoneNumber: String,
    Registrations: [Registration_1.RegistrationSchema],
    CurrentRound: RoundSchema,
    Enabled: Boolean
});
EventSchema.methods.hasVoted = function (phoneNumber) {
    return this.CurrentRound.Contestants
        .reduce((prev, cur) => prev.concat(cur.Votes.map(v => v.PhoneNumber)), [])
        .find(n => n === phoneNumber) ? true : false;
};
const EventModel = mongoose.model('Event', EventSchema);
exports.default = EventModel;

//# sourceMappingURL=Event.js.map
