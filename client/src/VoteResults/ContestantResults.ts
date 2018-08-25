import * as ko from 'knockout';
import { RoundContestantDTO } from '../../../shared/RoundContestantDTO';

export class ContestantResults {
    public EaselNumber: number = null;
    public Name: string = null;
    public Votes: number = null;

    public constructor(dto: RoundContestantDTO, public Rank: number) {
        this.EaselNumber = dto.EaselNumber;
        this.Name = dto.Detail.Name;
        this.Votes = dto.Votes.length;
    }
}

export default ContestantResults;