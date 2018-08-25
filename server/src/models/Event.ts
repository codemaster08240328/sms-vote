import * as mongoose from 'mongoose';

import { RegistrationSchema } from './Registration';
import EventDTO from '../../../shared/EventDTO';
import RoundDTO from '../../../shared/RoundDTO';
import RoundContestantDTO from '../../../shared/RoundContestantDTO';
import RegistrationDTO from '../../../shared/RegistrationDTO';


export interface EventDocument extends EventDTO, mongoose.Document {
    hasVoted(phoneNumber: string): boolean;
}

const RoundContestantSchema: mongoose.Schema = new mongoose.Schema({
    Detail: { type: mongoose.Schema.Types.ObjectId, ref: 'Contestant'},
    Enabled: Boolean,
    EaselNumber: Number,
    Votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration'}]
});

const RoundSchema: mongoose.Schema = new mongoose.Schema({
    RoundNumber: Number,
    Contestants: [RoundContestantSchema],
    IsFinished: Boolean
});

const EventSchema: mongoose.Schema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Contestants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Contestant'}],
    Rounds: [RoundSchema],
    PhoneNumber: String,
    Registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }],
    CurrentRound: RoundSchema,
    Enabled: Boolean
});

EventSchema.methods.hasVoted = function(phoneNumber: string): boolean {
        const thisEvent = (<EventDocument>this);
        return thisEvent.CurrentRound.Contestants.reduce((prev: string[], cur: RoundContestantDTO) => prev.concat(cur.Votes.map(v => v.PhoneNumber)), [])
            .find(n => n === phoneNumber) ? true : false;
    };

const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
export default EventModel;