import * as mongoose from 'mongoose';

export interface VoteModel extends mongoose.Document {
    Voter: string;
    VoteChoice: string;
}

const VoteSchema: mongoose.Schema = new mongoose.Schema({
    Voter: { type: String, unique: true },
    VoteChoice: String
});

// const Vote = mongoose.model('Vote', VoteSchema);

// export default Vote;