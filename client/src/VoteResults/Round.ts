import RoundDTO from '../../../shared/RoundDTO';
import ContestantResults from './ContestantResults';

export class Round {
    public RoundNumber: KnockoutObservable<number> = ko.observable<number>();
    public IsFinished: boolean = false;
    public Contestants: KnockoutObservableArray<ContestantResults> = ko.observableArray<ContestantResults>();
    public VotesCast: number;

    public constructor(dto: RoundDTO, public IsCurrentRound: boolean) {
        this.RoundNumber(dto.RoundNumber);
        this.IsFinished = dto.IsFinished;
        const contestants: ContestantResults[] = dto.Contestants
            .filter(c => c.Enabled)
            .sort((a, b) => b.Votes.length - a.Votes.length)
            .map((c, idx) => new ContestantResults(c, idx + 1));
        this.Contestants(contestants);
        this.VotesCast = dto.Contestants.map(c => c.Votes.length).reduce((prv, cur) => prv + cur, 0);
    }
}

export default Round;