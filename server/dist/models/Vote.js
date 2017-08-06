"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const VoteSchema = new mongoose.Schema({
    Voter: { type: String, unique: true },
    VoteChoice: String
});
// const Vote = mongoose.model('Vote', VoteSchema);
// export default Vote; 
//# sourceMappingURL=Vote.js.map