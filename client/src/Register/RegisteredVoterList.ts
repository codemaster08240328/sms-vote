import RegistrationDTO from '../../../shared/RegistrationDTO';
import { Request } from '../Utils/GatewayFunctions';
import { BusyTracker } from '../Utils/BusyTracker';

export class RegisteredVoterList {
    public RegisteredVoters: KnockoutObservableArray<RegistrationDTO> = ko.observableArray<RegistrationDTO>();
    public FilteredRegistrations: KnockoutComputed<RegistrationDTO[]>;
    public Filter: KnockoutObservable<string> = ko.observable<string>();

    public LoadingTracker: BusyTracker = new BusyTracker();

    public constructor(eventId: string) {
        this.LoadingTracker.AddOperation(Request<RegistrationDTO[]>(`api/event/${eventId}/registrations`, 'GET')
            .then((dtos) => {
                const registeredVoters: RegistrationDTO[] = dtos
                    .sort((a: RegistrationDTO, b: RegistrationDTO) => a.LastName.compareTo(b.LastName, true));
                this.RegisteredVoters(registeredVoters);
            }));
    }

    public AddRegistration(dto: RegistrationDTO) {
        this.RegisteredVoters.push(dto);
    }

    private ConfigureComputed(): void {
        this.FilteredRegistrations = ko.computed(() => {
            return this.RegisteredVoters()
                .filter(r => {
                    const filter = this.Filter();
                    return r.Email.contains(filter) ||
                        r.FirstName.contains(filter) ||
                        r.LastName.contains(filter) ||
                        r.PhoneNumber.contains(filter);
                });
        });
    }
}

export default RegisteredVoterList;