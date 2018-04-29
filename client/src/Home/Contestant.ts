import * as ko from 'knockout';
import { EventContestantDTO } from '../../../shared/ContestantDTO';
import RegistrationDTO from '../../../shared/RegistrationDTO';

export class Contestant {
    public _id: string;

    public Name: KnockoutObservable<string> = ko.observable<string>();
    public ContestantNumber: KnockoutObservable<number> = ko.observable<number>();

    public constructor(dto: EventContestantDTO) {
        this._id = dto._id;
        this.Name(dto.Name);
        this.ContestantNumber(dto.ContestantNumber);
    }

    public ToDTO(): EventContestantDTO {
        const dto: EventContestantDTO = {
            _id: this._id,
            Name: this.Name(),
            ContestantNumber: this.ContestantNumber()
        };
        return dto;
    }

    public OrderUpdated(idx: number): void {
        this.ContestantNumber(idx + 1);
    }
}

export default Contestant;