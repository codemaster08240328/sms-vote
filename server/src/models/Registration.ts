import * as mongoose from 'mongoose';

import RegistrationDTO from '../../../shared/RegistrationDTO';

export interface RegistrationDocument extends RegistrationDTO, mongoose.Document {
}

export const RegistrationSchema: mongoose.Schema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: { type: String, unique: true },
    PhoneNumber: { type: String, unique: true }
});

const RegistrationModel = mongoose.model<RegistrationDocument>('Registration', RegistrationSchema);
export default RegistrationModel;