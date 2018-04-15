import * as ko from 'knockout';
import ContestantDTO from '../../../shared/ContestantDTO';

export class ContestantResults {
    public VoteKey: number = null;
    public Name: string = null;
    public Votes: number = null;

    public constructor(dto: ContestantDTO, public Rank: number) {
        this.VoteKey = dto.VoteKey;
        this.Name = dto.Name;
        this.Votes = dto.Votes.length;
    }
}

export default ContestantResults;