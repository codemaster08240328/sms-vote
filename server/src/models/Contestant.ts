import * as mongoose from 'mongoose';

import { ContestantDTO } from '../../../shared/ContestantDTO';


export interface ContestantDocument extends ContestantDTO, mongoose.Document {
}

export const ContestantSchema: mongoose.Schema = new mongoose.Schema({
    Name: String
});

const ContestantModel = mongoose.model<ContestantDocument>('Contestant', ContestantSchema);
export default ContestantModel;