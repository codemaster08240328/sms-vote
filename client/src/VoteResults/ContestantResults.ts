import * as ko from 'knockout';
import { RoundContestantDTO } from '../../../shared/ContestantDTO';

export class ContestantResults {
    public ContestantNumber: number = null;
    public Name: string = null;
    public Votes: number = null;

    public constructor(dto: RoundContestantDTO, public Rank: number) {
        this.ContestantNumber = dto.ContestantNumber;
        this.Name = dto.Name;
        this.Votes = dto.Votes.length;
    }
}

export default ContestantResults;