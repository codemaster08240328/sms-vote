import VoteChoiceDTO from '../../../shared/VoteChoiceDTO';
import VoteSourceDTO from '../../../shared/VoteSourceDTO';
import VoteChoiceViewModel from './VoteChoiceViewModel';

export class VoteSourceViewModel {

    public Name: KnockoutObservable<string> = ko.observable<string>();
    public Enabled: KnockoutObservable<boolean> = ko.observable<boolean>();
    public Choices: KnockoutObservableArray<VoteChoiceViewModel> = ko.observableArray<VoteChoiceViewModel>();
    public PhoneNumber: KnockoutObservable<string> = ko.observable<string>();

    private _id: string;

    public constructor(dto: VoteSourceDTO) {
        this._id = dto._id;
        this.Name(dto.Name);
        this.Enabled(dto.Enabled);
        this.Choices(dto.Choices.map(c => new VoteChoiceViewModel(c)));
        this.PhoneNumber(dto.PhoneNumber);
    }

    public ToDTO(): VoteSourceDTO {
        const dto: VoteSourceDTO = {
            _id: this._id,
            Name: this.Name(),
            Enabled: this.Enabled(),
            Choices: this.Choices().map((c, idx) => c.ToDTO(idx)),
            PhoneNumber: this.PhoneNumber()
        };
        return dto;
    }

    public AddChoice(): void {
        this.Choices.push(new VoteChoiceViewModel({
            _id: undefined,
            Name: '',
            VoteKey: this.Choices().length,
            Numbers: []
        }));
    }

    public DeleteChoice(choice: VoteChoiceViewModel): void {
        this.Choices.remove(choice);
    }
}

export default VoteSourceViewModel;