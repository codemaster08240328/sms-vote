import * as ko from 'knockout';
export class VoteSourceViewModel {
    constructor(dto) {
        this.Name = ko.observable();
        this.Numbers = ko.observableArray();
        this._id = dto._id;
        this.Name(dto.Name);
        this.Numbers(dto.Numbers);
    }
    ToDTO() {
        const dto = {
            Name: this.Name(),
            Numbers: this.Numbers(),
            _id: this._id
        };
        return dto;
    }
}
export default VoteSourceViewModel;
//# sourceMappingURL=VoteChoiceViewModel.js.map