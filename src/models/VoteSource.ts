import * as mongoose from 'mongoose';

import VoteChoiceDTO from '../../shared/VoteChoiceDTO';
import VoteSourceDTO from '../../shared/VoteSourceDTO';

export interface VoteSourceDocument extends VoteSourceDTO, mongoose.Document {}

const VoteSourceSchema: mongoose.Schema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Enabled: String,
    Choices:
    [{
        Id: String,
        Name: String,
        Numbers: [{ type: String }]
    }],
    PhoneNumber: String
});

VoteSourceSchema.methods.hasVoted = function(phoneNumber: string): boolean {
    const choices: VoteChoiceDTO[] = (<VoteSourceDocument>this).Choices;
    return choices
        .reduce((prev: string[], cur: VoteChoiceDTO) => prev.concat(cur.Numbers), [])
        .find(n => n === phoneNumber) ? true : false;
    };

const VoteSourceModel = mongoose.model('VoteSource', VoteSourceSchema);
export default VoteSourceModel;