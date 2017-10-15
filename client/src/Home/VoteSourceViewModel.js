import VoteChoiceViewModel from './VoteChoiceViewModel';
export class VoteSourceViewModel {
    constructor(dto) {
        this.Name = ko.observable();
        this.Enabled = ko.observable();
        this.Choices = ko.observableArray();
        this.PhoneNumber = ko.observable();
        this._id = dto._id;
        this.Name(dto.Name);
        this.Enabled(dto.Enabled);
        this.Choices(dto.Choices.map(c => new VoteChoiceViewModel(c)));
        this.PhoneNumber(dto.PhoneNumber);
    }
    ToDTO() {
        const dto = {
            _id: this._id,
            Name: this.Name(),
            Enabled: this.Enabled(),
            Choices: this.Choices().map(c => c.ToDTO()),
            PhoneNumber: this.PhoneNumber()
        };
        return dto;
    }
}
export default VoteSourceViewModel;
//# sourceMappingURL=VoteSourceViewModel.js.map