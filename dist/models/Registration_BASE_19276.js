"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const RegistrationSchema = new mongoose.Schema({
    Email: String,
    PhoneNumber: String
});
const RegistrationModel = mongoose.model('Registration', RegistrationSchema);
exports.default = RegistrationModel;

//# sourceMappingURL=Registration.js.map
