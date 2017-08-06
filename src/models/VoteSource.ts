import * as mongoose from "mongoose";

export interface VoteOptions {
        Id: string;
        Name: string;
        Votes: number;
        Numbers: string[];
}

export interface VoteSourceModel extends mongoose.Document {
    Name: string;
    Enabled: boolean;
    Options: VoteOptions;
}

const VoteSourceSchema: mongoose.Schema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Enabled: String,
    Options:
    {
        Id: String,
        Name: String,
        Votes: Number,
        Numbers: [String]
    }
});

const VoteSource = mongoose.model("User", VoteSourceSchema);
export default VoteSource;