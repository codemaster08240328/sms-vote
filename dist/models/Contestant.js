"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.ContestantSchema = new mongoose.Schema({
    Name: String
});
const ContestantModel = mongoose.model('Contestant', exports.ContestantSchema);
exports.default = ContestantModel;

//# sourceMappingURL=Contestant.js.map
