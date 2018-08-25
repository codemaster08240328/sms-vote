import * as ko from 'knockout';
import { EventContestantDTO } from '../../../shared/ContestantDTO';
import RegistrationDTO from '../../../shared/RegistrationDTO';
import { ObjectId } from 'bson';

export class Contestant {
    public _id: string;

    public Name: KnockoutObservable<string> = ko.observable<string>();

    public constructor(dto: EventContestantDTO) {
        this._id = dto._id;
        this.Name(dto.Name);
    }

    public ToDTO(): EventContestantDTO {
        const dto: EventContestantDTO = {
            _id: this._id,
            Name: this.Name(),
        };
        return dto;
    }
}

export default Contestant;