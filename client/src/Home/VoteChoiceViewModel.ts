import * as ko from 'knockout';
import VoteChoiceDTO from '../../../shared/VoteChoiceDTO';

export class VoteSourceViewModel {
    public Name: KnockoutObservable<string> = ko.observable<string>();
    public Numbers: KnockoutObservableArray<string> = ko.observableArray<string>();

    private _id: string;

    public constructor(dto: VoteChoiceDTO) {
        this._id = dto._id;

        this.Name(dto.Name);
        this.Numbers(dto.Numbers);
    }

    public ToDTO() {
        const dto: VoteChoiceDTO = {
            Name: this.Name(),
            Numbers: this.Numbers(),
            _id: this._id
        };
        return dto;
    }
}

export default VoteSourceViewModel;