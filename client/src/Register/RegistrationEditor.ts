import RegistrationDTO from '../../../shared/RegistrationDTO';
import { Request } from '../Utils/GatewayFunctions';
import { DataOperationResult } from '../../../shared/OperationResult';
import { IsPhoneNumber } from '../Utils/ValidationUtils';

export class RegistrationEditor {
    public _id: string;
    public FirstName: KnockoutObservable<string> = ko.observable<string>();
    public LastName: KnockoutObservable<string> = ko.observable<string>();
    public Email: KnockoutObservable<string> = ko.observable<string>();

    public PhoneNumber: KnockoutObservable<string> = ko.observable<string>();
    public IsPhoneNumberValid: KnockoutObservable<boolean> = ko.observable<boolean>(true);

    public Saving: KnockoutObservable<boolean> = ko.observable<boolean>(false);

    public constructor(public EventId: string,
        private _submitCallback: (dto: RegistrationDTO) => void,
        private _resetCallback: () => void ) {
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

    public Load(dto: RegistrationDTO): void {
        this.FirstName(dto.FirstName);
        this.LastName(dto.LastName);
        this.Email(dto.Email);
        this.PhoneNumber(dto.PhoneNumber);
    }

    public async Save(): Promise<void> {
        const dto = this.ToDTO();
        if (this.CheckValid()) {
            const result = await Request<DataOperationResult<RegistrationDTO>>(`/api/event/${this.EventId}/register`, 'PUT', dto);
            if (result.Success) {
                this._id = result.Data._id;
                this._submitCallback(result.Data);
            }
        }
    }

    public Reset(): void {
        this._resetCallback();
    }

    private CheckValid(): boolean {
        if (IsPhoneNumber(this.PhoneNumber())) {
            return true;
        } else {
            this.IsPhoneNumberValid(false);
        }
    }

}

export default RegistrationEditor;