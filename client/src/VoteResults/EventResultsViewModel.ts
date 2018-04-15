import EventDTO from '../../../shared/EventDTO';
import Round from './Round';
import { Request } from '../Utils/GatewayFunctions';
import { BusyTracker } from '../Utils/BusyTracker';

export class EventResultsViewModel {
    public Name: KnockoutObservable<string> = ko.observable<string>();
    public Rounds: KnockoutObservableArray<Round> = ko.observableArray<Round>();
    public LoadingTracker: BusyTracker = new BusyTracker();

    // path is artbattle.com/event/{eventId}/round/{roundId}/results
    private _eventId: string = location.pathname.split('/')[1];

    public constructor() {
        this.LoadingTracker.AddOperation(Request<EventDTO>(`api/event/${this._eventId}`, 'GET')
            .then((dto) => {
                this.Name(dto.Name);
                const rounds: Round[] = dto.Rounds
                    .sort((a, b) => a.RoundNumber - b.RoundNumber)
                    .map(c => new Round(c));
            }));
    }
}

export default EventResultsViewModel;