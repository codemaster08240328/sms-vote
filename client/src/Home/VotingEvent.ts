import { ContestantDTO } from '../../../shared/ContestantDTO';
import { EventConfigDTO } from '../../../shared/EventDTO';
import Contestant from './Contestant';
import Round from './Round';
import { ObjectId } from 'bson';

export class VotingEvent {

    public Name: KnockoutObservable<string> = ko.observable<string>();
    public Enabled: KnockoutObservable<boolean> = ko.observable<boolean>();
    public Contestants: KnockoutObservableArray<Contestant> = ko.observableArray<Contestant>();
    public Rounds: KnockoutObservableArray<Round> = ko.observableArray<Round>();
    public PhoneNumber: KnockoutObservable<string> = ko.observable<string>();
    public CurrentRound: KnockoutObservable<Round> = ko.observable<Round>();
    public DisplayContestants: KnockoutComputed<string>;

    private _id: string;

    public constructor(dto: EventConfigDTO) {
        this._id = dto._id;
        this.Name(dto.Name);
        this.Enabled(dto.Enabled);
        this.Contestants(dto.Contestants.map(c => new Contestant(c)));
        this.Rounds(dto.Rounds.map(r => new Round(r, this.Contestants)));
        this.PhoneNumber(dto.PhoneNumber);

        this.DisplayContestants = ko.computed(() => this.Contestants().map(c => c.Name).join(', '));
    }

    public ToDTO(): EventConfigDTO {
        const dto: EventConfigDTO = {
            _id: this._id,
            Name: this.Name(),
            Enabled: this.Enabled(),
            Contestants: this.Contestants().map((c) => c.ToDTO()),
            PhoneNumber: this.PhoneNumber(),
            Rounds: this.Rounds().map((r) => r.ToDTO()),
            CurrentRound: this.CurrentRound() && this.CurrentRound().ToDTO()
        };
        return dto;
    }

    public ContestantOrderUpdated(): void {
        this.Contestants().forEach((c, idx) => {
            c.ContestantNumber(idx);
        });

        this.Rounds().forEach((r) => {

        });
    }

    public AddContestant(): void {
        this.Contestants.push(new Contestant({
            _id: new ObjectId().toHexString(),
            Name: '',
            ContestantNumber: this.Contestants().length,
        }));
    }

    public DeleteContestant(contestant: Contestant): void {
        this.Contestants.remove(contestant);
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