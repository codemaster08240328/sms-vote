"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const RegistrationSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: { type: String, unique: true },
    PhoneNumber: { type: String, unique: true }
});
const RegistrationModel = mongoose.model('Registration', RegistrationSchema);
exports.default = RegistrationModel;

//# sourceMappingURL=Registration.js.map
