import { ContestantConfigDTO } from '../../../shared/ContestantDTO';
import { EventConfigDTO } from '../../../shared/EventDTO';
import Contestant from './Contestant';
import Round from './Round';

export class VotingEvent {

    public Name: KnockoutObservable<string> = ko.observable<string>();
    public Enabled: KnockoutObservable<boolean> = ko.observable<boolean>();
    public Contestants: KnockoutObservableArray<Contestant> = ko.observableArray<Contestant>();
    public Rounds: KnockoutObservableArray<Round> = ko.observableArray<Round>();
    public PhoneNumber: KnockoutObservable<string> = ko.observable<string>();
    public CurrentRound: KnockoutObservable<Round> = ko.observable<Round>();

    private _id: string;

    public constructor(dto: EventConfigDTO) {
        this._id = dto._id;
        this.Name(dto.Name);
        this.Enabled(dto.Enabled);
        this.Contestants(dto.Contestants.map(c => new Contestant(c)));
        this.PhoneNumber(dto.PhoneNumber);
    }

    public ToDTO(): EventConfigDTO {
        const dto: EventConfigDTO = {
            _id: this._id,
            Name: this.Name(),
            Enabled: this.Enabled(),
            Contestants: this.Contestants().map((c) => c.ToDTO()),
            PhoneNumber: this.PhoneNumber(),
            Rounds: this.Rounds().map((r) => r.ToDTO()),
            CurrentRound: this.CurrentRound().ToDTO()
        };
        return dto;
    }

    public AddContestant(): void {
        this.Contestants.push(new Contestant({
            _id: undefined,
            Name: '',
            VoteKey: this.Contestants().length,
        }));
    }

    public DeleteContestant(contestant: Contestant): void {
        this.Contestants.remove(contestant);
        this.Rounds().forEach(r => r.Contestants.remove(contestant));
    }

    public AddRound(): void {
        this.Rounds.push(new Round({
            _id: null,
            RoundNumber: this.Rounds().length + 1,
            Contestants: []
        }, this.Contestants));
    }

    public DeleteRound(round: Round): void {
        this.Rounds.remove(round);
    }

    public SetCurrentRound(round: Round): void {
        this.CurrentRound(round);
    }
}

export default VotingEvent;