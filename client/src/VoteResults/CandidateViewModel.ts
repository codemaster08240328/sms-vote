import * as ko from 'knockout';
import VoteChoiceDTO from '../../../shared/VoteChoiceDTO';

export class CandidateViewModel {
    public VoteKey: number = null;
    public Name: string = null;
    public Votes: number = null;

    public constructor(dto: VoteChoiceDTO, public Rank: number) {
        this.VoteKey = dto.VoteKey;
        this.Name = dto.Name;
        this.Votes = dto.Numbers.length;
    }
}

export default CandidateViewModel;