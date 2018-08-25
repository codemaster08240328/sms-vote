import EventDTO from '../../../shared/EventDTO';
import Round from './Round';
import { Request } from '../Utils/GatewayFunctions';
import { BusyTracker } from '../Utils/BusyTracker';

export class EventResultsViewModel {
    public Name: KnockoutObservable<string> = ko.observable<string>();
    public Rounds: KnockoutObservableArray<Round> = ko.observableArray<Round>();
    public RegistrationCount: KnockoutObservable<number> = ko.observable<number>();
    public LoadingTracker: BusyTracker = new BusyTracker();

    // path is artbattle.com/event/{eventId}/results
    private _eventId: string = location.pathname.split('/')[2];

    public constructor() {
        this.LoadingTracker.AddOperation(Request<EventDTO>(`/api/event/${this._eventId}`, 'GET')
            .then((dto) => {
                this.Name(dto.Name);
                this.RegistrationCount(dto.Registrations.length);
                const rounds: Round[] = dto.Rounds
                    .sort((a, b) => a.RoundNumber - b.RoundNumber)
                    .map(c => {
                        const isCurrentRound = dto.CurrentRound && dto.CurrentRound._id == c._id;
                        return new Round(isCurrentRound ? dto.CurrentRound : c, isCurrentRound);
                    });

                this.Rounds(rounds);
            }));
    }
}

export default EventResultsViewModel;