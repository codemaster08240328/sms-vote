import * as ko from 'knockout';
import VoteChoiceDTO from '../../../shared/VoteChoiceDTO';

export class VoteSourceViewModel {
    private _id: string;

    public Name: KnockoutObservable<string> = ko.observable<string>();
    public Numbers: KnockoutObservableArray<string> = ko.observableArray<string>();

    public constructor(dto: VoteChoiceDTO) {
        this._id = dto._id;

        this.Name(dto.Name);
        this.Numbers(dto.Numbers);
    }

    public ToDTO(index: number) {
        const dto: VoteChoiceDTO = {
            _id: this._id,
            Name: this.Name(),
            VoteKey: index + 1,
            Numbers: this.Numbers()
        };
        return dto;
    }
}

export default VoteSourceViewModel;