import * as mongoose from 'mongoose';

export interface VoteChoice {
        Id: string;
        Name: string;
        Numbers: string[];
}

export interface VoteSourceModel extends mongoose.Document {
    Name: string;
    Enabled: boolean;
    Choices: VoteChoice[];
    PhoneNumber: string;
    hasVoted(phoneNumber: string): boolean;
}

const VoteSourceSchema: mongoose.Schema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Enabled: String,
    Choices:
    [{
        Id: String,
        Name: String,
        Numbers: [{ type: String, unique: true }]
    }],
    PhoneNumber: String
});

VoteSourceSchema.methods.hasVoted = function(phoneNumber: string): boolean {
    const choices: VoteChoice[] = (<VoteSourceModel>this).Choices;
    return choices
        .reduce((prev: string[], cur: VoteChoice) => prev.concat(cur.Numbers), [])
        .find(n => n === phoneNumber) ? true : false;
    };

const VoteSource = mongoose.model('VoteSource', VoteSourceSchema);
export default VoteSource;