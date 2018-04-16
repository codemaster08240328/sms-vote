import * as ko from 'knockout';
import { ContestantConfigDTO } from '../../../shared/ContestantDTO';
import RegistrationDTO from '../../../shared/RegistrationDTO';

export class Contestant {
    public _id: string;

    public Name: KnockoutObservable<string> = ko.observable<string>();
    public VoteKey: number;

    public constructor(dto: ContestantConfigDTO) {
        this._id = dto._id;
        this.Name(dto.Name);
    }

    public ToDTO(): ContestantConfigDTO {
        const dto: ContestantConfigDTO = {
            _id: this._id,
            Name: this.Name(),
            VoteKey: this.VoteKey
        };
        return dto;
    }

    public OrderUpdated(idx: number): void {
        this.VoteKey = idx + 1;
    }
}

export default Contestant;