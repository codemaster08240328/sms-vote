import * as mongoose from 'mongoose';

import { RegistrationSchema } from './Registration';
import EventDTO from '../../../shared/EventDTO';
import RoundDTO from '../../../shared/RoundDTO';
import RoundContestantDTO from '../../../shared/RoundContestantDTO';
import RegistrationDTO from '../../../shared/RegistrationDTO';
import { runInThisContext } from 'vm';


export interface EventDocument extends EventDTO, mongoose.Document {
    hasVoted(phoneNumber: string): boolean;
    edit(dto: EventDTO): void;
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
    IsFinished: { type: Boolean, default: false }
});

const EventSchema: mongoose.Schema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Contestants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Contestant'}],
    Rounds: [RoundSchema],
    PhoneNumber: String,
    Registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }],
    CurrentRound: RoundSchema,
    Enabled: Boolean,
    RegistrationConfirmationMessage: String
});

EventSchema.methods.hasVoted = function(phoneNumber: string): boolean {
        const thisEvent = (<EventDocument>this);
        return thisEvent.CurrentRound.Contestants.reduce((prev: string[], cur: RoundContestantDTO) => prev.concat(cur.Votes.map(v => v.PhoneNumber)), [])
            .find(n => n === phoneNumber) ? true : false;
    };

EventSchema.methods.edit = function(dto: EventDTO): void {
    const thisEvent = (<EventDocument>this);
    thisEvent.Name = dto.Name;
    thisEvent.PhoneNumber = dto.PhoneNumber;
    thisEvent.Contestants = dto.Contestants;
    thisEvent.RegistrationConfirmationMessage = dto.RegistrationConfirmationMessage;
    thisEvent.Enabled = dto.Enabled;
    const roundIds = dto.Rounds.map(r => r._id);
    thisEvent.Rounds = thisEvent.Rounds.filter(r => roundIds.contains((<any>r).id));
    thisEvent.Rounds.forEach(r => {
        const roundDto = dto.Rounds.find(x => x._id == (<any>r).id);
        const contestantIds = roundDto.Contestants.map(c => c._id);
        r.Contestants = r.Contestants.filter(c => contestantIds.contains((<any>c).id));
        r.Contestants.forEach(c => {
            const contestantDto = roundDto.Contestants.find(x => x._id == (<any>c).id);
            c.EaselNumber = contestantDto.EaselNumber;
            c.Enabled = contestantDto.Enabled;
        });
    });
    const newRounds = dto.Rounds.filter(rdto => !thisEvent.Rounds.map(r => (<any>r).id).contains(rdto._id));
    thisEvent.Rounds.addRange(newRounds);
};

const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
export default EventModel;