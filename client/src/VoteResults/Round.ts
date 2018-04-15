import RoundDTO from '../../../shared/RoundDTO';
import ContestantResults from './ContestantResults';

export class Round {
    public RoundNumber: KnockoutObservable<number> = ko.observable<number>();
    public Contestants: KnockoutObservableArray<ContestantResults> = ko.observableArray<ContestantResults>();

    public constructor(dto: RoundDTO) {
        this.RoundNumber(dto.RoundNumber);
        const contestants: ContestantResults[] = dto.Contestants
            .sort((a, b) => b.Votes.length - a.Votes.length)
            .map((c, idx) => new ContestantResults(c, idx + 1));
        this.Contestants(contestants);
    }
}

export default Round;