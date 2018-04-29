import * as mongoose from 'mongoose';

import { RegistrationSchema } from './Registration';
import EventDTO from '../../../shared/EventDTO';
import RoundDTO from '../../../shared/RoundDTO';
import RoundContestantDTO from '../../../shared/ContestantDTO';
import RegistrationDTO from '../../../shared/RegistrationDTO';


export interface EventDocument extends EventDTO, mongoose.Document {
    hasVoted(phoneNumber: string): boolean;
}

const EventContestantSchema: mongoose.Schema = new mongoose.Schema({
    Name: String,
    ContestantNumber: Number,
});

const RoundContestantSchema: mongoose.Schema = new mongoose.Schema({
    Name: String,
    ContestantNumber: Number,
    Votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration', unique: true }]
});

const RoundSchema: mongoose.Schema = new mongoose.Schema({
    RoundNumber: Number,
    Contestants: [RoundContestantSchema]
});

const EventSchema: mongoose.Schema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Contestants: [EventContestantSchema],
    Rounds: [RoundSchema],
    PhoneNumber: String,
    Registrations: [RegistrationSchema],
    CurrentRound: RoundSchema,
    Enabled: Boolean
});

EventSchema.methods.hasVoted = function(phoneNumber: string): boolean {
    return (<EventDocument>this).CurrentRound.Contestants
        .reduce((prev: string[], cur: RoundContestantDTO) => prev.concat(cur.Votes.map(v => v.PhoneNumber)), [])
        .find(n => n === phoneNumber) ? true : false;
    };

const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
export default EventModel;