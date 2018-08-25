import * as ko from 'knockout';
import {RoundContestantConfigDTO} from '../../../shared/RoundContestantDTO';
import RegistrationDTO from '../../../shared/RegistrationDTO';
import { ObjectId } from 'bson';
import { Contestant } from './Contestant';
import { RoundDTO } from '../../../shared/RoundDTO';

export class RoundContestant {

    public _id: string;

    public Detail: Contestant;
    public Enabled: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    public EaselNumber: KnockoutObservable<number> = ko.observable<number>();

    public constructor(contestant: Contestant, dto?: RoundContestantConfigDTO) {
        this.Detail = contestant;
        this._id = dto ? dto._id : new ObjectId().toHexString();
        if (dto) {
            this.Enabled(dto.Enabled || false);
            this.EaselNumber(dto.EaselNumber);
        }
    }

    public ToDTO(): RoundContestantConfigDTO {
        const dto: RoundContestantConfigDTO = {
            _id: this._id,
            Detail: this.Detail.ToDTO(),
            Enabled: this.Enabled(),
            EaselNumber: this.EaselNumber()
        };
        return dto;
    }

}

export default RoundContestant;