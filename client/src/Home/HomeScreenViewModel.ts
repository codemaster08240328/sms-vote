import * as ko from 'knockout';
import { Request } from '../Utils/GatewayFunctions';
import { OperationResult } from '../../../shared/OperationResult';
import { EventConfigDTO, EventDTO } from '../../../shared/EventDTO';
import EventEditor from './EventEditor';
import { BusyTracker } from '../Utils/BusyTracker';
import EventSummary from './EventSummary';

import { ObjectId } from 'bson';

export class HomeScreenViewModel {
    public Events: KnockoutObservableArray<EventSummary> = ko.observableArray<EventSummary>();
    public Editor: KnockoutObservable<EventEditor> = ko.observable<EventEditor>();

    public LoadingTracker: BusyTracker = new BusyTracker();

    public constructor() {
        this.LoadEvents();
    }

    public AddNew() {
        this.Editor(new EventEditor({
            _id: new ObjectId().toHexString(),
            Name: '',
            Enabled: false,
            Contestants: [],
            PhoneNumber: '',
            Rounds: [],
            CurrentRound: null,
            RegistrationConfirmationMessage: ''
        },
        (result) => {
            if (result) {
                this.LoadEvents();
            }
            this.Editor(null);
        }));
    }

    public async Edit(eventId: string) {
        const event = await this.LoadingTracker.AddOperation(Request<EventConfigDTO>(`api/event/${eventId}`, 'GET'));
        this.Editor(new EventEditor(event, (result) => {
            if (result) {
                this.LoadEvents();
            }
            this.Editor(null);
        }));
    }

    public async Delete(event: EventSummary) {
        const result = await Request<OperationResult>(`api/event/${event._id}`, 'DELETE');
        if (result.Success) {
            this.Events.remove(event);
        }
    }

    public async LoadEvents(): Promise<void> {
        return this.LoadingTracker.AddOperation(Request<EventDTO[]>('api/events', 'GET')
            .then((dtos) => {
                this.Events(dtos.map(e => new EventSummary(e)));
            }));
    }
}

export default HomeScreenViewModel;