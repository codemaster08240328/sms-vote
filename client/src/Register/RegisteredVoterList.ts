import RegistrationDTO from '../../../shared/RegistrationDTO';
import { Request } from '../Utils/GatewayFunctions';
import { BusyTracker } from '../Utils/BusyTracker';

export class RegisteredVoterList {
    public Voters: KnockoutObservableArray<RegistrationDTO> = ko.observableArray<RegistrationDTO>();
    public FilteredRegistrations: KnockoutComputed<RegistrationDTO[]>;
    public Filter: KnockoutObservable<string> = ko.observable<string>();

    public LoadingTracker: BusyTracker = new BusyTracker();

    public constructor(eventId: string, private _voterSelectedCallback: (voter: RegistrationDTO) => void) {
        this.LoadingTracker.AddOperation(Request<RegistrationDTO[]>(`/api/event/${eventId}/registrations`, 'GET')
            .then((dtos) => {
                const registeredVoters: RegistrationDTO[] = dtos
                .sort((a: RegistrationDTO, b: RegistrationDTO) => a.PhoneNumber.compareTo(b.PhoneNumber, true));
                this.Voters(registeredVoters);
            }));
        this.ConfigureComputed();
    }

    public UpdateRegistration(dto: RegistrationDTO) {
        const registrations = this.Voters();
        const eventRegistration = registrations.find(r => r.PhoneNumber == dto.PhoneNumber);
        if (eventRegistration) {
            registrations.splice(registrations.indexOf(eventRegistration), 1, dto);
            this.Voters(registrations);
        } else {
            this.Voters.push(dto);
        }
    }

    public Selected(dto: RegistrationDTO) {
        this._voterSelectedCallback(dto);
    }

    private ConfigureComputed(): void {
        this.FilteredRegistrations = ko.computed(() => {
            if (this.Filter()) {
                const filter = this.Filter().toLocaleLowerCase();
                const filteredVoters = this.Voters()
                    .filter(r => {
                        return (r.Email && r.Email.toLocaleLowerCase().contains(filter)) ||
                            (r.FirstName && r.FirstName.toLocaleLowerCase().contains(filter)) ||
                            (r.LastName && r.LastName.toLocaleLowerCase().contains(filter)) ||
                            (r.PhoneNumber && r.PhoneNumber.toLocaleLowerCase().contains(filter));
                    });
                return filteredVoters;
            } else {
                return this.Voters();
            }
        });
    }
}

export default RegisteredVoterList;