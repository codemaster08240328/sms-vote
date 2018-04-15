import ContestantDTO from '../../../shared/ContestantDTO';
import {RoundConfigDTO} from '../../../shared/RoundDTO';
import { Contestant } from './Contestant';

export class Round {
    public RoundNumber: number;
    public Contestants: KnockoutObservableArray<Contestant> = ko.observableArray<Contestant>();
    public AvailableContestants: KnockoutComputed<Contestant>;

    private _id: string;

    public constructor(dto: RoundConfigDTO,
            private _eventContestants: KnockoutObservableArray<Contestant>) {
        this._id = dto._id;
        this.RoundNumber = dto.RoundNumber;
        this.Contestants(dto.Contestants.map(c => _eventContestants().find(ec => ec.VoteKey == c.VoteKey)));
    }

    public ToDTO(): RoundConfigDTO {
        return {
            _id: this._id,
            RoundNumber: this.RoundNumber,
            Contestants:  this.Contestants().map(c => c.ToDTO())
        };
    }
}

export default Round;