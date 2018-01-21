"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const VoteSourceSchema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Enabled: String,
    Choices: [{
            Name: String,
            VoteKey: { type: Number, default: 0 },
            Numbers: [{ type: String }]
        }],
    PhoneNumber: String
});
VoteSourceSchema.methods.hasVoted = function (phoneNumber) {
    const choices = this.Choices;
    return choices
        .reduce((prev, cur) => prev.concat(cur.Numbers), [])
        .find(n => n === phoneNumber) ? true : false;
};
const VoteSourceModel = mongoose.model('VoteSource', VoteSourceSchema);
exports.default = VoteSourceModel;

//# sourceMappingURL=VoteSource.js.map
