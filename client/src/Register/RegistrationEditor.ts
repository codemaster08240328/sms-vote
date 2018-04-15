import RegistrationDTO from '../../../shared/RegistrationDTO';
import { Request } from '../Utils/GatewayFunctions';
import { CreateOperationResult } from '../../../shared/OperationResult';

export class RegistrationEditor {
    public _id: string;
    public FirstName: KnockoutObservable<string> = ko.observable<string>();
    public LastName: KnockoutObservable<string> = ko.observable<string>();
    public Email: KnockoutObservable<string> = ko.observable<string>();
    public PhoneNumber: KnockoutObservable<string> = ko.observable<string>();

    public Saving: KnockoutObservable<boolean> = ko.observable<boolean>(false);

    public constructor(public EventId: string, private _submitCallback: (dto: RegistrationDTO) => void) {
    }

    public ToDTO(): RegistrationDTO {
        return {
            _id: this._id,
            FirstName: this.FirstName(),
            LastName: this.LastName(),
            Email: this.Email(),
            PhoneNumber: this.PhoneNumber()
        };
    }

    public async Save() {
        const dto = this.ToDTO();
        const result = await Request<CreateOperationResult>(`api/event/${this.EventId}/register`, 'PUT', dto);
        if (result.Success) {
            dto._id = result.Id;
        }
    }
}

export default RegistrationEditor;