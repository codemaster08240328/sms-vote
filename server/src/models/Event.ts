import * as mongoose from 'mongoose';

import { RegistrationSchema } from './Registration';
import EventDTO from '../../../shared/EventDTO';
import RoundDTO from '../../../shared/RoundDTO';
import ContestantDTO from '../../../shared/ContestantDTO';
import RegistrationDTO from '../../../shared/RegistrationDTO';


export interface EventDocument extends EventDTO, mongoose.Document {
    hasVoted(phoneNumber: string): boolean;
}

const ContestantSchema: mongoose.Schema = new mongoose.Schema({
    Name: String,
    VoteKey: Number,
    Votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration', unique: true }]
});

const RoundSchema: mongoose.Schema = new mongoose.Schema({
    RoundNumber: Number,
    Contestants: [ContestantSchema]
});

const EventSchema: mongoose.Schema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Contestants: [ContestantSchema],
    Rounds: [RoundSchema],
    PhoneNumber: String,
    Registrations: [RegistrationSchema],
    CurrentRound: RoundSchema
});

EventSchema.methods.hasVoted = function(phoneNumber: string): boolean {
    return (<EventDocument>this).CurrentRound.Contestants
        .reduce((prev: string[], cur: ContestantDTO) => prev.concat(cur.Votes.map(v => v.PhoneNumber)), [])
        .find(n => n === phoneNumber) ? true : false;
    };

const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
export default EventModel;